import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AuthPage = ({ isSignUp }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const url = `http://localhost:3000/users/${isSignUp ? "" : "login"}`;
      const { data } = await axios.post(url, formData);

      localStorage.setItem("user", JSON.stringify(data));
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-gray-200">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4 text-white">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>
        {error && <p className="text-red-400 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <p className="text-center mt-4">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link to={isSignUp ? "/signin" : "/signup"} className="text-blue-400 hover:underline">
            {isSignUp ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
