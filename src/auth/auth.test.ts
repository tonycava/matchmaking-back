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
			password: 'Root1234!'
		});
		expect(result.status).toBe(201);
		expect(isAMLResultShaped(result.body)).toBe(true);
		if (!isAMLResultShaped(result.body)) return;
		expect(result.body.data).toHaveProperty('token');
	});
});

describe('Auth - Login', () => {
	beforeAll(async () => {
		await request(app).post('/auth/register').send({
			username: 'escaffre.lucas2003@gmail.com',
			password: 'Root1234!'
		});
	});

	it('should login a user', async () => {
		const result = await request(app).post('/auth/login').send({
			username: 'escaffre.lucas2003@gmail.com',
			password: 'Root1234!'
		});
		expect(result.status).toBe(200);
		expect(isAMLResultShaped(result.body)).toBe(true);
		if (!isAMLResultShaped(result.body)) return;
		expect(result.body.data).toHaveProperty('token');
	});

	it('should not login with non existing username', async () => {
		const result = await request(app).post('/auth/login').send({
			username: 'matis',
			password: 'Root1234!'
		});
		expect(result.status).toBe(404);
		expect(isAMLResultShaped(result.body)).toBe(true);
	});

	it('should not login with wrong password', async () => {
		const result = await request(app).post('/auth/login').send({
			username: 'escaffre.lucas2003@gmail.com',
			password: 'wrong password'
		});
		expect(result.status).toBe(400);
		expect(isAMLResultShaped(result.body)).toBe(true);
	});
});
