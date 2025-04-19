import express from "express";
import { Item } from "../config/db";
const router = express.Router();

router.post("/add", async (req, res) => {
  const item = req.body;
  const newItem = await Item.insertMany(item);
  res.status(201).json(newItem);
});
router.get("/get",async(req,res)=>{
  const items = await Item.find();
  res.status(200).json(items);
})
router.put("/remove",async(req,res)=>{
  const itemId = req.query.itemId;
  const deletedItem = await Item.findByIdAndDelete(itemId);
  res.status(200).json({msg:"Item deleted",deletedItem});
})
export default router;