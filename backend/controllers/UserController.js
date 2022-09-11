const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class UserController {
    static async register(req, res) {
        const { name, email, phone, password, confirmpassword } = req.body

        // Validations
        if (!name) {
            res.status(422).json({ message: 'The name is mandatory!' })
            return
        }
        if (!email) {
            res.status(422).json({ message: 'The email is mandatory!' })
            return
        }
        const validateEmail = (email) => {
            return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        };
        if (!validateEmail(email)) {
            res.status(422).json({ message: 'Please enter a valid email!' })
            return
        }
        if (!phone) {
            res.status(422).json({ message: 'The phone is mandatory!' })
            return
        }
        if (!password) {
            res.status(422).json({ message: 'The password is mandatory!' })
            return
        }
        if (!confirmpassword) {
            res.status(422).json({ message: 'The confirm password is mandatory!' })
            return
        }
        if (password !== confirmpassword) {
            res.status(422).json({ message: 'Password and confirm password must be the same!' })
            return
        }

        // Check if user exists
        const userExists = await User.findOne({ email: email })
        if (userExists) {
            res.status(422).json({ message: 'Email is already used!' })
            return
        }

        // Create a password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // Create user
        const user = new User({
            name,
            email,
            phone,
            password: passwordHash
        })

        try {
            const newUser = await user.save()

            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({ message: error })
        }

    }

    static async login(req, res) {
        const { email, password } = req.body

        // Validations
        if (!email) {
            res.status(422).json({ message: 'The email is mandatory!' })
            return
        }
        const validateEmail = (email) => {
            return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        };
        if (!validateEmail(email)) {
            res.status(422).json({ message: 'Please enter a valid email!' })
            return
        }
        if (!password) {
            res.status(422).json({ message: 'The password is mandatory!' })
            return
        }

        // Check if user exists
        const user = await User.findOne({ email: email })
        if (!user) {
            res.status(422).json({ message: 'There is no user with this email!' })
            return
        }

        // Check if password match with db password
        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            res.status(422).json({ message: 'Invalid password!' })
            return
        }

        await createUserToken(user, req, res)

    }

    static async checkUser(req, res) {

        let currentUser

        if (req.headers.authorization) {

            const token = getToken(req)
            const decoded = jwt.verify(token, "oursecret")

            currentUser = await User.findById(decoded.id)

            currentUser.password = undefined

        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)

    }

    static async getUserById(req, res) {

        const id = req.params.id;

        const user = await User.findById(id).select("-password")

        if (!user) {
            res.status(422).json({ message: 'User not found!' })
            return
        }

        res.status(200).json({ user })

    }

    static async editUser(req, res) {

        const id = req.params.id

        // Check if user exists
        const token = getToken(req)
        const user = await getUserByToken(token)

        const { name, email, phone, password, confirmpassword } = req.body

        if (req.file) {
            user.image = req.file.filename
        }

        // Validations
        if (!name) {
            res.status(422).json({ message: 'The name is mandatory!' })
            return
        }

        if (!email) {
            res.status(422).json({ message: 'The email is mandatory!' })
            return
        }

        const validateEmail = (email) => {
            return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        };
        if (!validateEmail(email)) {
            res.status(422).json({ message: 'Please enter a valid email!' })
            return
        }
        // Check if email has already taken
        const userExists = await User.findOne({ email: email })

        if (user.email !== email && userExists) {
            res.status(422).json({ message: 'Email is already used!' })
            return
        }

        user.email = email

        if (!phone) {
            res.status(422).json({ message: 'The phone is mandatory!' })
            return
        }
        user.phone = phone

        if (password !== confirmpassword) {
            res.status(422).json({ message: 'Password and confirm password must be the same!' })
            return
        } else if (password === confirmpassword && password != null) {
            // Creating password
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash
        }

        try {
            // Return user updated data
            await User.findOneAndUpdate({_id: user._id}, {$set: user}, {new: true})
            res.status(200).json({message: "User has been successfully updated!"})
        } catch (error) {
            res.status(500).json({ message: error })
            return
        }

    }
}