import SubmitButton from '@/components/SubmitButton';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuantityButton from '@/components/QuantityButton';
import Text from '@/components/Text';
import { useCartStore } from '@/store/cartStore';
interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

const Menu = () => {
  const [search, setSearch] = useState('');
  const cart = useCartStore((state) => state.cart);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const updateItem = useCartStore((state) => state.updateItem);

const handleAdd = (item: MenuItem) => {
  updateItem(item._id, 1);
};

const handleDecrease = (item: MenuItem) => {
  updateItem(item._id, -1);
};

const getQuantity = (itemId: string) => {
  const cartItem = cart.find((item) => item.itemId === itemId);
  return cartItem ? cartItem.quantity : 0;
};
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<{ [category: string]: MenuItem[] }>({});
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchCart();
        const response = await axios.get(`http://localhost:3000/user/menu?filter=${search}`, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
  
        setMenuItems(response.data);
      } catch (e) {
        console.log(e);
      }
    };
  
    fetchData();
  }, [search]);
  

  const handleCart = () => {
    navigate('/cart');
  };

  return (
    <div className="max-w-screen-lg mx-auto p-6">
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search for items..."
          value={search}
          onChange={handleSearchChange}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Menu</h1>
      {Object.keys(menuItems).length === 0 ? (
        <p>No menu items available. Please try again later.</p>
      ) : (
        Object.entries(menuItems).map(([category, items]) => (
          <div key={category} className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item: MenuItem) => (
                <div key={item._id} className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                  <Text text={item.description} />
                  <Text text={`₹${item.price}`} />
                  <div className="flex items-center space-x-4 mb-4">
                    <QuantityButton text="-" onClick={() => handleDecrease(item)} />
                    <span className="text-xl">{getQuantity(item._id) || 0}</span>
                    <QuantityButton text="+" onClick={() => handleAdd(item)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <div className="mt-8 max-w-lg mx-auto flex justify-center">
        <SubmitButton text="Proceed to Checkout" onClick={handleCart} />
      </div>
    </div>
  );
};

export default Menu;
