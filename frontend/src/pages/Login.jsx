import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import httpRequest from "../httpRequest";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const Login = () => {
  const [loading, setloading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const { data } = await httpRequest.post("/auth/login", user);
      // console.log(data);
      let expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      Cookies.set("token", `bearer ${data.token}`, { expires: expirationDate });
      toast.success("Login successfully");
      toast.success(
        `Welcome ${data.profile.sex == "M" ? "Mr" : "Mrs"} ${
          data.profile.username
        } 👋`
      );
      navigate("/");
    } catch (err) {
      toast.error(err.response.data.error);
    } finally {
      setloading(false);
    }
  };
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Get started today!</h1>

        <p className="mt-4 text-gray-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Et libero
          nulla eaque error neque ipsa culpa autem, at itaque nostrum!
        </p>
      </div>

      <form
        className="mx-auto mb-0 mt-8 max-w-md space-y-4"
        onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            type="email"
            autoFocus
            id="email"
            value={user.email}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, email: e.target.value }))
            }
            autoComplete="on"
            required
            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-md shadow-black/20"
            placeholder="Enter email"
          />
        </div>

        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="on"
              value={user.password}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, password: e.target.value }))
              }
              required
              id="password"
              className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-md shadow-black/20"
              placeholder="Enter password"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 end-0 grid place-content-center px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`size-4 text-${showPassword ? "black" : "gray-400"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 space-x-2">
            <span>No account?</span>
            <Link className="underline" to="/register">
              Register
            </Link>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white">
            {loading ? "Loading..." : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
