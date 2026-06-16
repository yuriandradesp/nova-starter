import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@nova/database';

describe('AppController & Database Workspace Import', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [],
      providers: [],
    }).compile();
  });

  it('should successfully resolve the @nova/database import and instantiate PrismaClient', () => {
    const client = new PrismaClient();
    expect(client).toBeDefined();
  });
});
