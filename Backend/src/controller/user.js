const {User} = require("../../models")
const {extractImage, zipImageToObj, singleExtactImage} = require("../functions/imageString")
const Joi = require("joi")

exports.getUsers = async (req, res) => {
    try{
        const users = await User.findAll(
            {attributes:{exclude:["password", "createdAt","updatedAt"]},
            raw: true
        })
       
        res.send({
            status:"success",
            data: [users.map((user) => {
                return {...user, image: extractImage(user.image)}
            })]
        })

    }catch(e){
        console.log(e)
        res.status(500).send({
            status:"failed",
            message:"Server error"
        })
    }

}

exports.getUser = async (req, res) => {
    try{
        const data = await User.findOne({
            where: {
                id: req.params.id
            },
            attributes:{
                exclude:["password", "createdAt","updatedAt"]
            },
            raw: true
        })
        
        res.send({
            status:"success",
            data: {...data, image: extractImage(data.image)}
        })

    }catch(e){
        console.log(e)
        res.status(500).send({
            status:"failed",
            message:"Server error"
        })
    }

}


exports.getProfile = async (req, res) => {
    try{
        const data = await User.findOne({
            where: {
                id: req.user.id
            },
            attributes:{
                exclude:["password", "createdAt","updatedAt"]
            },
            raw: true
        })
        
        res.send({
            status:"success",
            data: {...data, image: singleExtactImage(data.image)}
        })

    }catch(e){
        console.log(e)
        res.status(500).send({
            status:"failed",
            message:"Server error"
        })
    }

}

exports.updateUser = async (req, res) => {
    const schema = Joi.object({
        fullName: Joi.string().min(4),
        email: Joi.string().email().min(6),
        password: Joi.string().min(7),
        phone: Joi.string().min(8),
        address: Joi.string(),
        gender: Joi.string(),
    })

    const {error} = schema.validate(req.body)

    if (error) {
        return res.status(400).send({
            status: "failed",
            message: error.details[0].message,
        })
    }

    try{
      
        let dataToUpdate = req.body
        if (req.files.image) {
            dataToUpdate = {...dataToUpdate, image: zipImageToObj(req.files.image)}
        }
        console.log(req.user)
        const data = await User.update(dataToUpdate, {
            where: {
                id: req.user.id
            }
        })
        
        const updatedUser = await User.findOne({
            where: { id: req.user.id},
            attributes:{
                exclude:["password", "createdAt","updatedAt"]
            },
            raw: true
        })
        
        if(data[0] === 0){
            res.send({
                status:"success",
                message:"Nothing to update",
            })  
        }else{
            res.send({
                status:"success",
                message:"Update user successful",
                data: {...updatedUser, image: extractImage(updatedUser.image)}
            })
        }

    }catch(e){
        console.log(e)
        if (e.name === "SequelizeUniqueConstraintError"){
            res.status(403).send({
                status:"failed",
                message:"Email already used"
            })
        }else{
            res.status(500).send({
                status:"failed",
                message:"Server error"
            })
        }
    }

}

exports.deleteUser = async (req, res) => {
    try{
        const data = await User.destroy({
            where: {
                id: req.params.id
            }
        })
        
        if (data === 0){
            res.send({
                status:"failed",
                message:"User not found",
            })    
        }else{
            res.send({
                status:"success",
                message:"Delete user successful",
                data: {id: req.params.id}
            })

        }

    }catch(e){
        console.log(e)
        res.status(500).send({
            status:"failed",
            message:"Server error"
        })
    }
}