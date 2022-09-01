require('dotenv').config()
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
	}).catch(error => next(error))
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
	Phonebook.findByIdAndRemove(request.params.id).then(result => {
		response.status(204).end()
	}).catch(error => console.log(error))
})

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
	// if (persons.find(person => person.name === body.name)) {
	// 	return response.status(406).json({
	// 		error: 'name must be unique'
	// 	})
	// }
	const person = new Phonebook({
		name: body.name,
		number: body.number,
	})

	person.save().then(savedPerson => {
		response.json(savedPerson)
	}).catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
	console.error(error.message)
	next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})