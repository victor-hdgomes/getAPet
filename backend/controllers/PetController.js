const Pet = require('../models/Pet')

// Helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class PetController {

    // Create a pet
    static async create(req, res) {

        const { name, age, weight, color } = req.body
        const available = true
        const images = req.files

        // Images uploads

        // Validations
        if (!name) {
            res.status(422).json({ message: "The name is mandatory!" })
            return
        }

        if (!age) {
            res.status(422).json({ message: "The age is mandatory!" })
            return
        }

        if (!weight) {
            res.status(422).json({ message: "The weight is mandatory!" })
            return
        }

        if (!color) {
            res.status(422).json({ message: "The color is mandatory!" })
            return
        }

        if (images.length === 0) {
            res.status(422).json({ message: "The image is mandatory!" })
            return
        }

        // Get pet owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        // Create a pet
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone
            }
        })

        images.map((image) => {
            pet.images.push(image.filename)
        })

        try {
            const newPet = await pet.save()
            res.status(201).json({ message: "Pet has been successfully registered!", newPet })
        } catch (error) {
            res.status(500).json({ message: error })
        }

    }

    // Get all pet
    static async getAll(req, res) {
        const pets = await Pet.find().sort('-createdAt')

        res.status(200).json({ pets: pets })
    }

    // Get my pets
    static async getAllUserPets(req, res) {
        // Get user from token
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({ 'user._id': user._id }).sort('-createdAt')

        res.status(200).json({ pets })
    }

    // Get all user adoptions
    static async getAllUserAdoptions(req, res) {
        // Get user from token
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({ 'adopter._id': user._id }).sort('-createdAt')

        res.status(200).json({ pets })
    }

    // Get pet by id
    static async getPetById(req, res) {
        const id = req.params.id

        // Check if ID is an ObjectId
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: "Invalid ID!" })
            return
        }

        // Check if pet exists
        const pet = await Pet.findOne({ _id: id })

        if (!pet) {
            res.status(404).json({ message: "Pet not found!" })
            return
        }

        res.status(200).json({ pet: pet })

    }

    // Remove pet by id
    static async removePetById(req, res) {
        const id = req.params.id

        // Check if ID is an ObjectId
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: "Invalid ID!" })
            return
        }

        // Check if pet exists
        const pet = await Pet.findOne({ _id: id })

        if (!pet) {
            res.status(404).json({ message: "Pet not found!" })
            return
        }

        // Check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: "There was an error!" })
            return
        }

        await Pet.findByIdAndRemove(id)

        res.status(200).json({ message: "The pet was successfully deleted!" })

    }

    // Update pet
    static async updatePet(req, res) {
        const id = req.params.id
        const { name, age, weight, color, available } = req.body
        const images = req.files
        const updatedData = {}

        // Check if pet exists
        const pet = await Pet.findOne({ _id: id })

        if (!pet) {
            res.status(404).json({ message: "Pet not found!" })
            return
        }

        // Check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: "There was an error!" })
            return
        }

        // Validations
        if (!name) {
            res.status(422).json({ message: "The name is mandatory!" })
            return
        } else {
            updatedData.name = name
        }

        if (!age) {
            res.status(422).json({ message: "The age is mandatory!" })
            return
        } else {
            updatedData.age = age
        }

        if (!weight) {
            res.status(422).json({ message: "The weight is mandatory!" })
            return
        } else {
            updatedData.weight = weight
        }

        if (!color) {
            res.status(422).json({ message: "The color is mandatory!" })
            return
        } else {
            updatedData.color = color
        }

        if (images.length > 0) {
            updatedData.images = []
            images.map((image) => {
                updatedData.images.push(image.filename)
            })
        }

        await Pet.findByIdAndUpdate(id, updatedData)

        res.status(200).json({ message: 'Pet has been successfully updated!' })
    }

    // Schedule
    static async schedule(req, res) {
        const id = req.params.id

        // Check if pet exists
        const pet = await Pet.findOne({ _id: id })

        if (!pet) {
            res.status(404).json({ message: "Pet not found!" })
            return
        }

        // Check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.equals(user._id)) {
            res.status(422).json({ message: "You should not schedule an appointment with your pet!" })
            return
        }

        // Check if user has already scheduled the pet
        if (pet.adopter) {
            if (pet.adopter._id.equals(user._id)) {
                res.status(422).json({ message: "You have already booked this pet!" })
                return
            }
        }

        // Add user to pet
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        }

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({message: `Schedule successfully booked, contact ${pet.user.name} by phone ${pet.user.phone}`})
    }

    // Conclud adoption
    static async concludeAdoption(req, res) {
        const id = req.params.id
    
        // check if pet exists
        const pet = await Pet.findOne({ _id: id })
    
        pet.available = false
    
        await Pet.findByIdAndUpdate(pet._id, pet)
    
        res.status(200).json({
          pet: pet,
          message: `Congratulations! Adoption cycle completed successfully!`,
        })
      }
}