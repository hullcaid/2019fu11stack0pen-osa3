const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const url = process.env.MONGODB_URI;

console.log('connecting:', url)

mongoose.connect(url, {useNewUrlParser: true})
	.then(result => {
		console.log('Connected to database');
	})
	.catch((error) => {
		console.log('Error connecting to database:', error.message);
	});

const entrySchema = new mongoose.Schema({
	name: String,
	number: String,
});

entrySchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id;
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

module.exports = mongoose.model('entry', entrySchema);