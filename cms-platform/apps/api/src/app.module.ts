import { Module } from '@nestjs/common';
import { AuditModule } from './audit-log/audit.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ContentModule } from './content/content.module.js';
import { DatabaseModule } from './database/database.module.js';
import { HealthController } from './health.controller.js';
import { LeadsModule } from './leads/leads.module.js';
import { CareersModule } from './careers/careers.module.js';
import { MediaModule } from './media/media.module.js';

@Module({
  imports: [DatabaseModule, AuthModule, AuditModule, ContentModule, LeadsModule, CareersModule, MediaModule],
  controllers: [HealthController]
})
export class AppModule {}

