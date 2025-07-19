const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/userModel");

async function auth(req, res, next) {
    try {
        const token = req.header('Authorization').split(" ")[1];
        const decoded = jwt.verify(token, config.jwtSecret)

        const user = await User.findOne({ _id: decoded.userId, "tokens.token": token})
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (error) {
        console.log('Error on authentication', error);
        res.status(401).send({error: 'Invalid authentication'});
    }
}

module.exports = auth
