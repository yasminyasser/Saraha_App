import  express  from "express"
import bootstrap from "./src/bootstrap.js"
import * as dotenv from 'dotenv';
import path from 'path';


dotenv.config({ path: path.resolve('./config/.env') });



const app = express()
const port = +process.env.PORT

bootstrap(app, express)



// QRCode.toDataURL('http://localhost:3000/user/view/6583b792b498b203f16d30fa', function (err, url) {
//   console.log(url)
// })

app.listen(port,()=>{
    console.log(`running ${port}`);
})