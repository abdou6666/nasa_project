//const launches = require('./launches.mongo');

const launches = new Map();

let latestFlightNumber = 100;
const launch = {
	flightNumber: 100,
	mission: 'Kepler Exploration X',
	rocket: 'Explorer IS1',
	launchDate: new Date('December 27,2030'),
	target: 'Kepler-442 b',
	customers: [ 'ZTM', 'NASA' ],
	upcoming: true,
	success: true
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
	return Array.from(launches.values());
}

function addNewLaunch(launch) {
	latestFlightNumber++;
	launches.set(
		latestFlightNumber,
		Object.assign(launch, {
			flightNumber: latestFlightNumber,
			customers: [ 'ZTM', 'NASA' ],
			upcoming: true,
			success: true,
			flightNumber: latestFlightNumber
		})
	);
}
function existLaunchById(launchId) {
	return launches.has(launchId);
}

function abortLaunchById(launchId) {
	//launches.delete(launchId);
	const aborted = launches.get(launchId);
	aborted.success = false;
	aborted.upcoming = false;
	return aborted;
}

module.exports = {
	getAllLaunches,
	addNewLaunch,
	existLaunchById,
	abortLaunchById
};
