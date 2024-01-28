import { Router } from "express" 
import { profile ,signup,login,confirmEmail,refreshToken,shareprofile,changepassword, uploadProfilImage, uploadCoverImage,softdelete} from "./controller/user.controller.js"
import { asynchandler } from "../../utils/asyncHandler.js"
import auth from "../../midelware/auth.js"
import { loginschema, shareprofileschema, signUpschema, token, uploadProfilImageSchema,uploadcoverlImageSchema } from "./user.validation.js"
import validation from '../../midelware/validation.js'
import uploadFilecloud, { fileValidation } from "../../utils/multer/multer.js"

const router = Router()

router.post('/signup',validation(signUpschema),asynchandler(signup))
.post('/login',validation(loginschema),asynchandler(login))
.get('/',validation(token,true),asynchandler(auth),asynchandler(profile))
.get('/confirmEmail/:token',asynchandler(confirmEmail))
.get('/refreshToken/:token',asynchandler(refreshToken))
.get('/view/:_id',validation(shareprofileschema),asynchandler(shareprofile))
router.patch('/softdelete',validation(token,true),asynchandler(auth),asynchandler(softdelete))
.patch('/changepassword',asynchandler(auth),asynchandler(changepassword))
.patch('/uploadProfilImage',validation(token,true), asynchandler(auth),
uploadFilecloud(fileValidation.image).single('file'),
    validation(uploadProfilImageSchema), uploadProfilImage)

.patch('/uploadCoverImage'
    , validation(token,true),asynchandler(auth),
  uploadFilecloud(fileValidation.image).array('files', 4),
    validation(uploadcoverlImageSchema),
    uploadCoverImage)

export default router