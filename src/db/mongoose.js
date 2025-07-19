const mongoose = require('mongoose');
const config = require('../config/config');

main().catch((error) => {
    console.log(error)
});

async function main() {
    await mongoose.connect(config.mongodbUri)
}
