import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '@/components/InputField';
import SubmitButton from '@/components/SubmitButton';
import FormHeader from '@/components/FormHeader';
import SignLink from '@/components/SignLink';
import { backend_url } from '@/config';
const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
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
      const response = await axios.post(`${backend_url}/user/signup`, formData);
      localStorage.setItem("token", response.data.token);
      navigate("/menu");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <FormHeader />
      <InputField
        label="Full Name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter your full name"
      />
      <InputField
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
      />
      <InputField
        label="Phone Number"
        type="tel"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        placeholder="Enter your phone number"
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
        <SubmitButton onClick={handleSubmit} text="Sign Up" />
      </div>
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <SignLink text="Sign in here" link="/signin" />
      </p>
    </div>
  );
};

export default SignUp;
