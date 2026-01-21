import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Navigate, useNavigate } from 'react-router-dom';


const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log(data);
        setEmail("");
        setUserName("");
        setPassword("");
        alert("Registered successfully!");
       
        navigate('/Login')
      } else {
        setError(data.message || "Registration failed");
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Register failed ", error);
      setError("Network error. Please try again.");
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
<div className="max-w-md w-full bg-white rounded-2xl shadow-xl px-[50px] py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600">Sign up to get started</p>
        </div>

        <form  className="space-y-6 w-full mx-auto" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded w-[90%] mx-auto">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-2 flex flex-col items-center">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-[90%] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
            />
          </div>

          <div className="space-y-2 flex flex-col items-center">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-[90%] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
            />
          </div>

          <div className="space-y-2 flex flex-col items-center">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative w-[90%]">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 pr-12"
              />
           <Button
  asChild
  variant="icon"
  size="icon"
  type="button"
  onClick={togglePassword}
  style={{ marginTop: "15px" }}
  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
>
  {showPassword ? (
    <EyeOff className="h-5 w-5" />
  ) : (
    <Eye className="h-5 w-5" />
  )}
</Button>

            </div>
          </div>

         <div className="flex justify-center">
          <Button
            type="submit"
            variant="default"
            size="lg"
            disabled={loading}
            className="w-[90%]"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating account...
              </span>
            ) : (
              "Register"
            )}
          </Button>
        </div>

        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              style={{color:"blue"}}
              onClick={()=>navigate("/Login")}
              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition duration-200"
            >
              Sign in here
            </button>
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            By registering, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;