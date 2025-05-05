import { useState } from 'react';

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: '',
    birthday: '',
    email: '',
    password: '',
    retypePassword: ''
  });

  const handleCreateUser = () => {
    // Handle user creation logic here
    console.log('User created with:', formData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="flex justify-center mb-6">
        <h2 className="text-2xl font-medium text-teal-500">Calendar <span className="text-pink-500">+</span></h2>
      </div>

      <div className="w-full max-w-md mx-auto">
        {/* Name and Birthday */}
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-1/2 px-3">
            <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
            <input
              type="text"
              className="w-full border-b-2 border-gray-400 pb-1 focus:outline-none focus:border-teal-500"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="w-1/2 px-3">
            <label className="block text-sm font-medium text-gray-600 mb-1">Birthday</label>
            <input
              type="text"
              className="w-full border-b-2 border-gray-400 pb-1 focus:outline-none focus:border-teal-500"
              placeholder="11/11/1990"
              value={formData.birthday}
              onChange={(e) => setFormData({...formData, birthday: e.target.value})}
            />
          </div>
        </div>
        
        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
          <input
            type="email"
            className="w-full border-b-2 border-gray-400 pb-1 focus:outline-none focus:border-teal-500"
            placeholder="john123@gmail.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        
        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
          <input
            type="password"
            className="w-full border-b-2 border-gray-400 pb-1 focus:outline-none focus:border-teal-500"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>
        
        {/* Retype Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">Retype Password</label>
          <input
            type="password"
            className="w-full border-b-2 border-gray-400 pb-1 focus:outline-none focus:border-teal-500"
            placeholder="••••••••"
            value={formData.retypePassword}
            onChange={(e) => setFormData({...formData, retypePassword: e.target.value})}
          />
        </div>
        
        {/* Create User Button */}
        <div className="flex justify-center">
          <button
            onClick={handleCreateUser}
            className="bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600 transition-colors"
          >
            Create User
          </button>
        </div>
      </div>
    </div>
  );
}