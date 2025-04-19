import { CartItem } from "../../types/CartItem";

export interface Order{
    userId:number;
    totalPrice:number;
    items:CartItem[];
}