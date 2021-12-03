const jwt = require("jsonwebtoken")


exports.auth = (roles) => {
    /*
    roles param can fill with string 'user' or 'admin'
    if not filled, anyone can access with authorization
    if filled with specific , the access belongs to the param
    */
    return (
        (req, res, next) => {
            const reqHeader = req.header("Authorization")
            const token = reqHeader && reqHeader.split(" ")[1]

            if (!token) {
                return res.status(401).send({status:"failed",message:"Access denied"})
            }

            try {
                // store id user from token to req.user object
                const verified = jwt.verify(token, process.env.TOKEN_KEY)
                req.user = verified

                // access for admin only
                if (roles === "admin" && req.user.role === "user") {
                    return res.status(401).send({status:"failed", message: 'Unauthorized' })
                }

                // access for user only
                if (roles === "user" && req.user.role === "admin") {
                    return res.status(401).send({status:"failed", message: 'Unauthorized' })
                }

                next()
                
            }catch(e) {
                res.status(400).send({status:"failed",message:"Invalid token"})
            }
        }
    )
}
