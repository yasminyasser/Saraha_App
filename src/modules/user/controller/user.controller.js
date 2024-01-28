import usermodel from "../../../DB/models/User.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import sendEmail from "../../../utils/email.js"
import { asynchandler } from "../../../utils/asyncHandler.js"
import cloudinary from '../../../utils/cludinary.js'

export const profile = async(req,res ,next)=>{
const profile = await usermodel.find(req.user).populate({
    path : 'messages',
    select: '-recievedid'
})
return res.json({message:"done",profile})
}
export const signup = async(req,res ,next)=>{
    const {userName,email,password}=req.body
    const exist = await usermodel.findOne({email})
    if(exist){
        return res.json({message:"user already exist"})
    }
        const hash = bcrypt.hashSync(password,+process.env.HASH_ROUND)
        const signup = await usermodel.create({userName , email , password:hash})
        const token = jwt.sign({email , _id:signup._id},process.env.AUTH_SIGNETURE,{expiresIn:60*5})
        const link = `${req.protocol}://${req.headers.host}/user/confirmEmail/${token}`
        const refreshToken = jwt.sign({email , _id:signup._id},process.env.AUTH_SIGNETURE,{expiresIn:60*60*24})
        const refreshlink = `${req.protocol}://${req.headers.host}/user/refreshToken/${refreshToken}`
        sendEmail({to :signup.email,subject: 'confirmEmail',
        html:
        `<a href='${link}'>confirm email</a> 
        <br>
        <br> 
        <a href='${refreshlink}'>
        refreshToken</a>`})
        return signup? res.json({message:"user added",signup}):res.json({message:'invalid'})
    }

export const login = async(req,res ,next)=>{
        const {email,password}=req.body
        const exist = await usermodel.findOne({email})
        if(!exist){
            return next(new Error("wrong email or password",{cause:404}))
            // return res.json({message:"wrong email "})
        }
        if(!exist.confirmEmail){
    return next(new Error ('please confirm email first',{cause:400}))
}
            const compare = bcrypt.compareSync(password, exist.password)
            if(compare){
             const token = jwt.sign({_id:exist._id,email:exist.email},process.env.AUTH_SIGNETURE,{expiresIn:60*60})
            return res.status(200).json({message:"loginned successfully",token})}
            return res.json({message:"wrong email or password"})
        }
        
export const confirmEmail = async(req,res,next)=>{
    const{token} = req.params
    const payload = jwt.verify(token,process.env.AUTH_SIGNETURE)
    const user = await usermodel.findOneAndUpdate({email:payload.email},{confirmEmail:true})
    if(user) {
       return res.redirect('http://127.0.0.1:5501/login.html')
}
    return res.redirect ('http://127.0.0.1:5501/signup.html')
}

export const refreshToken = async(req,res,next)=>{
    const{token} = req.params
    const payload = jwt.verify(token,process.env.AUTH_SIGNETURE)
    const newToken = jwt.sign({email:payload.email , _id:payload._id},process.env.AUTH_SIGNETURE,{expiresIn:60*2})
    const link = `${req.protocol}://${req.headers.host}/user/confirmEmail/${newToken}`
    const user = await usermodel.findOne({ _id:payload._id , confirmEmail:false})
   if(!user){
     return res.redirect('http://127.0.0.1:5501/login.html') 
    }
    
    sendEmail({to :payload.email,subject: 'confirmEmail',html:`<a href='${link}'>confirm email</a>`})
    return  res.json({message:"check your email"})
}

export const shareprofile = async(req,res,next)=>{
const {_id} = req.params
const view = await usermodel.findById({_id}).select('userName gender coverpicture profilepicture')
if(!view){
    return next(new Error("user not found",{cause:404}))
}
return res.json({message:"done",profile : view})
}

export const changepassword =async (req,res,next)=>{
const{oldpass,newpass} = req.body
const{_id} = req.user
const user = await usermodel.findById({_id})
if(!user){
    return next(new Error("user not found",{cause:404}))
}
const match = bcrypt.compareSync(oldpass,user.password)
if(!match){
    return next(new Error("wrong password",{cause:400}))
}
const hash = bcrypt.hashSync(newpass, +process.env.HASH_ROUND)
user.password = hash 
await user.save()
return res.json({message:"done",user})
}

//6-soft delete(user must be logged in)
export const softdelete = async(req,res,next)=>{
    const {_id} = req.user
    //const {_id} = req.params 
    const exist = await usermodel.findByIdAndUpdate({_id},{isDeleted :true},{ new: true })
    if(!exist){
        return next(new Error ('user not exist',{cause:404}))
    }
     return res.status(200).json({message:'user soft deleted '})
    }

export const uploadProfilImage = 
    async (req, res, next) => {
        const {public_id,secure_url} = await cloudinary.uploader.upload(req.file.path,{folder : `${process.env.APP_NAME}/${req.user._id}/profile`})
        if(!public_id){
            return next(new Error('image not uploaded',{cause: 400}))
        }
        const user = await usermodel.findByIdAndUpdate((req.user._id), { profilepicture : {public_id,secure_url} },{ new: true })
        return res.json({ messagge: "Done", user })
    }


export const uploadCoverImage = 
    async (req, res, next) => {
        const images = []
        const files = req.files
        for (const file of files) {
            const {public_id , secure_url} = await cloudinary.uploader.upload(file.path,
                {folder : `${process.env.APP_NAME}/${req.user._id}/cover`})
        images.push({public_id , secure_url})
    }
     const user = await usermodel.findByIdAndUpdate(req.user._id,{$set : { coverpicture: images }},{new:true})
    return res.json({message:"done", user})
    }
