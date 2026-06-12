import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { DatabaseService } from '../database/database.service.js';
import { AdminLeadsController } from './admin-leads.controller.js';
import { MongoLeadsRepository } from './leads.repository.js';
import { LeadsService } from './leads.service.js';
import { PublicFormsController } from './public-forms.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [PublicFormsController, AdminLeadsController],
  providers: [
    {
      provide: MongoLeadsRepository,
      useFactory: (database: DatabaseService) => new MongoLeadsRepository(database),
      inject: [DatabaseService]
    },
    {
      provide: LeadsService,
      useFactory: (repository: MongoLeadsRepository) => new LeadsService(repository),
      inject: [MongoLeadsRepository]
    }
  ]
})
export class LeadsModule {}
