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
app.get('/info', (request, response, next) => {
	Entry.estimatedDocumentCount().then(count =>{
		response.send(`<p>Puhelinluettelossa ${count} henkilön tiedot<br>${new Date()}`);
	})
	.catch(error => next(error))
});

//Function to return single contact. If the contact does not exists, returns 404
app.get('/api/persons/:id', (request, response, next) => {
	Entry.findById(request.params.id).then(entry => {
		if(entry) {
			response.json(entry.toJSON());
		} else {
			response.status(404).end();
		}
		
	})
	.catch(error => next(error))
});

//Function to remove contacts from the database
app.delete('/api/persons/:id', (request, response, next) => {
	Entry.findByIdAndRemove(request.params.id)
		.then(result => {
			response.status(204).end();
		})
		.catch(error => next(error));
});

//Function to modify document already in database
app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body;

	const entry = {
		number: body.number,
	}

	Entry.findByIdAndUpdate(request.params.id, entry, {new: true})
		.then(updatedEntry => {
			response.json(updatedEntry.toJSON());
		})
		.catch(error => next(error));
}) 

//Function for adding objects
app.post('/api/persons', (request, response, next) => {
	//Get request body
	const body =  request.body

	if(!body.name||!body.number){
		return response.status(400).json({error: 'name or number missing'});
	};

	const entry = new Entry({
		name: body.name,
		number: body.number,
	});

	entry.save().then(savedEntry => {
		response.json(savedEntry.toJSON());
	})
	.catch(error => next(error));
})

const errorHandler =(error, request, response, next) => {
	console.error(error.message);

	if(error.name === 'CastError' && error.kind == 'ObjectId') {
		return response.status(400).send({ error: 'malformatted id'});
	}

	next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT)
	console.log(`server running, port: ${PORT}`);


