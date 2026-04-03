const cloudinary = require('cloudinary').v2
const multer = require('multer')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Multer — image memory mein rakho (disk pe nahi)
const storage = multer.memoryStorage()
const upload = multer({ storage })

// Image upload function
const uploadImage = (fileBuffer, mimetype) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'shopease/products' },
            (error, result) => {
                if (error) reject(error)
                else resolve(result.secure_url)
            }
        )
        stream.end(fileBuffer)
    })
}

module.exports = { upload, uploadImage }