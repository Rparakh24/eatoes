import express, {Request, Response} from "express";
import jwt from "jsonwebtoken";
import { signupVal, signinVal } from '../lib/validator/userValidator';
import { prisma } from '../config/postgres';
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";
// Health check route
router.post("/signup",async(req:Request,res:Response):Promise<any>=>{
  const userBody = req.body;
  const success = signupVal.safeParse(userBody);
  if(!success.success){
      return res.status(403).json({"msg":"Wrong format"});
  }
  try{
      const user  = await prisma.user.create({
          data:userBody}
      );
      const token = jwt.sign({id:user.id}, JWT_SECRET);
      res.status(200).json({token:token});
  
  }catch(e){
      return res.status(403).json({msg:"User already exist"});
  }
  
})
router.post("/signin",async(req:Request,res:Response):Promise<any>=>{
  const signinBody = req.body;
  const success = signinVal.safeParse(signinBody);
  if(!success.success){
      return res.status(403).json({msg:"Invalid Input"})
  }
  try{
      const user = await prisma.user.findFirst({
          where:{
              email:signinBody.email,
              password:signinBody.password
          }
      })
      if(!user){
          return res.status(401).json({msg:"User does not exist"});
      }
      const token = jwt.sign({id:user.id},JWT_SECRET);
      res.status(200).json({msg:"Signin Success",token:token});
  }catch(e){
      
  }
})




export default router; 