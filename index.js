require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

const PORT = process.env.PORT

let persons = [
	{
		name: "Joe",
		number: "123123",
		id: 1
	},
	{
		name: "Joe2",
		number: "5345",
		id: 2
	},
	{
		name: "Joe3",
		number: "6456",
		id: 3
	},
	{
		name: "Joe4",
		number: "8678",
		id: 4
	},
]

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('body', (req) => {
	return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api', (req, res) => {
	res.json({Status: 'Working!'})
})

app.get('/api/persons', (req, res) => {
	Person.find({}).then(person =>{
		res.json(person.map(person => person.toJSON()))
	})
})

app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id).then(person => {
		if (person){
			res.json(person.toJSON())
		} else {
			res.status(404).end()
		}
	})
	.catch(error => next(error))	
})

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

const generateId = () => {
	let id = Math.floor(Math.random() * 10000)
	const arrayIds = persons.filter(person => person.id === id)

	if(arrayIds.length !== 0){
		id = generateId()
	}

	return id
}

const checkNameExists = (name) => {
	const names = persons.filter(person => person.name === name)
	if(names.length === 0){
		return false
	} else {
		return true
	}
}

app.post('/api/persons', (req, res) => {
	const body = req.body

	if ((!body.name) || (!body.number)){
		return res.status(400).json({
			Error: "Name or number missing!"
		})
	}

	/*if(checkNameExists(body.name)){
		return res.status(400).json({
			Error: "Name already exists!"
		})
	}*/

	const person = new Person({
		name: body.name,
		number: body.number,
	})
	
	person.save().then(savedPerson => {
		res.json(savedPerson.toJSON())
	})
})

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body

	const person = {
		name: body.name,
		number: body.number
	}

	Person.findByIdAndUpdate(request.params.id, person, {new: true})
		.then(updatedPerson => {
			response.json(updatedPerson.toJSON())
		})
		.catch(error => next(error))
})

app.get('/api/info', (req, res) => {
	let date = new Date()
	date = date.toString()
	res.send(
		`Phonebook has info for ${persons.length} people.
		<br />
		<br />
		${date}`)
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ Error: 'Unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ Error: 'Malformed id' })
	}

	next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})