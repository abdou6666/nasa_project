const launchesDatabase = require('./launches.mongo');
const planets = require('./planet.mongo');
const axios = require('axios');
const DEFAULT_FLIGHT_NUMBER = 100;
// const launch = {
// 	flightNumber: 100,
// 	mission: 'Kepler Exploration X',
// 	rocket: 'Explorer IS1',
// 	launchDate: new Date('December 27,2030'),
// 	target: 'Kepler-442 b',
// 	customers: [ 'ZTM', 'NASA' ],
// 	upcoming: true,
// 	success: true
// };
// saveLaunch(launch)
const SPACE_X_APi_URL = 'https://api.spacexdata.com/v4/launches/query';

async function loadLaunchData() {
	const response = await axios.post(SPACE_X_APi_URL, {
		query: {},
		options: {
			populate: [
				{
					path: 'rocket',
					select: {
						name: 1
					}
				},
				{
					path: 'payloads',
					select: {
						customers: 1
					}
				}
			]
		}
	});
}
async function getAllLaunches() {
	return await launchesDatabase.find(
		{},
		{
			__v: 0,
			_id: 0
		}
	);
}

async function saveLaunch(launch) {
	const planet = await planets.findOne({
		keplerName: launch.target
	});
	if (!planet) {
		throw new Error('Planet not found');
	}

	// const l = await launchesDatabase.findOneAndUpdate(
	// 	{
	// 		flightNumber: launch.flightNumber
	// 	},
	// 	{
	// 		launch
	// 	},
	// 	{
	// 		upsert: true
	// 	}
	// );

	const l = await launchesDatabase.create(launch);
	console.log(l);
}
async function scheduleNewLaunch(launch) {
	const newFlightNumber = (await getLatestFlightNumber()) + 1;
	const newLaunch = Object.assign(launch, {
		success: true,
		upcoming: true,
		customers: [ 'ZTM', 'NASA' ],
		flightNumber: newFlightNumber
	});
	saveLaunch(newLaunch);
}

async function existLaunchById(launchId) {
	return await launchesDatabase.find({
		flightNumber: launchId
	});
}
async function getLatestFlightNumber() {
	const latestFlight = await launchesDatabase.findOne().sort('-flightNumber');
	if (!latestFlight) {
		return DEFAULT_FLIGHT_NUMBER;
	}
	return latestFlight.flightNumber;
}
async function abortLaunchById(launchId) {
	const aborted = await launchesDatabase.updateOne(
		{
			flightNumber: launchId
		},
		{
			upcoming: false,
			success: false
		}
	);
	return aborted.matchedCount === 1 && aborted.modifiedCount === 1;
}

module.exports = {
	loadLaunchData,
	getAllLaunches,
	scheduleNewLaunch,
	existLaunchById,
	abortLaunchById
};
