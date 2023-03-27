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
});

describe('Auth - Login', () => {
	beforeAll(async () => {
		await request(app).post('/auth/register').send({
			username: 'escaffre.lucas2003@gmail.com',
			password: 'Root1234!',
		});
	});

	it('should login a user', async () => {
		const result = await request(app).post('/auth/login').send({
			username: 'escaffre.lucas2003@gmail.com',
			password: 'Root1234!',
		});
		expect(result.status).toBe(200);
		expect(isAMLResultShaped(result.body)).toBe(true);
		if (!isAMLResultShaped(result.body)) return;
		expect(result.body.data).toHaveProperty('token');
	});

	it('should not login with non existing username', async () => {
		const result = await request(app).post('/auth/login').send({
			username: 'matis',
			password: 'Root1234!',
		});
		expect(result.status).toBe(404);
		expect(isAMLResultShaped(result.body)).toBe(true);
	});

	it('should not login with wrong password', async () => {
		const result = await request(app).post('/auth/login').send({
			username: 'escaffre.lucas2003@gmail.com',
			password: 'wrong password',
		});
		expect(result.status).toBe(401);
		expect(isAMLResultShaped(result.body)).toBe(true);
	});
});

// describe('Auth - Reset password', () => {
// 	const createTestUser = async (): Promise<void> => {
// 		await createUser({
// 			email: 'test@test.com',
// 			poolName: 'test',
// 			password: 'test',
// 			disableVerification: true,
// 		});
// 	};
//
// 	beforeAll(async () => {
// 		await prisma.user.deleteMany();
// 		await prisma.pool.deleteMany();
// 		await createPool({ name: 'test', domains: ['localhost:3000'] });
// 		await createTestUser();
// 	});
//
// 	beforeEach(async () => {
// 		await prisma.user.delete({ where: { username: 'test@test.com' } });
// 		await createTestUser();
// 	});
//
// 	it('should reset password', async () => {
// 		const user = await prisma.user.findUnique({ where: { username: 'test@test.com' } });
// 		const resetToken = generateResetPasswordToken(user);
// 		const result = await request(app).post(`/auth/reset-password?token=${resetToken}`).send({
// 			password: 'new password',
// 		});
// 		const verifyLogin = await request(app).post('/auth/login').send({
// 			email: 'test@test.com',
// 			password: 'new password',
// 			poolName: 'test',
// 		});
// 		expect(result.status).toBe(200);
// 		expect(isRMSResultShaped(result.body)).toBe(true);
// 		if (!isRMSResultShaped(result.body)) return;
// 		expect(result.body.data).toHaveProperty('user');
// 		expect(verifyLogin.status).toBe(200);
// 		expect(isRMSResultShaped(verifyLogin.body)).toBe(true);
// 		if (!isRMSResultShaped(verifyLogin.body)) return;
// 		expect(verifyLogin.body.data).toHaveProperty('token');
// 		expect(verifyLogin.body.data.token).not.toBe('');
// 	});
//
// 	it('should not reset password with invalid token', async () => {
// 		const resetToken = 'invalid token';
// 		const result = await request(app).post(`/auth/reset-password?token=${resetToken}`).send({
// 			password: 'new password',
// 		});
// 		const wrongPasswordAttempt = await request(app).post('/auth/login').send({
// 			email: 'test@test.com',
// 			password: 'new password',
// 			poolName: 'test',
// 		});
// 		const correctPasswordAttempt = await request(app).post('/auth/login').send({
// 			email: 'test@test.com',
// 			password: 'test',
// 			poolName: 'test',
// 		});
// 		expect(result.status).toBe(401);
// 		expect(isRMSResultShaped(result.body)).toBe(true);
// 		expect(wrongPasswordAttempt.status).toBe(401);
// 		expect(correctPasswordAttempt.status).toBe(200);
// 	});
