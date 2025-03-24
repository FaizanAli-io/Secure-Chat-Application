import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';

describe('UserModule (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let testUser;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
    await app.close();
  });

  it('should create a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(201);

    testUser = response.body;

    expect(testUser).toHaveProperty('id');
    expect(testUser.username).toBe('testuser');
  });

  it('should retrieve all users', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should retrieve the test user by ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${testUser.id}`)
      .expect(200);
    expect(response.body.username).toBe('testuser');
  });

  it('should update the test user', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/users/${testUser.id}`)
      .send({ username: 'updatedUser' })
      .expect(200);

    expect(response.body.username).toBe('updatedUser');
  });

  it('should delete the test user', async () => {
    await request(app.getHttpServer())
      .delete(`/users/${testUser.id}`)
      .expect(204);

    const deletedUser = await prisma.user.findUnique({
      where: { id: testUser.id },
    });

    expect(deletedUser).toBeNull();
  });
});
