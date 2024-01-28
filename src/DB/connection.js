import mongoose from 'mongoose'

const connection = async()=>{
    return await mongoose.connect(process.env.URI).then(()=>{
console.log("connected to DB");
    }).catch(()=>{
console.log("error to connect to DB");
    })
}

export default connection