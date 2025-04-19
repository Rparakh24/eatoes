import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import axios from 'axios';
const foodPalette = {
  primary: '#FF6B35', // warm orange
  secondary: '#FFD166', // soft yellow
  background: '#FFF8F0',
  text: '#2E2E2E',
  accent: '#06D6A0' // mint green
};

export default function AdminMenu() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    available: true,
  });
  const [items,setItems] = useState([]);

  const fetchItems = async() => {
    try{
      const response = await axios.get("http://localhost:3000/admin/get");
      setItems(response.data);
    }catch(e){
      console.log(e);
    }
  }
  useEffect(() => {
    fetchItems();
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleToggle = () => {
  //   setFormData({ ...formData, available: !formData.available });
  // };

  const handleSubmit = async() => {
    console.log(formData);
    try{
      const response = await axios.post("http://localhost:3000/admin/add",formData);
      console.log(response);
    }catch(e){
      console.log(e);
    }
  };
  const handleDelete = async(itemID:string) => {
    try{
      const response = await axios.put(`http://localhost:3000/admin/remove?itemId=${itemID}`,);
      console.log(response);
    }catch(e){
      console.log(e);
    }
    fetchItems();
  }
  return (
    <div className="min-h-screen bg-[${foodPalette.background}] p-6 text-[${foodPalette.text}]">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: foodPalette.primary }}>
          Add New Menu Item
        </h1>
        <div className="space-y-4 bg-white p-6 rounded-2xl shadow-md">
          <div>
            <Label>Name</Label>
            <Input className='mt-2' name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Paneer Butter Masala" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea className='mt-2' name="description" value={formData.description} onChange={handleChange} placeholder="e.g., Soft cubes of paneer..." />
          </div>
          <div>
            <Label>Price (₹)</Label>
            <Input className='mt-2'name="price" type="number" value={formData.price} onChange={handleChange} />
          </div>
          <div>
            <Label>Category</Label>
            <Input className='mt-2'name="category" value={formData.category} onChange={handleChange} placeholder="e.g., Main Course" />
          </div>
          <div>
            <Label>Image URL (optional)</Label>
            <Input className='mt-2'name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" />
          </div>
          {/* <div className="flex items-center justify-between">
            <Label>Available</Label>
            <Switch checked={formData.available} onCheckedChange={handleToggle} />
          </div> */}
          <Button onClick={handleSubmit} style={{ backgroundColor: foodPalette.primary, color: 'white' }}>
            Add Item
          </Button>
        </div>

        <h2 className="text-2xl font-semibold mt-10 mb-4" style={{ color: foodPalette.secondary }}>
          Preview
        </h2>
        {items.map((item:any) => (
          <Card key={item.id} className="mb-4 bg-white rounded-xl shadow p-4">
            <CardContent>
              <h3 className="text-xl font-bold mb-1">{item.name || 'Menu Item Name'}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.category || 'Category'}</p>
              <p className="mb-2">{item.description || 'Item description will appear here.'}</p>
              <p className="font-semibold">₹ {item.price || '0.00'}</p>
              {/* {item.imageUrl && (
                <img src={item.imageUrl} alt="item preview" className="mt-4 rounded-md w-full h-48 object-cover" />
              )} */}
              <p className={`mt-2 font-medium ${item.isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                {item.isAvailable ? 'Available' : 'Not Available'}
              </p>
              <button onClick={() => handleDelete(item._id)} className="mt-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
                Remove
              </button>
            </CardContent>
          </Card>
        ))}

      </div>
    </div>
  );
} 
