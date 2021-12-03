const {Notification, User, Transaction, Trip} = require("../../models")
const moment = require("moment")
const jwt = require("jsonwebtoken")
const {singleExtactImage} = require("../functions/imageString")

const connectedUser = {}

const socketIo = (io) => {
    io.use((socket, next) => {
        if (socket.handshake.auth && socket.handshake.auth.token){
            next()
        }else{
            next(new Error("Unauthorized"))
        }
    })

    io.on("connection", async (socket) => {
        console.log("connect", socket.id)


        const userMail = socket.handshake.query.mail
        connectedUser[userMail] = socket.id
       
        // only transaction with status waiting approve to display in notif
        socket.on("load payment", async () => {
           try{
                const token = socket.handshake.auth.token
                const tokenKey = process.env.TOKEN_KEY
                const verified = jwt.verify(token, tokenKey)

                const payment = await Notification.findAll({
                    raw: true,
                    nest: true,
                    where: {
                        is_read: "N",
                        id_recipient: verified.id
                    },
                    include: [
                        {
                            model: Transaction,
                            as: "transaction",
                            attributes: {
                                exclude: ["createdAt","updatedAt","customer_id","trip_id"]
                            },
                            where: {
                                status: "Waiting Approve"
                            },
                            include: [
                                {model: User,
                                as: "customer",
                                attributes: ["fullName"]},
                                {model: Trip,
                                as: "trip",
                                attributes: ["title"]}
                            ]
                        }
                    ],
                    attributes: ["id"],
                    order: [["createdAt", "ASC"]]
                })
                
                socket.emit("get payment", 
                payment.map(val => {
                    return {...val,"transactionDate": moment(val?.transaction?.createdAt).format("D MMM YYYY"), "attachment": singleExtactImage(val.transaction.attachment)}
                })
                )
           }catch(e){
                console.log(e) 
           }
        })

        socket.on("load update", async () => {
            try{
                 const token = socket.handshake.auth.token
                 const tokenKey = process.env.TOKEN_KEY
                 const verified = jwt.verify(token, tokenKey)
 
                 const payment = await Notification.findAll({
                     raw: true,
                     nest: true,
                     where: {
                         is_read: "N",
                         id_recipient: verified.id
                     },
                     include: [
                         {
                             model: Transaction,
                             as: "transaction",
                             attributes: {
                                 exclude: ["createdAt","updatedAt","customer_id","trip_id"]
                             },
                             include: [
                                 {model: User,
                                 as: "customer",
                                 attributes: ["fullName"]},
                                 {model: Trip,
                                 as: "trip",
                                 attributes: ["title"]}
                             ]
                         }
                     ],
                     attributes: ["id"],
                     order: [["createdAt", "ASC"]]
                 })
                 
                 socket.emit("get data update", 
                 payment.map(val => {
                     return {...val,"transactionDate": moment(val?.transaction?.createdAt).format("D MMM YYYY")}
                 })
                 )
            }catch(e){
                 console.log(e) 
            }
         })



        socket.on("send proof", async (id) => {
            try{
                const admin = await User.findOne({
                    where: {role : "admin"},
                    attributes: ["email","id"]
                })
                
                const insertData = await Notification.create({
                    id_recipient: admin.id,
                    id_transaction: id,
                    is_read: "N"
                })

                io.to(connectedUser[admin.email]).emit("new payment", insertData)
            }catch(e){
                console.log(e)
            }
        })

        socket.on("update payment", async (payload) => {
            try{
                await Notification.create({
                    id_recipient: payload.customer.id,
                    id_transaction: payload.id,
                    is_read: "N"
                })
                io.to(connectedUser[payload.customer.email]).emit("get update status", payload.id)
            }catch(e){
                console.log(e)
            }
        })

        socket.on("update read", async (id, recipient) => {
            try{
                await Notification.update({is_read:"Y"}, {where : {id: id}})
                io.to(connectedUser[recipient]).emit("get update read", id)
            }catch(e){
                console.log(e)
            }
        })

        socket.on("update status mark as read", async (id) => {
            try{
                const admin = await User.findOne({
                    where: {role : "admin"},
                    attributes: ["email","id"]
                })
                await Notification.update({is_read:"Y"}, {where : {id_transaction: id, id_recipient: admin.id}})
                io.emit("mark as read after action", id)
            }catch(e){
                console.log(e)
            }
        })

        socket.on("disconnect", ()=> {
            console.log("disconnect", socket.id)

            delete connectedUser[userMail]
        })

    })
}

module.exports = socketIo