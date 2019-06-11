//status: tehtävä 3.11
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan')
const cors = require('cors')
const Entry = require('./models/entry')

app.use(express.static('build'));
app.use(cors());
app.use(bodyParser.json());

morgan.token('payload', function getBody(request) {return JSON.stringify(request.body)} )

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :payload'))

//Function to return the whole list of contacts. Uses the document.find-function to find all entries and sends them as a json in response
app.get('/api/persons', (request, response) => {
	Entry.find({}).then(entries=> {
		response.json(entries.map(entry => entry.toJSON()))
	})
});

//Function to return the status of the database
app.get('/info', (request, response) => {
	//Sends a infostring
	response.send(`<p>Puhelinluettelossa ${persons.length} henkilön tiedot<br>${new Date()}`);
});

//Function to return single contact. If the contact does not exists, returns 404
app.get('/api/persons/:id', (request, response) => {
	Entry.findById(request.params.id).then(entry => {
		response.json(entry.toJSON());
	})
});

//Function to remove contacts from the database
app.delete('/api/persons/:id', (request, response) => {
	Entry.findByIdAndRemove(request.params.id)
		.then(result => {
			response.status(204).end();
		})
		.catch(error => {
			console.log(error);
			response.status(400).end();
		});
	
	
	/* //Get id from request and transform it to Number
	const id = Number(request.params.id);
	//Save the length of persons array before trying to remove the requested object
	const oldLength = persons.length;
	//console.log(oldLength)
	//Filter the objects without the requested id from the persons array and save the result to persons 
	persons = persons.filter(person => person.id !== id);
	//console.log(oldLength, persons.length)
	//Return code 204
	if (persons.length !== oldLength) {
		//if the array legth changed, removal was succesful, return 204
		response.status(204).end();
	} else {
		//If the array is the same length, removal did not succeed, return 404
		response.status(404).end();
	}; */
	
});

//Function for generating unique Ids
const getUniqueId = () => {
	const id = Math.floor(Math.random() * 100000000)+1;
	console.log(id)
	return id;
	 
}

//Function for adding objects
app.post('/api/persons', (request, response) => {
	//Get request body
	const body =  request.body

	if(!body.name||!body.number){
		return response.status(400).json({error: 'name or number missing'});
	};

	/* if(persons.find(person => person.name === body.name)) {
		return response.status(400).json({error: 'name must be unique'});
	} */

	const entry = new Entry({
		name: body.name,
		number: body.number,
	});

	entry.save().then(savedEntry => {
		response.json(savedEntry.toJSON());
	});
})

const PORT = process.env.PORT;
app.listen(PORT)
	console.log(`server running, port: ${PORT}`);


