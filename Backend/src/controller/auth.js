const {User} = require("../../models")

const Joi = require("joi")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { singleExtactImage } = require("../functions/imageString")


exports.login = async (req,res) => {

    const schema = Joi.object({
        email: Joi.string().email().min(6).required(),
        password: Joi.string().min(7).required()
    })

    const {error} = schema.validate(req.body)

    if (error) {
        return res.status(400).send({
            status: "failed",
            message: error.details[0].message,
        })
    } 

    try{
        const exist = await User.findOne({
            where: { email: req.body.email }
        })
        // need improve
        if (!exist) {
            return res.status(400).send({
                status: "failed",
                message: "Email not found"
            })
        }
        const isValid = await bcrypt.compare(req.body.password, exist.password)

        if (!isValid) {
            return res.status(400).send({
                status: "failed",
                message: "Invalid password"
            })
        }

        const token = jwt.sign({id: exist.id, role: exist.role}, process.env.TOKEN_KEY)

        res.send({
            status:"success",
            data : {
                fullName: exist.fullName,
                email: exist.email,
                role: exist.role,
                gender: exist.gender,
                token
            },
        })
    }catch(e){
        console.log(e)
        res.status(500).send({
            status:"failed",
            message:"Server error"
        })
    }
}


exports.registerUser = async (req,res) => {

    const schema = Joi.object({
        fullName: Joi.string().min(4).required(),
        email: Joi.string().email().min(6).required(),
        password: Joi.string().min(7).required(),
        phone: Joi.string().min(8).required(),
        address: Joi.string(),
        gender: Joi.string().required(),
    })

    const {error} = schema.validate(req.body)

    if (error) {
        return res.status(400).send({
            status: "failed",
            message: error.details[0].message,
        })
    }

    try{

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        
        const user = await User.create({...req.body,
            password: hashedPassword,
            role:"user",
        })
        
        const token = jwt.sign({id: user.id, role: user.role}, process.env.TOKEN_KEY)

        
        res.send({
            status:"success",
            message:"Register successful",
            data: {
                name: req.body.fullName,
                email: req.body.email,
                token
            }
        })
    }catch(e){
        console.log(e)
        if (e.name === "SequelizeUniqueConstraintError"){
            res.status(403).send({
                status:"failed",
                message:"Email already registered"
            })
        }else{
            res.status(500).send({
                status:"failed",
                message:"Server error"
            })
        }
    }
}

exports.checkUser = async (req, res) => {
    const reqHeader = req.header("Authorization")
    const token = reqHeader && reqHeader.split(" ")[1]

    if (!token) {
        return res.status(401).send({status:"failed",message:"Access denied"})
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_KEY)
       
        const data = await User.findOne({
            raw:true,
            where: {id: verified.id}, 
            attributes:["fullName","role","email","image","gender"]
        })
        
        res.send({
            status:"success", 
            user: {...data, image: singleExtactImage(data.image)}})

    } catch (error) {
        console.log(error)
        res.status(401).send({status:"failed", message:"Unauthorized"})
    }
}