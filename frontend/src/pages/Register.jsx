import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import httpRequest from "../httpRequest";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    bio: "",
    nickname: "",
    age: "",
    sex: "M",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const { data } = await httpRequest.post("/auth/register", {
        username: `${user.firstname} ${user.lastname}`,
        nickname: user.nickname,
        email: user.email,
        bio: user.bio,
        password: user.password,
        sex: user.sex,
        age: user.age,
      });
      // console.log(data);
      let expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      Cookies.set("token", `bearer ${data.token}`, { expires: expirationDate });
      toast.success("Register successfully");
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstname" className="sr-only">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              autoFocus
              value={user.firstname}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, firstname: e.target.value }))
              }
              autoComplete="given-name"
              required
              className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-md shadow-black/20"
              placeholder="First Name"
            />
          </div>
          <div>
            <label htmlFor="lastname" className="sr-only">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              value={user.lastname}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, lastname: e.target.value }))
              }
              autoComplete="family-name"
              required
              className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-md shadow-black/20"
              placeholder="Last Name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="nickname" className="sr-only">
            Nickname
          </label>
          <input
            type="text"
            id="nickname"
            value={user.nickname}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, nickname: e.target.value }))
            }
            autoComplete="nickname"
            required
            className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-md shadow-black/20"
            placeholder="Nickname"
          />
        </div>

        <div>
          <label htmlFor="bio" className="sr-only">
            bio
          </label>
          <textarea
            type="text"
            id="bio"
            value={user.bio}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, bio: e.target.value }))
            }
            autoComplete="bio"
            className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-md shadow-black/20 no-scroller"
            placeholder="Bio"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="age" className="sr-only">
              Age
            </label>
            <input
              type="number"
              id="age"
              value={user.age}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, age: e.target.value }))
              }
              autoComplete="age"
              required
              className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-md shadow-black/20"
              placeholder="Age"
            />
          </div>
          <div>
            <label htmlFor="sex" className="sr-only">
              Sex
            </label>
            <select
              id="sex"
              value={user.sex}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, sex: e.target.value }))
              }
              required
              className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-md shadow-black/20">
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={user.email}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, email: e.target.value }))
            }
            autoComplete="email"
            required
            className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-md shadow-black/20"
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
              autoComplete="new-password"
              value={user.password}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, password: e.target.value }))
              }
              required
              id="password"
              className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-md shadow-black/20"
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
            <span>Already have an account?</span>
            <Link className="underline" to="/login">
              Login
            </Link>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white">
            {loading ? "Loading..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
