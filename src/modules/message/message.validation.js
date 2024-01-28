import joi from "joi"
import { generalfields } from "../../utils/generalfields.js"
export const messagevalidate = joi.object({
message: joi.string().min(10).max(500).required(),
id: generalfields.id

}).required()

export const deletemessageschema = joi.object({
    id: generalfields.id,
    auth : generalfields.auth
    
    }).required()
