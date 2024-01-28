import joi from 'joi'
import { generalfields } from '../../utils/generalfields.js'



export const token = joi.object({
    auth : generalfields.auth
})

export const shareprofileschema = joi.object({
_id : generalfields.id
}).required()

export const signUpschema = joi.object({
    userName : joi.string().min(3).max(15).required(),
    email :generalfields.email,
    password : generalfields.password,
    cpassword : joi.string().valid(joi.ref('password')).required()
}).required()

export const loginschema = joi.object({
    email : generalfields.email ,
    password : generalfields.password,
}).required()

export const changepassschema = joi.object({
    oldpass : generalfields.password,
    newpass : generalfields.password,
    cpass : joi.string().valid(joi.ref('newpass')).required()
}).required()

export const uploadProfilImageSchema = joi.object({
    file : generalfields.file
}).required()

export const uploadcoverlImageSchema = joi.object({
    files : generalfields.files
}).required()



