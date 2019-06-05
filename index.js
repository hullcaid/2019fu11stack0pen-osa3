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

app.get('/api/persons', (request, response) => {
	response.json(persons);
});

app.get('/info', (request, response) => {
	response.send(`<p>Puhelinluettelossa ${persons.length} henkilön tiedot<br>${new Date()}`);
});

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find(person => person.id === id);

	if (person) {
		response.json(person);
	} else {
		response.status(404).end()
	}
})

const PORT = 3001;
app.listen(PORT)
	console.log(`server running, port: ${PORT}`);

//dev log: 2.6: 2h, 3.6.: 1h, 4.6.: 1,5h