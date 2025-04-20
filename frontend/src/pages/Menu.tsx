import SubmitButton from '@/components/SubmitButton';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuantityButton from '@/components/QuantityButton';
import Text from '@/components/Text';
interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

interface Cart {
  [key: string]: number;
}

const Menu = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<{ [category: string]: MenuItem[] }>({});
  const [cart, setCart] = useState<Cart>({});

  const handleAdd = async (item: MenuItem) => {
    setCart((prevCart) => {
      const updatedQuantity = (prevCart[item._id] || 0) + 1;
      // Make the API request using the updated quantity
      axios
        .post(
          'http://localhost:3000/user/cart',
          { itemId: item._id, quantity: updatedQuantity },
          {
            headers: {
              Authorization: `${localStorage.getItem('token')}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });

      return { ...prevCart, [item._id]: updatedQuantity };
    });
  };

  const handleDecrease = async (item: MenuItem) => {
    setCart((prevCart) => {
      const updatedQuantity = (prevCart[item._id] || 0) - 1;
      if (updatedQuantity >= 0) {
        // Make the API request using the updated quantity
        axios
          .post(
            'http://localhost:3000/user/cart',
            { itemId: item._id, quantity: updatedQuantity },
            {
              headers: {
                Authorization: `${localStorage.getItem('token')}`,
              },
            }
          )
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.error(error);
          });

        return { ...prevCart, [item._id]: updatedQuantity };
      }
      return prevCart;
    });
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user/menu', {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        });

        // Set the menu items with categories as keys
        setMenuItems(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchMenuItems();
  }, []);

  const handleCart = () => {
    navigate('/cart');
  };

  return (
    <div className="max-w-screen-lg mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Menu</h1>

      {/* Iterate over categories and their respective items */}
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
                    <span className="text-xl">{cart[item._id] || 0}</span>
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
