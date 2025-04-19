import mongoose from "mongoose";
const { Schema } = mongoose;

mongoose.connect(process.env.MONGODB_URI || "");

const MenuItemSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, 
  price: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String },
  isAvailable: { type: Boolean, default: true }
}, {
  timestamps: true
});
const Item = mongoose.model("Item", MenuItemSchema);

export { Item };