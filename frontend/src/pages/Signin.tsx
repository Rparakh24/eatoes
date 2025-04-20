import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import SubmitButton from '../components/SubmitButton';
import SignLink from '../components/SignLink';
import { backend_url } from '@/config';
const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backend_url}/user/signin`, formData);
      const token = response.data.token;
      localStorage.setItem("token", token);
      navigate("/menu");
    } catch (e) {
      console.error("SignIn failed:", e);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Sign In</h2>
      <form onSubmit={handleSubmit}>
        <InputField
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />

        <InputField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />

        <div className="mb-6">
          <SubmitButton text="Sign In" onClick={handleSubmit} />
        </div>
      </form>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <SignLink text="Sign up here" link="/" />
      </p>
    </div>
  );
};

export default Signin;
