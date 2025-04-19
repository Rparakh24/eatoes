import { useEffect, useState } from "react";
import axios from "axios";
import ConfirmationCard from "@/components/ConfirmationCard";

interface Order {
  id: string;
  totalPrice: number;
  createdAt: string;
  items: {
    name: string;
    price: number;
    quantity: number;
  }[];
}

const Confirmation = () => {
  const [history, setHistory] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (history) {
      getHistory();
    }
  }, [history]);

  const getHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/user/allorder`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      setOrders(res.data.orders);
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ConfirmationCard onClick={() => setHistory(true)} />

      {history && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center text-gray-800">Order History</h2>

          {orders.length === 0 ? (
            <p className="text-center text-gray-500">No past orders found.</p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="mb-4 bg-white shadow-md rounded-lg p-6 border border-gray-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700">Order Total: ₹{order.totalPrice}</h3>
                    <p className="text-sm text-gray-500">
                      Ordered on: {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-sm font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    Delivered
                  </span>
                </div>

                <div className="border-t pt-4 space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-gray-600">
                      <span>{item.name}</span>
                      <span>
                        ₹{item.price} × {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Confirmation;
