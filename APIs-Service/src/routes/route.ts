import express, { Router } from 'express';
import {postSignup,postSignin,getUserService,postRecharge,
        postUserService,postServices,getServices, getBalance, deleteUserService} from './../controller/controller'

const routes: Router = express.Router();

//back office interactions
routes.post('/signup',postSignup);

routes.post('/add-new-service',postServices);

//chat bot interactions
routes.post('/list-services',getServices);

routes.post('/list-user-services',getUserService);

routes.post('/subscribe',postUserService);

routes.post('/unsubscribe',deleteUserService);//undone

routes.post('/signin',postSignin)

routes.post('/recharge',postRecharge);

routes.post('/getBalance',getBalance);

export { routes };
