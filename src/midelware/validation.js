
const validation =
    (schema,containHeaders = false)=>{
    return (req,res,next)=>{
try {
    let methods = {...req.body , ...req.params , ...req.query}
    if(req.file){
        methods.file = req.file
    }
    if(req.files){
        methods.files = req.files
    }
    if(req.headers.auth && containHeaders){
        methods = {auth : req.headers.auth}
            }
    const validationresult = schema.validate(methods,{abortEarly : false})
if(validationresult.error){
req.validationresult = validationresult.error 
return next(new Error('validation error',{cause : 400}))
}
next()

} catch (error) {
    return res.json({message: error.message , stack : error.stack})
}
}
}


export default validation
