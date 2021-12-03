const {Trip, User, Transaction, Country} = require("../../models")
const { zipImageToObj, singleExtactImage } = require("../functions/imageString")
const Joi = require("joi")
const moment = require("moment")
const {db} = require ("../database/connection.js")

exports.addTransaction = async (req, res) =>{
    const schema = Joi.object({
        reservation: Joi.number().integer().positive().required(),
        trip_id: Joi.number().integer().required(),
        price: Joi.number().integer().required()
    })
    
    const {error} = schema.validate(req.body)

    if (error) {
        return res.status(400).send({
            status: "failed",
            message: error.details[0].message,
        })
    }

    const t = await db.transaction()
    try{

        const {price, quota, quota_filled} = await Trip.findOne(
            {where: {id: req.body.trip_id}, 
            attributes:["price","quota","quota_filled"], 
            transaction: t, 
            lock: t.LOCK.UPDATE}
        )

        if (price !== req.body.price) {
            await t.rollback()
            return res.status(400).send({status: "failed", message: "Any changes from the price, refresh the page please! "})
        }
        
        if (parseInt(req.body.reservation) + quota_filled > quota) {
            await t.rollback()
            return res.status(400).send({status: "failed", message: "Reach maximum quota!"})
        }
        
        let total = req.body.reservation * price
        const insertData = await Transaction.create({
            ...req.body, 
            total, 
            status:"Waiting Payment",
            customer_id: req.user.id
        },{transaction: t})

        await Trip.increment("quota_filled", { 
            by: req.body.reservation, 
            where: {id: req.body.trip_id},
            transaction: t}
        )

        await t.commit()

        const data = await Transaction.findOne({
            where: {id: insertData.id},
            attributes: {exclude:["createdAt","updatedAt","trip_id","customer_id"]},
            include: [
                {
                    model: User,
                    as: "customer",
                    attributes: ["fullName"]
                },
                {
                    model: Trip,
                    as: "trip",
                    include: [
                        {
                            model: Country,
                            as: "country",
                            attributes: {exclude:["createdAt","updatedAt"]}
                        },
                    ],
                    attributes: {exclude: ["country_id","createdAt","updatedAt"]}
                }]
        })

        res.send({
            status:"success",
            message:"Add transaction successful",
            data
            
        })
    }catch(e){
        console.log(e)
        res.status(500).send({
            status:"failed",
            message:"Server error"
        })

        await t.rollback()
    }
}


exports.getTransactions = async (req, res) => {
    try {
        const orders = await Transaction.findAll({
            raw: true,
            nest: true,
            attributes:{exclude:["createdAt","updatedAt","trip_id","customer_id"]},
            include: [
                {
                    model: User,
                    as: "customer",
                    attributes: ["fullName","id","gender", "phone"]
                },
                {
                    model: Trip,
                    as: "trip",
                    include: [
                        {
                            model:Country,
                            as:"country",
                            attributes: {exclude:["createdAt","updatedAt"]}
                        },
                    ],
                    attributes: {exclude: ["country_id","createdAt","updatedAt"]}
                }],
        })
       
        res.send({
            status:"success",
            data: orders.map(val => {
                return {...val, 
                    proof: singleExtactImage(val.attachment),
                    orderDate: moment(val.createdAt).format("dddd, D MMMM YYYY")
                }
            })
        })

    }catch(e) {
        console.log(e)
        res.status(500).send({
            status:"failed",
            message:"Server error"
        })
    }
}


exports.getBelongToUserTransaction = async (req, res) => {
    try {
        const orders = await Transaction.findAll({
            raw: true,
            nest: true,
            where: {
                customer_id: req.user.id,
                status: ["Waiting Payment","Waiting Approve"]
            },
            attributes:{exclude:["updatedAt","createdAt","trip_id","customer_id"]},
            include: [
                {
                    model: User,
                    as: "customer",
                    attributes: ["fullName","gender","phone"]
                },
                {
                    model: Trip,
                    as: "trip",
                    include: [
                        {
                            model:Country,
                            as:"country",
                            attributes: {exclude:["createdAt","updatedAt"]}
                        },
                    ],
                    attributes: {exclude: ["country_id","createdAt","updatedAt"]}
                }],
        })

        res.send({
            status:"success",
            data:  orders.map(order => {
                return {
                    orderDate: moment(order.createdAt).format("dddd, D MMMM YYYY"),
                    proof: singleExtactImage(order.attachment),
                    ...order,
                }
            }) 
        })

    }catch(e) {
        console.log(e)
        res.status(500).send({
            status:"failed",
            message:"Server error"
        })
    }
}

