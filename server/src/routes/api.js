const express = require('express');

const planetsRouter = require('./planets/planets.router');
const launchesRouter = require('./planets/launches.router');

const api = express.Router();

api.use('/launches', launchesRouter);
api.use('/planets', planetsRouter);

module.exports = api;
