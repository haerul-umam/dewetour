const {Country} = require("../../models")
const Joi = require("joi")


exports.addCountry = async (req,res) => {

    const schema = Joi.object({
        country: Joi.string().min(3).required(),
    })

    const {error} = schema.validate(req.body)

    if (error) {
        return res.status(400).send({
            status: "failed",
            message: error.details[0].message,
        })
    }

    try{
        let body = {name: req.body.country}
        await Country.create(body)
        const data = await Country.findOne({
            where: {name:req.body.country},
            attributes:{exclude:["createdAt","updatedAt"]}
        })

        res.send({
            status:"success",
            message:"Add country successful",
            data: data
        })
    }catch(e){
        console.log(e)
        if (e.name === "SequelizeUniqueConstraintError"){
            res.status(403).send({
                status:"failed",
                message:"Country already registered"
            })
        }else{
            res.status(500).send({
                status:"failed",
                message:"Server error"
            })
        }
    }
}

exports.getCountries = async (req, res) => {
    try{
        const countries = await Country.findAll({attributes:{exclude:["createdAt","updatedAt"]}})
       
        res.send({
            status:"success",
            data: [ ...countries ]
        })

    }catch(e){
        console.log(e)
        res.status(500).send({
            status:"failed",
            message:"Server error"
        })
    }

}

exports.getCountry = async (req, res) => {
    try{
        const country = await Country.findOne({
            where: {id:req.params.id},
            attributes:{exclude:["createdAt","updatedAt"]}
        })
       
        res.send({
            status:"success",
            data: country
        })

    }catch(e){
        console.log(e)
        res.status(500).send({
            status:"failed",
            message:"Server error"
        })
    }

}


exports.updateCountry = async (req, res) => {
    const schema = Joi.object({
        country: Joi.string().min(3),
    })

    const {error} = schema.validate(req.body)

    if (error) {
        return res.status(400).send({
            status: "failed",
            message: error.details[0].message,
        })
    }

    try{
        const data = await Country.update({name: req.body.country}, {
            where: {
                id: req.params.id
            }
        })

        const country = await Country.findOne({
            where: {id:req.params.id},
            attributes:{exclude:["createdAt","updatedAt"]}
        })

        
        if(data[0] === 0){
            res.send({
                status:"success",
                message:"Nothing to update",
            })  
        }else{
            res.send({
                status:"success",
                message:"Update country successful",
                data: country
            })
        }

    }catch(e){
        console.log(e)
        if (e.name === "SequelizeUniqueConstraintError"){
            res.status(403).send({
                status:"failed",
                message:"Country already exist"
            })
        }else{
            res.status(500).send({
                status:"failed",
                message:"Server error"
            })
        }
    }

}

exports.deleteCountry = async (req, res) => {
    try{
        const data = await Country.destroy({
            where: {
                id: req.params.id
            }
        })
        
        if(data === 0){
            res.send({
                status:"failed",
                message:"Country not found",
            })  
        }else{
            res.send({
                status:"success",
                message:"Delete country successful",
                data:{...req.params}
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
