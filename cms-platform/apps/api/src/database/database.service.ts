import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { setServers } from 'node:dns';
import { GridFSBucket, MongoClient, type Collection, type Db, type Document } from 'mongodb';
import { loadEnv } from '../config/env.js';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly client: MongoClient;
  private readonly database: Db;

  constructor() {
    const env = loadEnv();
    if (env.mongoUri.startsWith('mongodb+srv://') && env.mongoDnsServers.length) {
      setServers(env.mongoDnsServers);
    }
    this.client = new MongoClient(env.mongoUri, { serverSelectionTimeoutMS: 3_000 });
    this.database = this.client.db(env.mongoDb);
  }

  collection<T extends Document = Document>(name: string): Collection<T> {
    return this.database.collection<T>(name);
  }

  gridFsBucket(name: string): GridFSBucket {
    return new GridFSBucket(this.database, { bucketName: name });
  }

  async ping(): Promise<void> {
    await this.database.command({ ping: 1 });
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.close();
  }
}
