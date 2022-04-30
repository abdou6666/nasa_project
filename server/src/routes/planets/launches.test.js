const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');

describe('Test Launches API', () => {
	beforeAll(async () => {
		await mongoConnect();
	});
	afterAll(async () => {
		await mongoDisconnect();
	});
	describe('Test GET /launches', () => {
		test('should respond with 200 success', async () => {
			const response = await request(app)
				.get('/v1/launches')
				.expect('Content-Type', /json/)
				.expect(200);
		});
	});

	describe('Test POST /launch', () => {
		const completeLaunchData = {
			mission: 'ZTM155',
			rocket: 'ZTM Experimental IS1',
			target: 'Kepler-62 f',
			launchDate: 'July 1 , 2028'
		};
		const launchDataWithoutDate = {
			mission: 'ZTM155',
			rocket: 'ZTM Experimental IS1',
			target: 'Kepler-62 f'
		};
		const launchDataWithInvalidDate = {
			mission: 'ZTM155',
			rocket: 'ZTM Experimental IS1',
			target: 'Kepler-62 f',
			launchDate: 'zzz'
		};
		test('should respond with 201 success', async () => {
			const response = await request(app)
				.post('/v1/launches')
				.send(completeLaunchData)
				.expect('Content-Type', /json/)
				.expect(201);
			const requestDate = new Date(completeLaunchData.launchDate).valueOf();
			const responseDate = new Date(response.body.launchDate).valueOf();
			expect(responseDate).toBe(requestDate);

			expect(response.body).toMatchObject(launchDataWithoutDate);
		});
		test('should catch missing required properties', async () => {
			const response = await request(app)
				.post('/v1/launches')
				.send(launchDataWithoutDate)
				.expect('Content-Type', /json/)
				.expect(400);

			expect(response.body).toStrictEqual({
				error: 'Missing required launch proprety'
			});
		});
		test('should catch invalid date', async () => {
			const response = await request(app)
				.post('/v1/launches')
				.send(launchDataWithInvalidDate)
				.expect('Content-Type', /json/)
				.expect(400);
			expect(response.body).toStrictEqual({
				error: 'Invalid launch date'
			});
		});
	});
});
