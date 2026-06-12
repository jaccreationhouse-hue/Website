process.env.NODE_ENV ??= 'test';
process.env.API_PORT ??= '4010';
process.env.ADMIN_ORIGIN ??= 'http://localhost:3000';
process.env.MONGODB_URI ??= 'mongodb://127.0.0.1:27017';
process.env.MONGODB_DB ??= 'jac_cms_test';
process.env.JWT_ACCESS_SECRET ??= 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
process.env.JWT_REFRESH_SECRET ??= 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

const { NestFactory } = await import('@nestjs/core');
const { AppModule } = await import('./dist/app.module.js');
const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
await app.close();
