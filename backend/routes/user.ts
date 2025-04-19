import express, {Request, Response} from "express";
import jwt from "jsonwebtoken";
import { signupVal, signinVal } from '../lib/validator/userValidator';
import { prisma } from '../config/postgres';
import { Item } from "../config/db";
import { CartItem } from "../types/CartItem";
import { cartItemSchema } from "../lib/validator/itemValidator";
import { orderUserSchema } from "../lib/validator/userValidator";
import auth from "../middleware/uAuth";
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "";

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
      return res.status(403).json({msg:"Invalid Input"});
  }
})

router.get("/menu",auth,async(req,res)=>{
    const menu : any = {};
    const filter = req.query.filter || "";
    console.log(filter);
    const items = await Item.find(
        {  
            name:{
                "$regex":filter, "$options":"i"
            }
                
        },
    )
    items.forEach((item)=>{
        if(!menu[item.category as string]){
            menu[item.category] = [];
        }
        menu[item.category].push(item);

    })
    res.status(200).json(menu);
})

router.post("/cart", auth, async (req:Request,res:Response):Promise<any> => {
    // const items = req.body; 
    // const success = cartItemSchema.safeParse(items);
    // if(!success.success){
    //     return res.status(403).json({msg:"Invalid Input"});
    // }

    // const userId = req.userId;
  
    // const user = await prisma.user.findUnique({
    //   where: { id: userId }
    // });
  
    // let cart = user?.cart as unknown as CartItem[] || [];
  
    // for (const { itemId, quantity } of items) {
    //   const existingItem = cart.find((item) => item.itemId === itemId);
    //   if (existingItem) {
    //     existingItem.quantity += quantity;
    //   } else {
    //     cart.push({ itemId, quantity });
    //   }
    // }
    // try{
    // const updatedUser = await prisma.user.update({
    //   where: { id: userId },
    //   data: {
    //     cart: cart.map(item => ({ ...item }))
    //   }
    // });
  
    // res.status(200).json({ msg: "Cart updated", cart: updatedUser.cart });

    const {itemId,quantity} = req.body;
    const userId = req.userId;
    try{
    const user = await prisma.user.findUnique({
      where:{
        id:userId
      }
    })
    if(!user){
      return res.status(403).json({msg:"User not found"});
    }
    const cart = user.cart as unknown as CartItem[];
    const existingItem = cart.find((item)=>item.itemId === itemId);
    if(existingItem){
      existingItem.quantity += quantity;
    }
    else{
      cart.push({itemId,quantity});
    }
    const updatedUser = await prisma.user.update({
      where:{id:userId},
      data:{cart: cart as unknown as any[]}
    })  
    res.status(200).json({msg:"Cart updated",cart:updatedUser.cart});
  }catch(e){
    return res.status(403).json({msg:"Invalid Input"});
  }
})
router.get("/cart", auth, async (req:Request,res:Response):Promise<any> => {
    const userId = req.userId;
    // const success = orderUserSchema.safeParse(userId);
    // if(!success.success){
    //     return res.status(403).json({msg:"Invalid Input"});
    // }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { cart: true }
    });
    const cart = (user?.cart as unknown as CartItem[]) || [];
    let totalCartPrice = 0;
    const enrichedCart = await Promise.all(
      cart.map(async ({ itemId, quantity }) => {
        if(quantity!=0){
        const itemData = await Item.findById(itemId);
        if (!itemData) return null; // Optional: filter out missing items
        const itemTotal = itemData.price * quantity;
        totalCartPrice += itemTotal;
        return {
          userId,
          itemId,
          name: itemData.name,
          price: itemData.price,
          quantity,
          itemTotal,
        };
        }
      })
    );
  
    const filteredCart = enrichedCart.filter(Boolean); // remove nulls if any
    console.log(filteredCart);
    res.status(200).json({ cart: filteredCart,totalCartPrice:totalCartPrice });
  });
  

router.post("/order",auth,async (req:Request,res:Response):Promise<any> => {
    const userId = req.userId;
    try{
    const user = await prisma.user.findUnique({
        where:{
            id:userId
        },
        select:{
            cart:true
        }
    })

    const cart = user?.cart as unknown as CartItem[];
    let orderTotal = 0;
    const finalCart = await Promise.all(
        cart.map(async(item)=>{
            const itemData = await Item.findById(item.itemId);
            let itemTotal = 0;
            if(itemData){
                itemTotal = itemData.price * item.quantity;
                orderTotal += itemTotal;
            }
            return {
                itemId:item.itemId,
                quantity:item.quantity,
                name:itemData?.name,
                price:itemData?.price,
                itemTotal:itemTotal
            }
        })
    )
    
    const order = await prisma.order.create({
            data: {
                userId: userId || 0,
                totalPrice: orderTotal,
                items: finalCart
              }
        
    })
    const updateUser = await prisma.user.update({
      where:{
        id:userId
      },
      data:{
        cart:[]
      } 
    })
    res.status(200).json({msg:"Order created successfully",order:order});
    }catch(e){
        return res.status(403).json({msg:"Invalid Input"});
    }
})

router.get("/allorder",auth,async(req:Request,res:Response):Promise<any> => {
  const userId = req.userId;
  try{
    const user = await prisma.user.findUnique({
      where:{
        id:userId
      },
      select:{
        orders:true
      }
    })
    res.status(200).json({orders:user?.orders});
  }catch(e){
    return res.status(403).json({msg:"Invalid Input"});
  }
})
export default router; 