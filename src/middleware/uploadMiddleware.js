const multer = require('multer')

const upload = multer({
    limits: {
        fileSize: 1000000 // 1MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('Only jpg or jpeg or png'));
        }
        cb(null, true);
    }
})

module.exports = upload

