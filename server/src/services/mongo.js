const mongoose = require('mongoose');
const MONGO_URL =
	'mongodb+srv://abdou:Opeth666@cluster0.e67h1.mongodb.net/nasa?retryWrites=true&w=majority';

mongoose.connection.once('open', () => {
	console.log('MongoDB connection ready !');
});

mongoose.connection.on('error', (error) => {
	console.error(error);
});

async function mongoConnect() {
	try {
		await mongoose.connect(
			MONGO_URL,
			{
				//	useNewUrlParser: true
				//	useFindAndModify: false
				//	useCreateIndex: true,
				//	useUnifiedTopology: true
			}
		);
	} catch (err) {
		console.error(err);
	}
}
async function mongoDisconnect() {
	await mongoose.disconnect();
}
module.exports = {
	mongoConnect,
	mongoDisconnect
};
