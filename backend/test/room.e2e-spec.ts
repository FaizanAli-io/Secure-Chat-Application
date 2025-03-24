import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { RoomService } from '../src/room/room.service';

describe('RoomService (e2e)', () => {
  let prisma: PrismaService;
  let roomService: RoomService;
  let testUser1, testUser2, testUser3, testRoom;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, RoomService],
    }).compile();

    prisma = moduleFixture.get(PrismaService);
    roomService = moduleFixture.get(RoomService);

    testUser1 = await prisma.user.create({
      data: {
        username: 'user1',
        email: 'user1@example.com',
        password: 'pass123',
      },
    });

    testUser2 = await prisma.user.create({
      data: {
        username: 'user2',
        email: 'user2@example.com',
        password: 'pass123',
      },
    });

    testUser3 = await prisma.user.create({
      data: {
        username: 'user3',
        email: 'user3@example.com',
        password: 'pass123',
      },
    });
  });

  afterAll(async () => {
    await prisma.roomUser.deleteMany();
    await prisma.room.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('should create a room with test users', async () => {
    testRoom = await roomService.createRoom({
      name: 'Test Room',
      userIds: [testUser1.id, testUser2.id],
    });

    expect(testRoom).toHaveProperty('id');
    expect(testRoom.name).toBe('Test Room');
  });

  it('should retrieve all rooms', async () => {
    const rooms = await roomService.getRooms();
    expect(rooms.length).toBeGreaterThan(0);
  });

  it('should retrieve the test room by ID', async () => {
    const foundRoom = await roomService.getRoomById(testRoom.id);
    expect(foundRoom?.id).toBe(testRoom.id);
  });

  it('should update the test room', async () => {
    const updatedRoom = await roomService.updateRoom(testRoom.id, {
      name: 'Updated Room',
    });
    expect(updatedRoom.name).toBe('Updated Room');
  });

  it('should add a user to the room', async () => {
    await roomService.addUserToRoom(testRoom.id, testUser3.id);
    const users = await roomService.getRoomUsers(testRoom.id);
    expect(users.some((u) => u.id === testUser3.id)).toBe(true);
  });

  it('should get all users in the room', async () => {
    const users = await roomService.getRoomUsers(testRoom.id);
    expect(users.length).toBe(3);
  });

  it('should remove a user from the room', async () => {
    await roomService.removeUserFromRoom(testRoom.id, testUser3.id);
    const users = await roomService.getRoomUsers(testRoom.id);
    expect(users.some((u) => u.id === testUser3.id)).toBe(false);
  });

  it('should get all rooms a user is in', async () => {
    const rooms = await roomService.getUserRooms(testUser1.id);
    expect(rooms.length).toBeGreaterThan(0);
  });

  it('should delete the test room', async () => {
    await roomService.deleteRoom(testRoom.id);
    const deletedRoom = await prisma.room.findUnique({
      where: { id: testRoom.id },
    });
    expect(deletedRoom).toBeNull();
  });
});
