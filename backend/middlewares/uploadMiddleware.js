const multer = require('multer');
const path = require('path');
const { randomUUID } = require('crypto');

const storage = multer.diskStorage({
    destination: path.join(__dirname, '..', 'uploads'),
    filename:(req,file,cb) => {
        cb(null, randomUUID() + (file.mimetype === 'image/png' ? '.png' : '.jpg'));
    }
})

const fileFilter = (req, file, cb) => { 
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if(allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(Object.assign(new Error('Choose a PNG or JPEG image.'), { status: 400 }));
    }
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = upload;
