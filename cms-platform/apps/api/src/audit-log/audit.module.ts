import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { DatabaseService } from '../database/database.service.js';
import { AuditController } from './audit.controller.js';
import { AuditService } from './audit.service.js';

@Module({
  imports: [AuthModule],
  controllers: [AuditController],
  providers: [
    {
      provide: AuditService,
      useFactory: (database: DatabaseService) => new AuditService(database),
      inject: [DatabaseService]
    }
  ],
  exports: [AuditService]
})
export class AuditModule {}
