import connection from './DB/connection.js'
import userRouter from './modules/user/user.router.js'
import messageRouter from './modules/message/message.router.js'
import { globalError } from './utils/asyncHandler.js'
 const bootstrap = (app,express)=>{
    connection()
app.use(express.json())
app.use('/src/uploads',express.static('src/uploads'))
app.use('/user',userRouter)
app.use('/message',messageRouter)
app.use('*',(req,res,next)=>{
    return res.json({message:"invalid url"})
})
app.use(globalError)
}
export default bootstrap