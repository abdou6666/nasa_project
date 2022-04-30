const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

const planets = require('./planet.mongo');

const isHabbitablePlanets = (planet) => {
	return (
		planet['koi_disposition'] === 'CONFIRMED' &&
		planet['koi_insol'] > 0.36 &&
		planet['koi_insol'] < 1.11 &&
		planet['koi_prad'] < 1.6
	);
};

/*
const promise = new Promise((resolve,reject) => {
    resolve(42);
});

promise.then((result) =>{

});
const result = await promise();
*/
function loadPlanetsData() {
	return new Promise((resolve, reject) => {
		fs
			.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
			.pipe(
				parse({
					comment: '#',
					columns: true
				})
			)
			.on('data', async (data) => {
				if (isHabbitablePlanets(data)) {
					savePlanet(data);
				}
			})
			.on('error', (error) => {
				reject(error);
			})
			.on('end', async () => {
				const countPlantsFound = (await getAllPlanets()).length;
				console.log(countPlantsFound);
				resolve();
			});
	});
}

async function getAllPlanets() {
	return await planets.find(
		{},
		{
			// exclude version & id
			__v: 0,
			_id: 0
		}
	);
}
async function savePlanet(planet) {
	try {
		await planets.updateOne(
			{
				keplerName: planet.kepler_name
			},
			{
				keplerName: planet.kepler_name
			},
			{
				upsert: true
			}
		);
	} catch (error) {
		console.error(`Could not save planet ${error}`);
	}
}
module.exports = {
	loadPlanetsData,
	getAllPlanets
};
