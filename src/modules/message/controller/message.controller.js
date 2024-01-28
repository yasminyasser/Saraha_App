import messagemodel from "../../../DB/models/Message.model.js"
import usermodel from "../../../DB/models/User.model.js"

export const message = async(req,res,next)=>{
const {message} = req.body 
const {id} = req.params
const user = await usermodel.findById({_id:id})
if(!user){
    return next (new Error('not found',{cause:404}))
}
const newmessage =new messagemodel({
    message,recievedid:id
})
await newmessage.save()
const updateuser = await usermodel.updateOne({_id:id},{$push :{ messages : newmessage. id }})
//const addmessage = await messagemodel.create({message,recievedid})
res.status(201).json({message:"done",newmessage})
}

export const deletemessage = async(req,res,next)=>{
    const userId = req.user._id
    const {id} = req.params
    const deletemessage = await messagemodel.deleteOne({_id,userId})
    await usermodel.findByIdAndUpdate({id},{$pull :{ messages : id }})
    return deletemessage ? res.json({message:"done"}):next (new Error ('invalid id'))
}

