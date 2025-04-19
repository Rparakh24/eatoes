import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const [total, setTotal] = useState<number>(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get('http://localhost:3000/user/cart', {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      setTotal(res.data.totalCartPrice);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  };

  const placeOrder = async () => {
    if (!name || !phone || !address) {
      alert("Please enter your name, phone number and address.");
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:3000/user/order',
        {},
        {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        }
      );
      navigate("/confirm");
      console.log(res.data);
    } catch (err) {
      console.error('Failed to place order:', err);
      alert('Failed to place order.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Checkout</h1>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
            <label className="block font-medium text-gray-700 mb-1">Address</label>
            <input
            type="tel"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Enter your address"
            />          
          </div>

        <div className="flex justify-between items-center text-lg font-semibold pt-4 border-t">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button
          onClick={placeOrder}
          className="w-full mt-4 bg-[#FF5722] hover:bg-[#FF7043] text-white px-6 py-3 rounded-lg transition duration-200"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
