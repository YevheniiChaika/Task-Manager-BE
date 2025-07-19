const mongodbUri = process.env.MONGODB_URI
const port = process.env.PORT
const jwtSecret = process.env.JWT_SECRET
const sendGridApiKey = process.env.SENDGRID_API_KEY
const verifiedSender = process.env.VERIFIED_SENDER

module.exports = {mongodbUri, port, jwtSecret, sendGridApiKey, verifiedSender};
