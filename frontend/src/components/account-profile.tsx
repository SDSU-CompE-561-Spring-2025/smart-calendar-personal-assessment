import { useState } from 'react';

export default function AccountProfile() {
  const [formData, setFormData] = useState({
    name: '',
    birthday: '',
    email: '',
    password: ''
  });

  const handleUpdateProfile = () => {
    // Handle profile update logic here
    console.log('Profile updated with:', formData);
  };

  return (
    <div className="w-full">
      <div className="overflow-hidden">
        {/* Content */}
        <div className=" p-8">
          <div className="flex flex-col items-center">
            {/* Profile Image */}
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-blue-300 border-4 border-gray-200 overflow-hidden flex items-center justify-center">
                <img src="/api/placeholder/100/100" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Form Fields */}
            <div className="w-full max-w-md">
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-1/2 px-3">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full border-b-2 border-gray-400 bg-transparent pb-1 focus:outline-none focus:border-teal-500"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="w-1/2 px-3">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Birthday</label>
                  <input
                    type="text"
                    className="w-full border-b-2 border-gray-400 bg-transparent pb-1 focus:outline-none focus:border-teal-500"
                    value={formData.birthday}
                    onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border-b-2 border-gray-400 bg-transparent pb-1 focus:outline-none focus:border-teal-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                <input
                  type="password"
                  className="w-full border-b-2 border-gray-400 bg-transparent pb-1 focus:outline-none focus:border-teal-500"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={handleUpdateProfile}
                  className="bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600 transition-colors"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}