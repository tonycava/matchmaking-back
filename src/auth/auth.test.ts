import request from 'supertest';
import app from '../index';
import prisma from '../lib/db';
import { isAMLResultShaped } from '../common/tests';

describe('Auth - Register', () => {
	beforeEach(async () => {
		await prisma.chat.deleteMany();
		await prisma.game.deleteMany();
		await prisma.user.deleteMany();
	});

	it('should register a new user', async () => {
		const result = await request(app).post('/auth/register').send({
			username: 'escaffre.lucas2003@gmail.com',
			password: 'Root1234!',
		});
		expect(result.status).toBe(201);
		expect(isAMLResultShaped(result.body)).toBe(true);
		if (!isAMLResultShaped(result.body)) return;
		expect(result.body.data).toHaveProperty('token');
	});

	it('should not register a new user with an invalid email', async () => {
		const result = await request(app).post('/auth/register').send({
			email: 'escaffre.lucas2003gmail.com',
			password: 'Root1234!',
		});
		expect(result.status).toBe(400);
	});
});
