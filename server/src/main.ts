(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { performance } from 'perf_hooks';
import { prisma } from './lib/db';
import { Emitter } from './events';

const startTime = performance.now();

console.info(`┌────────────────────────────────────────────────────────────┐`);
console.info(
  `│    Starting: ${new Date().toISOString()}                      │`,
);
console.info(`└────────────────────────────────────────────────────────────┘`);

process.on('uncaughtException', console.error);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.use((_, res, next) => {
    res.removeHeader('X-Powered-By');
    next();
  });
  await prisma.$connect();
  app.enableCors();
  await app.listen(5000);
  console.debug(
    ` * imports done in ${(performance.now() - startTime).toFixed(3)}ms`,
  );
  console.debug(` * Memory: ${readMem()}`);
  console.debug(` * Process Id: ${process.pid} Platform:${process.platform}`);
}
bootstrap();
function readMem() {
  const mem = process.memoryUsage();
  const convert = { Kb: (n) => n / 1024, Mb: (n) => convert.Kb(n) / 1024 };
  const toHuman = (n, t) => `${convert[t](n).toFixed(2)}${t}`;
  return `Used ${toHuman(mem.heapUsed, 'Mb')} of ${toHuman(
    mem.heapTotal,
    'Mb',
  )} - RSS: ${toHuman(mem.rss, 'Mb')}`;
}
