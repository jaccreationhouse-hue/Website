import { Module } from '@nestjs/common';
import { AuditModule } from '../audit-log/audit.module.js';
import { AuditService } from '../audit-log/audit.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { DatabaseService } from '../database/database.service.js';
import { AdminContentController } from './admin-content.controller.js';
import { MongoContentRepository } from './content.repository.js';
import { ContentService } from './content.service.js';
import { PublicContentController } from './public-content.controller.js';

@Module({
  imports: [AuthModule, AuditModule],
  controllers: [PublicContentController, AdminContentController],
  providers: [
    {
      provide: MongoContentRepository,
      useFactory: (database: DatabaseService) => new MongoContentRepository(database),
      inject: [DatabaseService]
    },
    {
      provide: ContentService,
      useFactory: (repository: MongoContentRepository, audit: AuditService) =>
        new ContentService(repository, audit),
      inject: [MongoContentRepository, AuditService]
    }
  ]
})
export class ContentModule {}
