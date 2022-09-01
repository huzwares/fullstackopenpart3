require('dotenv').config()
const { request } = require('express')
const express = require('express')
var morgan = require('morgan')
const app = express()
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :total-time[3] ms :postLog'))
morgan.token('postLog', function (req, res) { return JSON.stringify(req.body) })
app.use(express.static('build'))
const Phonebook = require('./modules/person')

app.get('/api/persons', (request, response) => {
	Phonebook.find({}).then(persons => {
		response.json(persons)
	})
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const person = persons.find(person => person.id === id)

	if (person) {
		response.json(person)
	} else {
		response.status(404).end()
	}
})

app.get('/info', (request, response) => {
	const date = new Date()
	response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter(person => person.id !== id)
	response.status(204).end()
})

const randomId = () => {
	return Math.floor(Math.random() * 10000000000 + 4)
}

app.post('/api/persons', (request, response) => {
	const body = request.body

	if (!body.name) {
		return response.status(400).json({
			error: 'name missing'
		})
	}
	if (!body.number) {
		return response.status(400).json({
			error: 'number missing'
		})
	}
	if (persons.find(person => person.name === body.name)) {
		return response.status(406).json({
			error: 'name must be unique'
		})
	}
	const person = {
		id: randomId(),
		name: body.name,
		number: body.number,
	}

	persons.concat(person)
	response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})