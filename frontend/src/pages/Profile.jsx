import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import httpRequest from "../httpRequest";
import { toast } from "react-toastify";

const Profile = () => {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data } = await httpRequest.post(
        "/auth/login",
        {},
        {
          headers: {
            authorization: token,
          },
        }
      );
      setData(data.profile);
    } catch (err) {
      setIsError(true);
      toast.error(err.response.data.error);
      Cookies.remove("token");
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchData();
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    toast.info("Logout completed");
    navigate("/login");
  };

  const deleteAccount = async () => {
    try {
      await httpRequest.delete(
        `/auth/update/${data._id}`,
        {
          headers: {
            authorization: token,
          },
        }
      );
      Cookies.remove("token");
      toast.success("Account deleted successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response.data.error);
    }
  };
  if (isError)
    return (
      <h3 className="grid place-items-center h-screen w-screen text-4xl font-bold">
        Error | 500
      </h3>
    );
  return (
    <>
      {isLoading && (
        <h3 className="grid place-items-center h-screen w-screen text-4xl font-bold">
          Loading...
        </h3>
      )}
      {data && (
        <section className="flex flex-col p-8">
          <div className="flex gap-5">
            <img
              src={data.profileImage}
              alt={`${data.username}'s profile`}
              className="w-32 h-32 rounded-full mb-4 border-2 border-black"
            />
            <div>
              <h1 className="text-xl font-semibold">{data.username}</h1>
              <h2 className="text-lg text-gray-600">@{data.nickname}</h2>
            </div>
          </div>
          <div className="space-y-2">
            <p className="mt-4">
              <strong>Email:</strong> {data.email}
            </p>
            <p>
              <strong>Age:</strong> {data.age}
            </p>
            <p>
              <strong>Bio:</strong> {data.bio}
            </p>
            <p>
              <strong>Sex:</strong> {data.sex}
            </p>
            <p>
              <strong>Account Created At:</strong>{" "}
              {new Date(data.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-5 space-x-3">
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 border-2 border-black rounded-md font-medium hover:bg-black/15">
              Logout
            </button>
            <button
              type="button"
              onClick={deleteAccount}
              className="px-4 py-2 border-2 text-red-500 border-red-500 rounded-md font-medium hover:bg-red-500/15">
              Delete Account
            </button>
          </div>
        </section>
      )}
    </>
  );
};

export default Profile;
