const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

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
	name: {
		type: String,
		unique: true,
	},
	number: String,
});

entrySchema.plugin(uniqueValidator);

entrySchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id;
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

module.exports = mongoose.model('entry', entrySchema);