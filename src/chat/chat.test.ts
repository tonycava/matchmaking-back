import { createChat } from './chat.service';
import prisma from '../lib/db';
// @ts-ignore
import request from 'supertest';
import app from '../index';
import { signToken } from '../common/utils';

describe('Chat - Create', () => {
	beforeAll(async () => {
		await prisma.chat.deleteMany();
		await prisma.game.deleteMany();
		await prisma.user.deleteMany();

		await request(app).post('/auth/register').send({
			username: 'escaffre.lucas2003@gmail.com',
			password: 'Root1234!'
		});
	});

	it('should create a new chat', async () => {
		// Given
		const userId = await prisma.user.findFirst().then((user) => user?.id);
		// When
		const result = await createChat('Hello World', userId!);
		// Then
		expect(result).toHaveProperty('content');
		expect(result).toHaveProperty('userId');
		expect(result).toHaveProperty('user');
		expect(result.user).toHaveProperty('username');
	});
});

describe('Chat - Get', () => {
	it('should get a chat', async () => {
		const userData = await prisma.user.findFirst()!;
		if (!userData) throw new Error('User not found');
		const token = signToken({
			id: userData?.id,
			username: userData.username,
			createdAt: userData.createdAt,
			role: userData.role,
			optAuthenticated: false
		});
		await createChat('Hello World', userData.id);
		// When
		const result = await request(app).get('/chat?start=0&end=1').set('Authorization', `${token}`);
		// Then
		expect(result.status).toBe(200);
		expect(result.body).toHaveProperty('data');
		expect(result.body.data).toHaveProperty('messages');
		expect(result.body.data.messages).toHaveProperty('length');
		expect(result.body.data.messages.length).toBeGreaterThan(0);
	});
});
