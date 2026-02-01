import React, { useState } from 'react';
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Navigate, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { BASE_URL } from "@/const";



const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const { toast } = useToast();

 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const togglePassword = () => setShowPassword(!showPassword);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      username,
      email,
      password,
    });
    const data = response.data;

    if (response.status >= 200 && response.status < 300) {
      toast({
        title: "Account created 🎉",
        description: "You can now log in with your credentials",
         duration: 3000,
      });

      setEmail("");
      setUserName("");
      setPassword("");

      setTimeout(() => {
        navigate("/Login");
      }, 800);
    }
  } catch (err) {
    const message =
      axios.isAxiosError(err)
        ? err.response?.data?.message || "Please try again"
        : "Please try again";
    toast({
      variant: "destructive",
      title: "Registration failed",
      description: message,
    });
  } finally {
    setLoading(false);
  }
};




  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-cream-dark to-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-3xl border border-border bg-white/90 shadow-card backdrop-blur">
        <div className="px-8 py-12 sm:px-12">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Drygo Portal
            </p>
            <h2 className="mt-4 text-[28px] font-semibold text-foreground">
              Create account
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Set up access for your team in minutes.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 pr-12"
                />
                <Button
                  asChild
                  variant="icon"
                  size="icon"
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              variant="default"
              size="lg"
              disabled={loading}
              className="w-full rounded-xl mt-8"
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
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/Login")}
              className="font-semibold text-primary hover:text-primary/80"
            >
              Sign in here
            </button>
          </div>
        </div>

        <div className="border-t border-border px-8 py-6 text-center text-xs text-muted-foreground sm:px-12">
          By registering, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
};

export default Register;