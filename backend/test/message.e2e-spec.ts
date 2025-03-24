import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Messages E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let testUser, testRoom, testMessage;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);
    await app.init();

    testUser = await prisma.user.create({
      data: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
      },
    });

    testRoom = await prisma.room.create({
      data: { name: 'Test Room' },
    });
  });

  afterAll(async () => {
    await prisma.message.deleteMany();
    await prisma.room.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
    await app.close();
  });

  it('should create a message', async () => {
    const res = await request(app.getHttpServer())
      .post('/messages')
      .send({
        content: 'Hello World',
        userId: testUser.id,
        roomId: testRoom.id,
      })
      .expect(201);

    testMessage = res.body;

    expect(testMessage.content).toBe('Hello World');
  });

  it('should retrieve all messages', async () => {
    const res = await request(app.getHttpServer()).get('/messages').expect(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should retrieve the test message by ID', async () => {
    await request(app.getHttpServer())
      .get(`/messages/${testMessage.id}`)
      .expect(200)
      .expect((res) => expect(res.body.id).toBe(testMessage.id));
  });

  it('should update the test message', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/messages/${testMessage.id}`)
      .send({ content: 'Updated Message' })
      .expect(200);

    expect(res.body.content).toBe('Updated Message');
  });

  it('should delete the test message', async () => {
    await request(app.getHttpServer())
      .delete(`/messages/${testMessage.id}`)
      .expect(204);

    const deletedMessage = await prisma.message.findUnique({
      where: { id: testMessage.id },
    });

    expect(deletedMessage).toBeNull();
  });
});
