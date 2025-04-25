import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Text from '@/components/Text';
import QuantityButton from '@/components/QuantityButton';
import SubmitButton from '@/components/SubmitButton';
import { useCartStore } from '@/store/cartStore';
import { backend_url } from '@/config';

interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  itemTotal: number;
}
// interface MenuItem {
//   _id: string;
//   name: string;
//   price: number;
//   description: string;
//   imageUrl: string;
// }

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [localQuantities, setLocalQuantities] = useState<{ [itemId: string]: number }>({});

  const updateItem = useCartStore((state) => state.updateItem);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${backend_url}/user/cart`, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      const cartData = res.data.cart;
      setCart(cartData);
      const localMap: { [id: string]: number } = {};
      cartData.forEach((item: CartItem) => {
        localMap[item.itemId] = item.quantity;
      });
      setLocalQuantities(localMap);
      calculateTotal(localMap, cartData);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  };

  const calculateTotal = (quantities: { [id: string]: number }, items: CartItem[]) => {
    const totalPrice = items.reduce((acc, item) => {
      const qty = quantities[item.itemId] ?? item.quantity;
      return acc + item.price * qty;
    }, 0);
    setTotal(totalPrice);
  };

  const updateCart = async (itemId: string, change: number) => {
    const currentQty = localQuantities[itemId] ?? cart.find(item => item.itemId === itemId)?.quantity ?? 0;
    const newQty = Math.max(currentQty + change, 0);
    setLocalQuantities(prev => ({ ...prev, [itemId]: newQty }));
    calculateTotal({ ...localQuantities, [itemId]: newQty }, cart);

    try {
      await axios.post(
        `${backend_url}/user/cart`,
        { itemId, quantity: change },
        {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        }
      );
      fetchCart();
    } catch (err) {
      console.error('Failed to update cart:', err);
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
          {cart.map((item) => {
            const quantity = localQuantities[item.itemId] ?? item.quantity;
            const itemTotal = item.price * quantity;

            return (
              <div key={item.itemId} className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                  <Text text={`₹${item.price} x ${quantity}`} />
                </div>
                <div className="flex items-center gap-3">
                  <QuantityButton text="-" onClick={() => updateCart(item.itemId, -1)} />
                  <span className="text-lg">{quantity}</span>
                  <QuantityButton text="+" onClick={() => updateCart(item.itemId, 1)} />
                </div>
                <div className="text-gray-800 font-medium">₹{itemTotal}</div>
              </div>
            );
          })}

          <div className="flex justify-between items-center text-xl font-semibold mt-6">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <div className="flex justify-center max-w-lg mx-auto">
            <SubmitButton onClick={() => navigate('/checkout')} text="Place Order" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
