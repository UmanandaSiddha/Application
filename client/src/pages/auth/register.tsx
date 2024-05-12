import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "@/redux/api/userApi";
import { useDispatch } from "react-redux";
import { userExist, userNotExist } from "../../redux/reducer/userReducer";
import { toast } from "react-toastify";
import { useState } from "react";
import { getGoogleAuthUrl } from "@/lib/google";
import { Label } from "@/components/ui/label";
import Compressor from "compressorjs";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState<any>();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // const file = e.target.files![0];
    const file: File | null = e.target.files![0];
    if (file instanceof Blob) {
      // const reader = new FileReader();
      // reader.onload = () => {
      //     if (reader.readyState === 2) {
      //         setAvatar(reader.result);
      //     } else {
      //         console.log("Failed to read the file.");
      //     }
      // };
      // reader.readAsDataURL(file);

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

      // const reader = new FileReader();
      // reader.onload = async () => {
      //     try {
      //         const compressedFile = await compressImage(file);
      //         setAvatar(compressedFile);
      //     } catch (error) {
      //         console.error('Failed to compress the image:', error);
      //     }
      // };
      // reader.readAsDataURL(file);
    } else {
      console.error("The selected file is not a Blob.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterLoading(true);
    const registerData = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      image: avatar,
    };
    try {
      const data = await registerUser(registerData);
      dispatch(userExist(data.user));
      toast.success("User Registered!");
      navigate("/dashboard");
    } catch (error: any) {
      dispatch(userNotExist());
      toast.error(error.response.data.message);
    }
    setRegisterLoading(false);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="w-full max-w-md p-4 absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%]">
          <form
            onSubmit={handleSubmit}
            className="shadow-md rounded px-8 pb-8 mb-4 font-Kanit"
          >
            <div className="mb-4 mt-2">
              <label className="block text-black text-sm font-bold mb-2">
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                name="name"
                type="text"
                placeholder="Email"
                value={userData.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
              />
            </div>
            <div className="mb-4 mt-2">
              <label className="block text-black text-sm font-bold mb-2">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                name="email"
                type="email"
                placeholder="Email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
              />
            </div>
            <div className="mb-6">
              <label className="block text-black text-sm font-bold mb-2">
                Password
              </label>
              <input
                className="shadow rounded w-full py-2 px-3 text-black mb-3 leading-tight focus:outline-none focus:shadow-outline"
                name="password"
                type="text"
                placeholder="Password"
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
              />
            </div>
            <div className="mb-6">
              <label className="block text-black text-sm font-bold mb-2">
                Profile Picture
              </label>
              <input
                className="shadow rounded w-full py-2 px-3 text-black mb-3 leading-tight focus:outline-none focus:shadow-outline"
                name="avatar"
                type="file"
                accept="image/*"
                // value={userData.profilePicture}
                // onChange={(e) =>
                //   setUserData({ ...userData, profilePicture: e.target.value })
                // }
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-center">
              <button
                className="bg-green-400 hover:bg-green-500 text-teal-950 font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={registerLoading}
              >
                {registerLoading ? "Registering..." : "Register"}
              </button>
            </div>
            <div className="mt-2 flex justify-center">Or</div>
            <div className="flex justify-center">
              <a href={getGoogleAuthUrl()}>
                <button
                  className="bg-black text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                >
                  Register with Google
                </button>
              </a>
            </div>
            <div className="mt-2 flex justify-center">
              <p className="">Already have an account?</p>
            </div>
            <div className="flex justify-center">
              <p className="hover:cursor-pointer hover:underline">
                <Link to="/login">Login here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
