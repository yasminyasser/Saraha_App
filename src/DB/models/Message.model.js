import {Schema , model,Types} from 'mongoose' 

const messageschema = new Schema({
  message :{
    type : String , 
    required:true 
  },
  recievedid :{
type: Types.ObjectId,
ref :'User',
required:true 
  }
},{timeStamps : true})

const messagemodel = model('Message',messageschema)

export default  messagemodel 