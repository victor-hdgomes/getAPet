const jwt = require('jsonwebtoken')

const createUserToken = async (user, req, res) => {

    // Create a token
    const token = jwt.sign({
        name: user.id,
        id: user._id
    }, "oursecret")

    // Return token
    res.status(200).json({
        message: "You are authenticated.",
        token: token,
        userId: user._id
    })

}

module.exports = createUserToken