import { Router } from "express" 
import { deletemessage, message} from "./controller/message.controller.js"
import { asynchandler } from "../../utils/asyncHandler.js"
import auth from "../../midelware/auth.js"
import validation from '../../midelware/validation.js'
import { deletemessageschema, messagevalidate } from "./message.validation.js"

const router = Router()



router.post('/send/:id', validation(messagevalidate),asynchandler(message))

router.delete('/:id', validation(deletemessageschema),auth,asynchandler(deletemessage))


export default router