import {Router} from "express";
import authRoute from "./AuthRoute.js"
import adminRoute from './AdminRoute.js'
import userRoute from './UserRoute.js';
const router = Router();

router.use('/auth/user',authRoute);
router.use('/admin/data',adminRoute);
router.use('/user/data',userRoute);

export default router;