exports.getHistoryUser = async (req, res) => {
    try {
        const orders = await Transaction.findAll({
            raw: true,
            nest: true,
            where: {
                customer_id: req.user.id,
                status: ["Approved","Pending","Cancel"]
            },
            attributes:{exclude:["updatedAt","createdAt","trip_id","customer_id"]},
            include: [
                {
                    model: User,
                    as: "customer",
                    attributes: ["fullName","gender","phone"]
                },
                {
                    model: Trip,
                    as: "trip",
                    include: [
                        {
                            model:Country,
                            as:"country",
                            attributes: {exclude:["createdAt","updatedAt"]}
                        },
                    ],
                    attributes: {exclude: ["country_id","createdAt","updatedAt"]}
                }],
        })
        
        res.send({
            status:"success",
            data:  orders.map(order => {
                return {
                    orderDate: moment(order.createdAt).format("dddd, D MMMM YYYY"),
                    proof: singleExtactImage(order.attachment),
                    ...order,
                }
            }) 
        })

    }catch(e) {
        console.log(e)
        res.status(500).send({
            status:"failed",
            message:"Server error"
        })
    }
}

exports.getTransaction = async (req, res) => {
    try {
        const data = await Transaction.findOne({
            where: {
                id: req.params.id
            },
            attributes:{exclude:["createdAt","updatedAt","trip_id","customer_id"]},
            include: [
            {
                model: User,
                as: "customer",
                attributes: ["fullName"]
            },
            {
                model: Trip,
                as: "trip",
                include: [
                    {
                        model:Country,
                        as:"country",
                        attributes: {exclude:["createdAt","updatedAt"]}
                    },
                ],
                attributes: {exclude: ["country_id","createdAt","updatedAt"]}
            }],
        })
        
        res.send({
            status: "success",
            data
        })
    }catch(e) {
        console.log(e)
        res.status(500).send({
            status:"failed",
            message:"Server error"
        })
    }
}

exports.updateTransaction = async (req, res) => {
    const schema = Joi.object({
        reservation: Joi.number().integer(),
        trip_id: Joi.number().integer(),
        price: Joi.number().integer(),
        status: Joi.string().required()
    })

    const {error} = schema.validate(req.body)

    if (error) {
        return res.status(400).send({
            status: "failed",
            message: error.details[0].message,
        })
    }

    try {
        
        let dataToUpdate = req.body

        if (req.body.status === "Cancel"){
            const t = await db.transaction()

            const transact = await Transaction.findOne({where: {id: req.params.id}, transaction: t})
            const tripForUpdate = await Trip.findOne({where: {id: transact.trip_id}, transaction: t, lock: t.LOCK.UPDATE})
            let total = tripForUpdate.quota_filled - transact.reservation
            if (total < 0){
                total = 0
            }
            await Trip.update({quota_filled: total},{where: {id: transact.trip_id}, transaction: t})
            await Transaction.update(dataToUpdate, {where: { id: req.params.id }, transaction: t})

            t.commit()

            const updated = await Transaction.findOne({
                where: {
                    id: req.params.id
                },
                attributes:{exclude:["createdAt","updatedAt","trip_id","customer_id","attachment"]},
                include: [
                {
                    model: User,
                    as: "customer",
                    attributes: ["fullName","email","id"]
                },
                {
                    model: Trip,
                    as: "trip",
                    include: [
                        {
                            model:Country,
                            as:"country",
                            attributes: {exclude:["createdAt","updatedAt"]}
                        },
                    ],
                    attributes: {exclude: ["country_id","createdAt","updatedAt"]}
                }],
            })

            return res.send({
                status:"success",
                message:"Update transaction successful",
                data: updated
            })

        }

        if (req.body.status === "Waiting Approve"){
            // if user id not equal to customer_id field in transaction. return failed
            const toCompare = await Transaction.findOne({where: {id: req.params.id}})

            if (toCompare.customer_id !== req.user.id){
                return res.status(403).send({
                    status: "failed",
                    message: "Unauthorized"
                })
            }
            if (!req.files.image || req.files.image.length !== 1) {
                return res.status(400).send({
                    status: "failed",
                    message: "Please upload proof transaction"
                })
            }
            dataToUpdate = {...dataToUpdate, attachment: zipImageToObj(req.files.image)}
        }
        
        if (req.body.status !== "Waiting Approve") {
            if (req.user.role === "user") {
                return res.status(403).send({
                    status: "failed",
                    message: "Unauthorized"
                })
            }
        }

        const data = await Transaction.update(dataToUpdate, {
            where: { id: req.params.id }
        })
        
        const updated = await Transaction.findOne({
            where: {
                id: req.params.id
            },
            attributes:{exclude:["createdAt","updatedAt","trip_id","customer_id","attachment"]},
            include: [
            {
                model: User,
                as: "customer",
                attributes: ["fullName","email","id"]
            },
            {
                model: Trip,
                as: "trip",
                include: [
                    {
                        model:Country,
                        as:"country",
                        attributes: {exclude:["createdAt","updatedAt"]}
                    },
                ],
                attributes: {exclude: ["country_id","createdAt","updatedAt"]}
            }],
        })

        if(data[0] === 0){
            res.send({
                status:"success",
                message:"Nothing to update",
            })  
        }else{
            res.send({
                status:"success",
                message:"Update transaction successful",
                data: updated
            })
        }

    }catch(e) {
        console.log(e)
        res.status(500).send({
            status:"failed",
            message:"Server error"
        })
    }

}
