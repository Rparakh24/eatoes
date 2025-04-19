import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:3000/user/signin", formData);
      console.log(response);
      const token = response.data.token;
      localStorage.setItem("token", token);
      navigate("/menu");
    } catch (e) {
      console.log("SignIn failed:", e);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Sign In</h2>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5722] focus:border-[#FF5722] transition duration-200"
          placeholder="Enter your email"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5722] focus:border-[#FF5722] transition duration-200"
          placeholder="Enter your password"
          required
        />
      </div>
      <div className="mb-6">
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-[#FF5722] text-white py-3 rounded-lg hover:bg-[#FF7043] focus:outline-none focus:ring-4 focus:ring-[#FF5722] transition duration-200"
        >
          Sign In
        </button>
      </div>
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <a href="/signup" className="text-[#FF5722] hover:text-[#FF7043]">
          Sign up here
        </a>
      </p>
    </div>
  );
};

export default Signin;
