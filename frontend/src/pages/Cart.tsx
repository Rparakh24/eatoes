import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  itemTotal: number;
}

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:3000/user/cart", {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      setCart(res.data.cart);
      calculateTotal(res.data.cart);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  const calculateTotal = (items: CartItem[]) => {
    const totalPrice = items.reduce((acc, item) => acc + item.itemTotal, 0);
    setTotal(totalPrice);
  };

  const updateCart = async (itemId: string, change: number) => {
    try {
      await axios.post(
        "http://localhost:3000/user/cart",
        { itemId, quantity: change }, // we're sending +1 or -1
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      fetchCart(); // refresh cart after update
    } catch (err) {
      console.error("Failed to update cart:", err);
    }
  };

  

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Cart</h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div key={item.itemId} className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                <p className="text-gray-600">₹{item.price} x {item.quantity}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="bg-gray-300 text-white px-3 py-1 rounded"
                  onClick={() => updateCart(item.itemId, -1)}
                >
                  -
                </button>
                <span className="text-lg">{item.quantity}</span>
                <button
                  className="bg-[#FF5722] text-white px-3 py-1 rounded"
                  onClick={() => updateCart(item.itemId, 1)}
                >
                  +
                </button>
              </div>
              <div className="text-gray-800 font-medium">₹{item.itemTotal}</div>
            </div>
          ))}

          <div className="flex justify-between items-center text-xl font-semibold mt-6">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <div className="flex justify-center">
            <button
              onClick={()=>navigate("/checkout")}
              className="mt-4 bg-[#FF5722] hover:bg-[#FF7043] text-white px-8 py-3 rounded-lg transition duration-200"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
