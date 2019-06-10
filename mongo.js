const mongoose = require('mongoose');

if ( process.argv.length<3) {
	console.log('Password missing!');
	process.exit(1);
};

const password =process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

if((!name && number)||(name && !number)){
	console.log('provide both name and number OR neither');
	process.exit(1);
};

const url= `mongodb+srv://numberuser:${password}@leijus-full-zmvlg.mongodb.net/contacts?retryWrites=true&w=majority`;

mongoose.connect(url, {useNewUrlParser: true});

const entrySchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Entry = mongoose.model('Entry', entrySchema);

if(name && number) {
	const entry = new Entry({
		name: name,
		number: number,
	});

	entry.save().then(response =>{
		console.log(`added ${name} number ${number} to phonebook`);
		mongoose.connection.close();
	})
} else {
	console.log('phonebook:')
	Entry.find({}).then(result => {
		result.forEach(entry =>{
			console.log(entry.name, entry.number);
		});
		mongoose.connection.close();
	});
};