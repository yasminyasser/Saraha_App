import jwt from 'jsonwebtoken'
import usermodel from '../DB/models/User.model.js'

const auth = async(req,res,next)=>{
const {auth} = req.headers

 if(!auth){
    return next(new Error ('please login'))
 }
 const token = auth.split(process.env.BEARER_KEY)[1]
if(!token){
    return next(new Error ('invalid token'))
}
const payload = jwt.verify(token,process.env.AUTH_SIGNETURE)
if(!payload?._id){
    return next(new Error ('invalid payload'))
}
const user = await usermodel.findOne({_id:payload._id}).select('-password')
if(!user){
    return next(new Error ('user not found'))
}
req.user = user
next()
}
export default auth