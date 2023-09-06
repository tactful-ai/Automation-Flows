import bcrypt from 'bcrypt'; 
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import User from './../model/userModel'
import userBalance from './../model/balanceHistory';
import userServices from './../model/userServices'
import userHistory from './../model/userHistory';
import Service from './../model/services';


//back office interations
export async function  postSignup(req : Request,res: Response,next:NextFunction){

    const email=req.body.email;
    const password = req.body.password;
    const number = req.body.number;
    try{
        const hashedPassword = await bcrypt.hash(password, 12); 
        const savedUser = await new User({ email, password: hashedPassword, number }).save();
        const savedUserBalance=await new userBalance({ userId:savedUser._id}).save();
        const savedUserServices=await new userServices({ userId:savedUser._id}).save();
        const savedUserHistory=await new userHistory({ userId:savedUser._id}).save();
        res.json(savedUser)
    }catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Internal Server Error',err });
        }
}


export async function getServices(req : Request,res: Response,next:NextFunction){
    
    const title=req.body.title;
    const content=req.body.content;
    const imgUrl=req.body.imgUrl;
    try {
        const elements=await Service.findOne({})
        return   res.json(elements);
     
    } catch (err) {
     console.error(err)
     return res.status(500).json({ error: 'Internal Server Error',err });
    }
}

export async function postServices(req : Request,res: Response,next:NextFunction){
    
   const title=req.body.title;
   const content=req.body.content;
   const imgUrl=req.body.imgUrl;
   const price =req.body.price;
   try {
       const savedPlan=await new Service({title,content,imgUrl,price}).save();
       return   res.send('success');
    
   } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal Server Error',err });
   }

}
 // chat-bot interactions
export async function postSignin(req : Request,res: Response,next:NextFunction){

    const number = req.body.number;
    const password = req.body.password;

    const user=await User.findOne({'number':number});
        if(user){
            try {
                const passwordsMatch = await bcrypt.compare(password,user.password);

                console.log(passwordsMatch)
                if(passwordsMatch){
                    res.json({signin:true,userId:user._id,msg:"Signed In Successfully"})
                }else{
                    res.json({signin:false,msg:"Incorrect Password"})
                }
    
            } catch (err) {
                console.error(err)
                return res.status(500).json({ error: 'Internal Server Error',err });
            }

        }else{
            res.json({msg:'User Not Found',bool:false})
        }
}

export async function getBalance(req : Request,res: Response,next:NextFunction){
    
    const userId=req.body.userId;
   
    try {
        const retrivedUser=await userBalance.findOne({'userId':userId});
        if(retrivedUser){
            res.json({
                data:retrivedUser.balance
            })
        }else{
            res.json({
                msg:"Service Error Occured, Please Try Again Later"
            })
        }
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Internal Server Error',err }); 
    }

}


export async function postRecharge(req : Request,res: Response,next:NextFunction){
    
    const voucher=req.body.voucher
    const amount=Number(req.body.amount);
    const userId=req.body.userId;
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Adding 1 to the month because it's zero-based (0-11)
    const currentDay = currentDate.getDate();
    const currentHour = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    
    const formattedDate = `${currentYear}-${currentMonth}-${currentDay}: ${currentHour}:${currentMinutes}`;
    
    try {
        const retrivedUser=await userBalance.findOne({'userId':userId});
        if(retrivedUser){
            retrivedUser.balance+=amount
            retrivedUser.balance_history.push({amount,detail:`${amount} was added on ${formattedDate}`})
            retrivedUser.save();
            res.json({
                msg:"Amount Was Successfully Added To Your Balance",bool:true,data:retrivedUser.balance
            })
        }else{
            res.json({
                msg:"Service Error Occured, Please Try Again Later", bool:false
            })
        }
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Internal Server Error',err }); 
    }

}

