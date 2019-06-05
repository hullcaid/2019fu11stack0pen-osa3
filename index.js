const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

let persons = [
	{
		id: 1,
		name: 'Arto Hellas',
		Number: '045-1236543',
	},
	{
		id: 2,
		name: 'Arto Järvinen',
		Number: '041-21423123',
	},
	{
		id: 3,
		name: 'Lea Kutvonen',
		Number: '040-4323234',
	},
	{
		id: 4,
		name: 'Martti Tienari',
		Number: '09-784232',
	},
]

//Function to return the whole list of contacts
app.get('/api/persons', (request, response) => {
	//Sends the persons array as json
	response.json(persons);
});

//Function to return the status of the database
app.get('/info', (request, response) => {
	//Sends a infostring
	response.send(`<p>Puhelinluettelossa ${persons.length} henkilön tiedot<br>${new Date()}`);
});

//Function to return single contact. If the contact does not exists, returns 404
app.get('/api/persons/:id', (request, response) => {
	//Gets the id from the request
	const id = Number(request.params.id);
	//Finds the person object from persons array if it exists
	const person = persons.find(person => person.id === id);

	if (person) {
		//If the object with correct id is found, sends it as json
		response.json(person);
	} else {
		//If the object was not found, sends 404
		response.status(404).end();
	};
});

//Function to remove contacts from the database
app.delete('/api/persons/:id', (request, response) => {
	//Get id from request and transform it to Number
	const id = Number(request.params.id);
	//Save the length of persons array before trying to remove the requested object
	const oldLength = persons.length;
	console.log(oldLength)
	//Filter the objects without the requested id from the persons array and save the result to persons 
	persons = persons.filter(person => person.id !== id);
	console.log(oldLength, persons.length)
	//Return code 204
	if (persons.length !== oldLength) {
		//if the array legth changed, removal was succesful, return 204
		response.status(204).end();
	} else {
		//If the array is the same length, removal did not succeed, return 404
		response.status(404).end();
	};
	
});

const PORT = 3001;
app.listen(PORT)
	console.log(`server running, port: ${PORT}`);

//dev log: 2.6: 2h, 3.6.: 1h, 4.6.: 1,5h