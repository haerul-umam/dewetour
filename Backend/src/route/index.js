const express = require("express")
const router = express.Router()


const {getUsers, getUser, updateUser, deleteUser, getProfile} = require("../controller/user")
const {registerUser, login, checkUser} = require("../controller/auth")
const {addCountry, getCountries, getCountry, updateCountry, deleteCountry} = require("../controller/country")
const {addTrip, getTrips, getTrip, updateTrip, deleteTrip, getAdminTrips, searchTrip} = require("../controller/trip")
const {addTransaction, getTransactions, getTransaction, updateTransaction, getBelongToUserTransaction, getHistoryUser} = require("../controller/transaction")


// midlewares
const {uploadFile} = require("../../middlewares/uploadFile")
const {auth} = require("../../middlewares/auth")


// route
router.get("/users", auth("admin"), getUsers)
router.get("/user/:id", auth("admin") ,getUser)
router.put("/user", auth(), uploadFile("image") ,updateUser)
router.delete("/user/:id", auth("admin"), deleteUser)
router.get("/profile", auth(), getProfile)

router.post("/register", registerUser)
router.post("/login", login)
router.get("/check-user", checkUser)

router.post("/country", auth("admin") ,addCountry)
router.get("/countries", getCountries)
router.get("/country/:id", getCountry)
router.put("/country/:id", auth("admin") ,updateCountry)
router.delete("/country/:id", auth("admin") ,deleteCountry)

router.post("/trip", auth("admin"), uploadFile("image", max=4) ,addTrip)
router.get("/trips", getTrips)
router.get("/admin-trips", auth("admin"), getAdminTrips)
router.get("/trip/:id", getTrip)
router.put("/trip/:id", auth("admin"), uploadFile("image", max=4), updateTrip)
router.delete("/trip/:id", auth("admin"), deleteTrip)
router.get("/search", searchTrip)

router.post("/transaction", auth("user"), uploadFile("image") ,addTransaction)
router.get("/orders", auth("admin"), getTransactions)
router.get("/transaction/:id", auth("admin"), getTransaction)
router.put("/transaction/:id/status", auth(), uploadFile("image") ,updateTransaction)
router.get("/payment", auth(), getBelongToUserTransaction)
router.get("/history", auth(), getHistoryUser)


module.exports = router

 