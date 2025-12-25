
const jwt = require('jsonwebtoken')
require('dotenv').config();
const secretkey = process.env.jwt_secret;

module.exports  = function (req, res, next) {
    const token = req.cookies.auth;
        // console.log("token ", token)
        if (!token) {
            return res.status(403).json({'message': 'access denied'})
        }
        jwt.verify(token, secretkey, (err, decoded) => {
            if (err) 
                {
                    return res.json({'message': 'invalid token'});
                }
            req.user_id = decoded.user_id;
            next();
        })
}