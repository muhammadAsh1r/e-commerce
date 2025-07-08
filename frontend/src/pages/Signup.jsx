import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FlashMessage from "../components/FlashMessage";
import { signupUser, clearMessages } from "../features/user/userSlice";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [shouldRedirect, setShouldRedirect] = useState(false); // NEW

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    address: "",
    phone: "",
  });

  const { loading, error, successMessage } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      dispatch(clearMessages());
      return;
    }

    const { confirmPassword, ...payload } = formData;
    dispatch(signupUser(payload)).then((res) => {
      if (!res.error) {
        setShouldRedirect(true);
      }
    });
  };

  useEffect(() => {
    if (shouldRedirect && successMessage) {
      const timer = setTimeout(() => {
        navigate("/login");
        dispatch(clearMessages());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [shouldRedirect, successMessage, navigate, dispatch]);

  return (
    <>
      <FlashMessage
        type={error ? "error" : successMessage ? "success" : ""}
        message={error || successMessage || ""}
        onClose={() => dispatch(clearMessages())}
      />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-extrabold text-teal-500">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <a
              href="/login"
              className="text-teal-500 hover:text-teal-600 font-medium"
            >
              sign in to your existing account
            </a>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />

              <input
                type="email"
                name="email"
                required
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />

              <input
                type="password"
                name="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />

              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />

              <input
                type="text"
                name="phone"
                required
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />

              <input
                type="text"
                name="address"
                required
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 rounded-md text-white bg-teal-500 hover:bg-teal-600
                  focus:ring-2 focus:ring-offset-2 focus:ring-teal-400
                  ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
