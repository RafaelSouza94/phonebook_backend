const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

const PORT = process.env.PORT || 3001

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

app.use(cors())
app.use(express.json())

morgan.token('body', (req) => {
	return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (req, res) => {
	res.json({Status: 'Working!'})
})

app.get('/api', (req, res) => {
	res.json({API: "Phonebook persons API"})
})

app.get('/api/persons', (req, res) => {
	res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find(person => person.id === id)
	if(person){
		res.json(person)
	} else {
		res.status(404).end()
	}
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	persons = persons.filter(person => person.id !== id)

	res.status(204).end()
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

	if(checkNameExists(body.name)){
		return res.status(400).json({
			Error: "Name already exists!"
		})
	}

	const person = {
		name: body.name,
		number: body.number,
		id: generateId()
	}

	persons = persons.concat(person)

	res.json({
		name: body.name,
		id: person.id,
		status: "Added successfully!"
	})
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

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})