const multer = require("multer")
const { v4: uuidv4 } = require("uuid")

exports.uploadFile = (imageFile, max = 1) =>{

    const storage = multer.diskStorage({
        destination: function(req,file,cb){
            cb(null,"public/uploads") //folder upload location
        },
        filename: function(req,file,cb){
            let re = /(?:\.([^.]+))?$/
            // cb(null, `${Date.now()}-${file.originalname.replace(/\s/g,"")}`)
            cb(null, `${uuidv4()}.${re.exec(file.originalname)[1]}`)
        }
    })

    const filter = (req,file,cb) => {
        if (file.fieldname === imageFile){
            if (!file.originalname.match(/\.(jpg|JPG|JPEG|jpeg|png|PNG|svg)$/)){
                req.fileValidationError = {
                    message: "Only image files are allowed"
                }
                return cb(new Error("Only image files are allowed"), false)

            }

            cb(null, true)
        }
    }

    const sizeMb = 10
    const maxSize = sizeMb * 1024 * 1024

    const upload = multer({
        storage,
        fileFilter:filter,
        limits:{ fileSize: maxSize}
    }).fields([
        {
            name: imageFile,
            maxCount: max
        }
    ])

    return (req, res, next) => {
        upload(req, res, function(err) {
            if (req.fileValidationError) {
                return res.status(400).send(req.fileValidationError)
            }

            /* uncomment this if you want uploading image is a must  */
            // if (!req.files.image && !err){
            //     return res.status(400).send({
            //         message:"Please select image file to upload"
            //     })
            // }

            if (err){
                if (err.code === "LIMIT_FILE_SIZE"){
                    return res.status(400).send({
                        status:"failed", message:"Max file size is 10MB"
                    })
                }

                if (err.code === "LIMIT_UNEXPECTED_FILE"){
                    return res.status(400).send({
                        status:"failed", message:"Max 4 files to upload"
                    })
                }

                return res.status(400).send(err)
            }
            return next()
        })
    }
}