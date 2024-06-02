import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "@/redux/api/userApi";
import { userExist, userNotExist } from "../../redux/reducer/userReducer";
import { toast } from "react-toastify";
import { number } from "zod";
import { getGoogleAuthUrl } from "@/lib/google";
import { UserResponse } from "@/types/api-types";
import axios from "axios";

function OrgRegister() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState<any>();
  const [organisationInfo, setOrganisationInfo] = useState({
    name: "",
    email: "",
    password: "",
    cfmPassword: "",
    orgWebsite: "",
    orgAddress: "",
    phone: number,
  });


  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | null = e.target.files![0];
    if (file instanceof Blob) {
      const compressImage = async (file: File) => {
        try {
          return await new Promise((resolve, reject) => {
            new Compressor(file, {
              quality: 0.6,
              maxWidth: 800,
              maxHeight: 600,
              success(result) {
                resolve(result);
              },
              error(err) {
                reject(err);
              },
            });
          });
        } catch (error) {
          console.error("Error compressing image:", error);
          throw error;
        }
      };

      try {
        const compressedFile = await compressImage(file);
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setAvatar(reader.result);
          } else {
            console.error("Failed to read the compressed file.");
          }
        };
        reader.readAsDataURL(compressedFile as Blob);
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    } else {
      console.error("The selected file is not a Blob.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterLoading(true);
    const registerData = {
      name: organisationInfo.name,
      email: organisationInfo.email,
      password: organisationInfo.password,
      image: avatar,
      orgDetails: {
        website: organisationInfo.orgWebsite,
        address: organisationInfo.orgAddress,
        phone: organisationInfo.phone,
      }
    };
    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      };
      const { data }: { data: UserResponse } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/register?type=org`,
        registerData,
        config
      );
      dispatch(userExist(data.user));
      toast.success("User Registered!");
      navigate("/dashboard");
    } catch (error: any) {
      dispatch(userNotExist());
      toast.error(error.response.data.message);
    }
    setRegisterLoading(false);
  };





  const [registerLoading, setRegisterLoading] = useState<boolean>(false);

  return (
    <>
    <div className="w-full flex justify-center">
      <h1 className="font-Philosopher underline">
        Registering as an Organisation...
      </h1>
    </div>
      <div className="relative flex flex-col justify-center items-center max-h-screen lg:mt-4 ">
        <div className="w-full max-w-4xl p-4 absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] bg-white mt-[27.5rem] lg:mt-[20rem]">
          <form
            // onSubmit={handleSubmit}
            className="shadow-lg rounded-xl px-8 pb-8 mb-4 font-Kanit border bg-white"
          >
            <div className="block lg:hidden">
            <div className="flex flex-col gap-2">
              <div className="mb-4 mt-2">
                <label className="block text-black text-sm font-bold mb-1">
                  Organisation Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  name="name"
                  type="name"
                  placeholder="Name"
                  value={organisationInfo.name}
                  onChange={(e) =>
                    setOrganisationInfo({
                      ...organisationInfo,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-black text-sm font-bold mb-1">
                  Organisation Website
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  name="website"
                  type="text"
                  placeholder="Website"
                  value={organisationInfo.orgWebsite}
                  onChange={(e) =>
                    setOrganisationInfo({
                      ...organisationInfo,
                      orgWebsite: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            </div>

            <div className="hidden lg:block">
            <div className="flex flex-row gap-2">
              <div className="basis-1/2 mb-4 mt-2">
                <label className="block text-black text-sm font-bold mb-1">
                  Organisation Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  name="name"
                  type="name"
                  placeholder="Name"
                  value={organisationInfo.name}
                  onChange={(e) =>
                    setOrganisationInfo({
                      ...organisationInfo,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="basis-1/2 mb-4 mt-2">
                <label className="block text-black text-sm font-bold mb-1">
                  Organisation Website
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  name="website"
                  type="text"
                  placeholder="Website"
                  value={organisationInfo.orgWebsite}
                  onChange={(e) =>
                    setOrganisationInfo({
                      ...organisationInfo,
                      orgWebsite: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            </div>

            <div className="block lg:hidden">
            <div className="flex flex-col gap-2">
              <div className="mb-6">
                <label className="block text-black text-sm font-bold mb-1">
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  name="email"
                  type="text"
                  placeholder="Email Address"
                  value={organisationInfo.email}
                  onChange={(e) =>
                    setOrganisationInfo({
                      ...organisationInfo,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-6">
                <label className="block text-black text-sm font-bold mb-1">
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  name="password"
                  type="text"
                  placeholder="Password"
                  value={organisationInfo.password}
                  onChange={(e) =>
                    setOrganisationInfo({
                      ...organisationInfo,
                      password: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            </div>

            <div className="hidden lg:block">
            <div className="flex flex-row gap-2">
              <div className="basis-1/2 mb-6">
                <label className="block text-black text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  name="email"
                  type="text"
                  placeholder="Email Address"
                  value={organisationInfo.email}
                  onChange={(e) =>
                    setOrganisationInfo({
                      ...organisationInfo,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="basis-1/2 mb-6">
                <label className="block text-black text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  name="password"
                  type="text"
                  placeholder="Password"
                  value={organisationInfo.password}
                  onChange={(e) =>
                    setOrganisationInfo({
                      ...organisationInfo,
                      password: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            </div>


            <div className="block lg:hidden">
            <div className="flex flex-col gap-2">
              <div className="mb-6">
                <label className="block text-black text-sm font-bold mb-1">
                  Organisation Logo
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  name="profilePicture"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-6">
                <label className="block text-black text-sm font-bold mb-1">
                  Confirm Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  name="cfmPassword"
                  type="text"
                  placeholder="Confirm Password"
                  value={organisationInfo.cfmPassword}
                  onChange={(e) =>
                    setOrganisationInfo({
                      ...organisationInfo,
                      cfmPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            </div>

            <div className="hidden lg:block">
            <div className="flex flex-row gap-2">
              <div className="basis-1/2 mb-6 mt-2">
                <label className="block text-black text-sm font-bold mb-2">
                  Organisation Logo
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  name="profilePicture"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>
              <div className="basis-1/2 mb-6 mt-2">
                <label className="block text-black text-sm font-bold mb-2">
                  Confirm Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-3 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  name="cfmPassword"
                  type="text"
                  placeholder="Confirm Password"
                  value={organisationInfo.cfmPassword}
                  onChange={(e) =>
                    setOrganisationInfo({
                      ...organisationInfo,
                      cfmPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor=""
                className="block text-black text-sm font-bold mb-2"
              >
                Organisation Address
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                name="orgAddress"
                type="text"
                placeholder="Address"
                value={organisationInfo.orgAddress}
                onChange={(e) =>
                  setOrganisationInfo({
                    ...organisationInfo,
                    orgAddress: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor=""
                className="block text-black text-sm font-bold mb-2"
              >
                Organisation Phone Number
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                name="phone"
                placeholder="Organisation Phone Number"
                value={organisationInfo.phone}
                onChange={(e) =>
                  setOrganisationInfo({
                    ...organisationInfo,
                    phone: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex justify-center">
              <button
                className="bg-green-400 hover:bg-green-500 text-teal-950 font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline font-Philosopher"
                type="submit"
                disabled={registerLoading}
              >
                {registerLoading ? "Loading..." : "Register"}
              </button>
            </div>
            <div className="flex justify-center font-Philosopher">
              <p className="">Already have an account?</p>
            </div>
            <div className="flex justify-center">
              <p className="hover:cursor-pointer hover:underline font-Philosopher">
                <Link to="/login">Login here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default OrgRegister;
