import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { WsJwtGuard } from './ws-jwt.guard';
import { WebSocketService } from './websocket.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
  namespace: '/',
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(EventsGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly wsService: WebSocketService
  ) {}

  afterInit() {
    this.wsService.setServer(this.server);
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token = this.extractToken(client);
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const userId = payload.sub as string;

      // Store user info on socket
      client.data.userId = userId;

      // Join user's personal room
      await client.join(`user:${userId}`);

      this.logger.log(`Client connected: ${client.id} (user: ${userId})`);
    } catch (error) {
      this.logger.warn(`Connection rejected: ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId as string | undefined;
    this.logger.log(`Client disconnected: ${client.id} (user: ${userId ?? 'unknown'})`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    return { event: 'pong', data: { timestamp: new Date().toISOString() } };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('subscribe:goal')
  async handleSubscribeGoal(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { goalId: string }
  ) {
    const userId = client.data.userId as string;
    await client.join(`goal:${data.goalId}:${userId}`);
    return { event: 'subscribed', data: { goalId: data.goalId } };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('unsubscribe:goal')
  async handleUnsubscribeGoal(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { goalId: string }
  ) {
    const userId = client.data.userId as string;
    await client.leave(`goal:${data.goalId}:${userId}`);
    return { event: 'unsubscribed', data: { goalId: data.goalId } };
  }

  private extractToken(client: Socket): string | null {
    const authHeader = client.handshake.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    const token = client.handshake.auth.token as string | undefined;
    if (token) {
      return token;
    }

    return null;
  }
}

