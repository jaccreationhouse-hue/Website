import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { DatabaseService } from '../database/database.service.js';
import { AdminCareersController, PublicCareersController } from './careers.controller.js';
import { MongoCareersRepository } from './careers.repository.js';
import { CareersService } from './careers.service.js';

@Module({
  imports: [AuthModule],
  controllers: [PublicCareersController, AdminCareersController],
  providers: [
    {
      provide: MongoCareersRepository,
      useFactory: (database: DatabaseService) => new MongoCareersRepository(database),
      inject: [DatabaseService]
    },
    {
      provide: CareersService,
      useFactory: (repository: MongoCareersRepository) => new CareersService(repository),
      inject: [MongoCareersRepository]
    }
  ]
})
export class CareersModule {}
