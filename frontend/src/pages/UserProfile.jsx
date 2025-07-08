import React from "react";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const { user } = useSelector((state) => state.user);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">
          No user data found. Please log in.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-teal-600 mb-6">User Profile</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
          <div>
            <p className="text-sm font-semibold">Full Name</p>
            <p className="text-base">{user.name}</p>
          </div>

          <div>
            <p className="text-sm font-semibold">Email</p>
            <p className="text-base">{user.email}</p>
          </div>

          <div>
            <p className="text-sm font-semibold">Phone</p>
            <p className="text-base">{user.phone || "Not provided"}</p>
          </div>

          <div>
            <p className="text-sm font-semibold">Address</p>
            <p className="text-base">{user.address || "Not provided"}</p>
          </div>

          <div>
            <p className="text-sm font-semibold">Role</p>
            <p className="text-base capitalize">{user.role}</p>
          </div>

          <div>
            <p className="text-sm font-semibold">User ID</p>
            <p className="text-base text-gray-500">{user.id || user._id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
