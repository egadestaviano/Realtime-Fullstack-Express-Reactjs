import { PrismaClient } from "@prisma/client";

// Singleton pattern untuk Prisma client
let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
} else {
  // Development mode dengan logging yang lebih detail
  prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Error handling untuk connection
prisma.$on('error', (e) => {
  console.error('Prisma Client error:', e);
});

export default prisma;
