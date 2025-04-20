import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InputField from '@/components/InputField';
import SubmitButton from '@/components/SubmitButton';

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
          <InputField
            name="name"
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />    
          <InputField
            name="phone"
            label="Phone Number"
            value={phone}
            type="tel"
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
          />
          <InputField
            name="address"
            label="Address" 
            value={address}
            type="text"
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
          />
        </div>


        <div className="flex justify-between items-center text-lg font-semibold pt-4 border-t">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
        <SubmitButton onClick={placeOrder} text="Place Order"/>
      </div>
    </div>
  );
};

export default Checkout;
