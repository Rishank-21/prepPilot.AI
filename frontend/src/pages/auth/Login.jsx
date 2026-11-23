import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../contexts/userContext";
import toast from "react-hot-toast";
import SpinnerLoader from "../../components/loader/SpinnerLoader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { updateUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("please enter the password");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token, user } = response.data;
      if (token) {
        updateUser({ token, user });
        navigate("/dashboard");
        toast.success(`Welcome Back ${user.fullName}`);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-7 flex flex-col justify-center">
      <h1 className="text-lg font-semibold text-black">Welcome back</h1>
      <p className="text-xs text-slate-700 mt-[15px] mb-6">
        Please enter your details to log in
      </p>
      <form action="" onSubmit={handleLogin}>
        <Input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
          label="Email address"
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min 8 characters"
          label="Password"
        />

        {error && <p role="alert" className="text-red-700 text-xs pb-2.5">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <SpinnerLoader /> : "LOGIN"}
        </button>
        <p className="text-[13px] text-slate-800 mt-3">
          Don't have an account?{" "}
          <button
            type="button"
            className="font-medium text-primary underline cursor-pointer"
            onClick={() => {
              navigate("/signup");
            }}
          >
            SignUp
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
