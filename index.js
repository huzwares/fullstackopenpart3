require('dotenv').config()
const { response } = require('express')
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
	Phonebook.findById(request.params.id).then(person => {
		if (person) {
			response.json(person)
		} else {
			response.status(404).end()
		}
	}).catch(error => next(error))
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

app.post('/api/persons', (request, response, next) => {
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

	const person = new Phonebook({
		name: body.name,
		number: body.number,
	})

	person.save().then(savedPerson => {
		response.json(savedPerson)
	}).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body
	const person = {
		name: body.name,
		number: body.number,
	}
	Phonebook.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true }).then(updatedPerson => {
		response.json(updatedPerson)
	}).catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
	console.error(error.message)
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') { return response.status(400).json({ error: error.message }) }

	next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})