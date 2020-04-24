const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('Password required as argument!')
	process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0-a3khb.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
	id: Number
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 4) {
	console.log('Name or number missing!')
	mongoose.connection.close()
	process.exit(1)
}

if (process.argv.length === 3) {
	Person.find({}).then(result => {
		result.forEach(person => {
			console.log(person)
		})
	mongoose.connection.close()
	process.exit(0)
	})
}

const generateId = () => {
	let id = Math.floor(Math.random() * 10000)

	return id
}

if (process.argv.length === 5) {
	const person = new Person ({
		name: process.argv[3],
		number: process.argv[4],
		id: generateId()
	})

	person.save().then(response => {
		console.log(`Added ${person.name} with number ${person.number} to phonebook database!`)
		mongoose.connection.close()
		process.exit(0)
	})
}