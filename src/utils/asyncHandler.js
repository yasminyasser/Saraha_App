export const asynchandler = (fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch((error)=>{

return next(new Error (error,{cause:500}))
        })
    }
    }


export const globalError = (error,req,res,next)=>{
    return res.status(error.cause || 400).json({message: error.message , stack : error.stack})
    }