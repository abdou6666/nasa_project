const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');
const habittablePlanets = [];
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
			.on('data', (data) => {
				if (isHabbitablePlanets(data)) habittablePlanets.push(data);
			})
			.on('error', (error) => {
				reject(error);
			})
			.on('end', () => {
				console.log(habittablePlanets.length);
				resolve();
			});
	});
}

function getAllPlanets() {
	return habittablePlanets;
}

module.exports = {
	loadPlanetsData,
	getAllPlanets
};