export async function postUserService(req : Request,res: Response,next:NextFunction){
    
    const title=req.body.title;
    const userId=req.body.userId;
    try {
        const retrievedPlan=await Service.findOne({'title':title});
        const retrivedUser=await userServices.findOne({'userId':userId});
        if(retrivedUser  && retrievedPlan){
            if(!retrivedUser.subscribedPlans.includes(title)){
                
                retrivedUser.subscribedPlans.push(title)
                retrivedUser.save()
                res.json({
                    msg:`You Successfully Subscribed To The ${title} Plan `
                })
            }else{
                res.json({
                    msg:`You Are Already Subscribed To The ${title} Plan `
                })
            }
        }else{
            res.json({
                msg:"Subscribing Failed, Please Try Again Later"
            })
        }
     
    } catch (err) {
     console.error(err)
     return res.status(500).json({ error: 'Internal Server Error',err });
    }
 
 };

 export async function deleteUserService(req : Request,res: Response,next:NextFunction){
    
    const title=req.body.title;
    const userId=req.body.userId;
    try {
        const retrievedPlan=await Service.findOne({'title':title});
        const retrivedUser=await userServices.findOne({'userId':userId});
        if(retrivedUser && retrievedPlan){
            retrivedUser.subscribedPlans=retrivedUser.subscribedPlans.filter((e)=>{return e!=title})
            retrivedUser.save()
            res.json({
                msg:`You Successfully Unsubscribed From ${title} Plan `
            })
        }else{
            res.json({
                msg:"Server error , Please try again Later"
            })
        }     
    } catch (err) {
     console.error(err)
     return res.status(500).json({ error: 'Internal Server Error',err });
    }
 
 };

 export async function getUserService(req : Request,res: Response,next:NextFunction){
    const userId=req.body.userId
    try {
        const retrievedUser=await userServices.findOne({'userId':userId});
        if(retrievedUser){
            res.json({
                msg:"Here Are All Your Subscribed Plans  ",
                plans:retrievedUser.subscribedPlans
            })
        }     
    } catch (err) {
     console.error(err)
     return res.status(500).json({ error: 'Internal Server Error',err });
    }
 
 }

 export async function getUserHistory(req : Request,res: Response,next:NextFunction){
    interface MyDocument {
        // Define all fields and their types here
        callHistory: {
          date: Date;
          duration: number;
        }[];
      
        msgHistory: {
          date: Date;
          content: string;
        }[];
      
        dataHistory: number[];
      
        internationalHistory: {
          date: Date;
          callDuration: number;
          location: string;
        }[];
        [key: string]: any;

        userId: mongoose.Types.ObjectId;
        additionalField: string;

      }
      
    const userId=req.body.userId;
    const type:string|null=req.body.type;
    try {
        if(type=="allDetails"){
            const retrievedUser:MyDocument|null=await userHistory.findOne({'userId':userId});
            if(retrievedUser){
                res.json({
                    msg:"Here Is Your History",
                    plans:retrievedUser
                })
            }else{
                res.json({
                    msg:"No History Was Found",
                })
            }     
        }else{

            const retrievedUser:MyDocument|null=await userHistory.findOne({'userId':userId});
            if(retrievedUser && type){
                res.json({
                    msg:"Here Is Your History",
                    plans:retrievedUser[type]
                })
            }     
        }
    } catch (err) {
     console.error(err)
     return res.status(500).json({ error: 'Internal Server Error',err });
    }
 
 }

 export async function renew(req : Request,res: Response,next:NextFunction){
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Adding 1 to the month because it's zero-based (0-11)
    const currentDay = currentDate.getDate();
    const currentHour = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    
    const formattedDate = `${currentYear}-${currentMonth}-${currentDay}: ${currentHour}:${currentMinutes}`;
    
    const userId=req.body.userId
    const title=req.body.title
    try {
        const retrievedUserBalance=await userBalance.findOne({'userId':userId});
        const retrievedPlan=await Service.findOne({"title":title})
        if(retrievedUserBalance&&retrievedPlan){
            retrievedUserBalance.balance=retrievedUserBalance.balance-retrievedPlan.price
            retrievedUserBalance.balance_history.push({detail:`${retrievedPlan.price} was removed on ${formattedDate}`})
            res.json({
              
            })
        }else{
            res.json({
              
            })
        }     
    } catch (err) {
     console.error(err)
     return res.status(500).json({ error: 'Internal Server Error',err });
    }
 
 }
