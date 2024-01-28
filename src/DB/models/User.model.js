import {Schema , Types, model} from 'mongoose' 

const userschema = new Schema({
    userName:{
        type: String , 
        required: true
    },
    email:{
        type: String , 
        required: true,
        unique:true
    },
    password:{
type : String ,
required :true , 
    },
    age:Number,
    phone : String,
    gender:{
        type:String,
        enum:['female','male'],
        default:'female'
    },
    confirmEmail:{
        type: Boolean,
        default : false 
    },
    profilepicture: {
        type : Object,
    } ,
    coverpicture: [{
        type : Object
    }],
    messages :[{
        type:Types.ObjectId,
        ref :'Message'
    }],
    isDeleted: {
        type: Boolean,
        default: false,
      }

},{timeStamps : true})

const usermodel = model('User',userschema)

export default usermodel 