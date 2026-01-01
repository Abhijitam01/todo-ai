import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed the database with initial data.
 * This is primarily for development and testing.
 */
async function main() {
  console.log('🌱 Seeding database...');

  // TODO: Add seed data for development
  // Example:
  // const testUser = await prisma.user.upsert({
  //   where: { email: 'test@todoai.com' },
  //   update: {},
  //   create: {
  //     email: 'test@todoai.com',
  //     passwordHash: 'hashed_password_here',
  //     name: 'Test User',
  //     preferences: {
  //       create: {
  //         timezone: 'America/New_York',
  //       },
  //     },
  //   },
  // });

  console.log('✅ Database seeded successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

