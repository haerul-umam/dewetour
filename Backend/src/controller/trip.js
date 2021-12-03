const { Trip, Country, Transaction} = require("../../models")
const { zipImageToObj, extractImage } = require("../functions/imageString")
const Joi = require("joi").extend(require("@joi/date"))
const moment = require("moment")
const sequelize = require("sequelize")
const {db} = require ("../database/connection.js")

exports.addTrip = async (req, res) =>{
    const schema = Joi.object({
        title: Joi.string().min(10).required(),
        country_id: Joi.number().integer().required(),
        accommodation: Joi.string().min(10).required(),
        transportation: Joi.string().min(2).required(),
        day: Joi.number().integer().required(),
        night: Joi.number().integer().required(),
        eat: Joi.string().min(5).required(),
        dateTrip: Joi.date().format("YYYY-MM-DD").required(),
        price: Joi.number().integer().required(),
        quota: Joi.number().integer().required(),
        description: Joi.string().required()
    })

    const {error} = schema.validate(req.body)

    if (error) {
        return res.status(400).send({
            status: "failed",
            message: error.details[0].message,
        })
    }

    if (!req.files.image || req.files.image.length !== 4){
        return res.status(400).send({
            status: "failed",
            message: "Minimum 4 image files to upload",
        })
    }

    try{
        const imageToObj = zipImageToObj(req.files.image)
        const description = req.body.description.replace(/(\r\n)/g, "<br>")
        const insertData = await Trip.create({...req.body, description ,image: imageToObj})
        const data = await Trip.findOne({
            where: {id:insertData["dataValues"].id},
            include:[
                {
                    model:Country,
                    as:"country",
                    attributes: {exclude:["createdAt","updatedAt"]}
                }
            ],
            attributes:{exclude:["createdAt","updatedAt","country_id"]}
        })

        res.send({
            status:"success",
            message:"Add trip successful",
            data
            
        })
    }catch(e){
        console.log(e)
        res.status(500).send({
            status:"failed",
            message:"Server error"
        })
    }
}

exports.getTrips = async (req, res) => {
    try{
        const trip = await Trip.findAll({
            where : {
                "quota_filled" : {[sequelize.Op.lt] : sequelize.col("quota")}
            },
            attributes:{
                exclude: ["createdAt","updatedAt","country_id"]
            },
            raw: true,
            nest: true,
            include: [
                {
                    model:Country,
                    as:"country",
                    attributes: {exclude:["createdAt","updatedAt","id"]}
                }
            ],
        })
       
        res.send({
            status:"success",
            data: trip.map((val) => {
                return {...val, 
                    dateTrip: moment(val.dateTrip).format("D MMMM YYYY"),
                    image: extractImage(val.image)
                }
            })
        })

    }catch(e){
        console.log(e)
        res.status(500).send({
            status:"failed",
            message:"Server error"
        })
    }
}


exports.getAdminTrips = async (req, res) => {
    try{
        const trip = await Trip.findAll({
            attributes:{
                exclude: ["createdAt","updatedAt","country_id"]
            },
            raw: true,
            nest: true,
            include: [
                {
                    model:Country,
                    as:"country",
                    attributes: {exclude:["createdAt","updatedAt","id"]}
                }
            ],
        })
       
        res.send({
            status:"success",
            data: trip.map((val) => {
                return {...val, 
                    dateTrip: moment(val.dateTrip).format("D MMMM YYYY"),
                    image: extractImage(val.image)
                }
            })
        })

    }catch(e){
        console.log(e)
        res.status(500).send({
            status:"failed",
            message:"Server error"
        })
    }
}

exports.getTrip = async (req, res) => {
    try{
        const trip = await Trip.findOne({
            where: {id:req.params.id},
            attributes:{
                exclude: ["createdAt","updatedAt","country_id"]
            },
            raw: true,
            nest: true,
            include: [
                {
                    model:Country,
                    as:"country",
                    attributes: {exclude:["createdAt","updatedAt","id"]}
                }
            ],
        })
     
        res.send({
            status:"success",
            data : {...trip, 
                dateTrip: moment(trip.dateTrip).format("D MMMM YYYY"), 
                image: extractImage(trip.image)}
        })

    }catch(e){
        console.log(e)
        res.status(500).send({
            status:"failed",
            message:"Server error"
        })
    }

}


exports.updateTrip = async (req, res) => {
    const schema = Joi.object({
        title: Joi.string().min(10),
        country_id: Joi.number().integer(),
        accommodation: Joi.string().min(10),
        transportation: Joi.string().min(2),
        day: Joi.number().integer(),
        night: Joi.number().integer(),
        eat: Joi.string().min(5),
        dateTrip: Joi.date().format("YYYY-MM-DD"),
        price: Joi.number().integer(),
        quota: Joi.number().integer(),
        description: Joi.string()
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

        if(req.files.image){
            if(req.files.image.length !== 4){
                return res.status(400).send({
                    status: "failed",
                    message: "Minimum 4 image files to upload",
                })
            }
            dataToUpdate = {...dataToUpdate, image: zipImageToObj(req.files.image)}
        }

        const data = await Trip.update(dataToUpdate, {
            where: {
                id: req.params.id
            }
        })

        const trip = await Trip.findOne({
            where: {id:req.params.id},
            attributes:{exclude:["createdAt","updatedAt","country_id"]},
            include: [
                {
                    model:Country,
                    as:"country",
                    attributes: {exclude:["createdAt","updatedAt"]}
                }
            ],
        })

        const dataTrip = trip.get({plain: true})

        if(data[0] === 0){
            res.send({
                status:"success",
                message:"Nothing to update",
            })  
        }else{
            res.send({
                status:"success",
                message:"Update trip successful",
                data: {...dataTrip, 
                    dateTrip: moment(dataTrip.dateTrip).format("D MMMM YYYY"), 
                    image: extractImage(dataTrip.image)
                }
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

exports.deleteTrip = async (req, res) => {
    try{
        const data = await Trip.destroy({
            where: {
                id: req.params.id
            }
        })
        
        if(data === 0){
            res.send({
                status:"failed",
                message:"Trip not found",
            })  
        }else{
            res.send({
                status:"success",
                message:"Delete trip successful",
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


exports.searchTrip = async (req, res) => {
    try {
        let query = req.query.q

        const trip = await db.query('SELECT `Trip`.`id`, `Trip`.`title`, `Trip`.`accommodation`, `Trip`.`transportation`, `Trip`.`eat`, `Trip`.`day`, `Trip`.`night`, `Trip`.`dateTrip`, `Trip`.`price`, `Trip`.`quota`, `Trip`.`quota_filled`, `Trip`.`description`, `Trip`.`image`, `country`.`name` AS `country.name` FROM `Trips` AS `Trip` LEFT OUTER JOIN `Countries` AS `country` ON `Trip`.`country_id` = `country`.`id` WHERE MATCH(`Trip`.`title`,`Trip`.`description`) AGAINST(:search IN BOOLEAN MODE) AND `Trip`.`quota_filled` < `Trip`.`quota`', 
        {
            replacements: {search: `${query}*`},
            model: Trip, 
            raw: true,
            nest: true,
        })

        res.send({
            status:"success",
            data: trip.map((val) => {
                return {...val, 
                    dateTrip: moment(val.dateTrip).format("D MMMM YYYY"),
                    image: extractImage(val.image)
                }
            })
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status:"failed",
            message:"Server error"
        })
    }
}