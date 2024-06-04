import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import Loader from "@/components/rest/loader";
import { useEffect, useState, useMemo, useCallback } from "react";
import { IoPersonOutline } from "react-icons/io5";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch } from "react-redux";
import { userExist, userNotExist } from "../../redux/reducer/userReducer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
// import {
//   deleteUser,
//   updateUserProfile,
//   requestVerifyUser,
//   updatePassword,
// } from "@/redux/api/userApi";
import { toast } from "react-toastify";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { UserResponse } from "@/types/api-types";

const Profile = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openSep, setOpenSep] = useState<boolean>(false);
  const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<any>();

  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openReset, setOpenReset] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [pwdVisible, setPwdVisible] = useState<boolean>(false);
  const [newpwdVisible, setNewPwdVisible] = useState<boolean>(false);
  const [conpwdVisible, setConPwdVisible] = useState<boolean>(false);

  const dispatch = useDispatch();

  const { user, loading } = useSelector(
    (state: RootState) => state.userReducer
  );

  const togglePwdVisible = () => {
    if (pwdVisible) {
      setPwdVisible(false);
    } else {
      setPwdVisible(true);
    }
  };
  const toggleNewPwdVisible = () => {
    if (newpwdVisible) {
      setNewPwdVisible(false);
    } else {
      setNewPwdVisible(true);
    }
  };
  const toggleConPwdVisible = () => {
    if (conpwdVisible) {
      setConPwdVisible(false);
    } else {
      setConPwdVisible(true);
    }
  };

  const toggleDelete = () => {
    if (openDelete) {
      setOpenDelete(false);
    } else {
      setOpenDelete(true);
    }
  };

  const toggleReset = () => {
    if (openReset) {
      setOpenReset(false);
    } else {
      setOpenReset(true);
    }
  };

  const toggleEditProfile = () => {
    if (openEdit) {
      setOpenEdit(false);
    } else {
      setOpenEdit(true);
    }
  };

  //   const gotPayment = async () => {
  //     if (user?.isVerified) {
  //       try {
  //         const data = await getAllPayments();
  //         dispatch(paymentExist(data.payments));
  //       } catch (error: any) {
  //         toast.error(error.response.data.message);
  //       }
  //     }
  //   };

  //   useEffect(() => {
  //     gotPayment();
  //   }, []);

  const formSchema = useMemo(
    () =>
      z.object({
        name: z.string(),
      }),
    []
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: useMemo(
      () => ({
        name: user?.name,
      }),
      [user]
    ),
  });

  const {
    register: formRegister,
    handleSubmit: formHandleSubmit,
    formState: { errors: formErrors },
  } = form;

  const sepForm = useForm({
    defaultValues: useMemo(
      () => ({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }),
      []
    ),
  });

  const {
    register: sepFormRegister,
    handleSubmit: sepFormHandleSubmit,
    formState: { errors: sepFormErrors },
  } = sepForm;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setOpen(true);
    const updateData = {
      name: values.name,
      image: avatar,
    };
    console.log(updateData);
    try {
      const { data }: { data: UserResponse } = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/me/update`, updateData, { withCredentials: true });
      // const data = await updateUserProfile(updateData);
      dispatch(userExist(data.user));
      setOpen(false);
      toast.success("Profile Updated Successfully");
    } catch (error: any) {
      setOpen(false);
      toast.error(error.response.data.message);
    }
  };

  const handleRequestVerify = useCallback(async () => {
    setVerifyLoading(true);
    try {
      // await requestVerifyUser();
      await axios.get(`${import.meta.env.VITE_BASE_URL}/user/request/verification`, { withCredentials: true });
      toast.success("Email Sent  Successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
    setVerifyLoading(false);
  }, []);

  const handleDeleteAccount = useCallback(async () => {
    setDeleteLoading(true);
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/user/delete/account`, { withCredentials: true });
      dispatch(userNotExist());
      toast.success("Account Deleted Successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
    setDeleteLoading(false);
  }, [dispatch]);

  const handleResetPassword = useCallback(
    async (resetValues: any) => {
      const resetDate = {
        oldPassword: resetValues.oldPassword,
        newPassword: resetValues.newPassword,
        confirmPassword: resetValues.confirmPassword,
      };
      setOpenSep(true);
      try {
        if (user?.accountType === "google") {
          const config = {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          };
          const { data }: { data: UserResponse } = await axios.put(
            `${import.meta.env.VITE_BASE_URL}/user/set/password`,
            resetDate,
            config
          );
          dispatch(userExist(data.user));
        } else {
          const { data }: { data: UserResponse } = await axios.delete(`${import.meta.env.VITE_BASE_URL}/user/password/reset/:token`, resetDate, { withCredentials: true });
          // const data = await updatePassword(resetDate);
          dispatch(userExist(data.user));
        }
        setOpenSep(false);
        toast.success("Password Updated Successfully");
        setOpenReset(false);
      } catch (error: any) {
        setOpenSep(false);
        toast.error(error.response.data.message);
      }
    },
    [dispatch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (file instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatar(reader.result);
        } else {
          console.log("Failed to read the file.");
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.error("The selected file is not a Blob.");
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-row justify-center gap-8 lg:gap-2 items-center  ">
          {user ? (
            <div className="w-full lg:flex lg:flex-row lg:max-h-screen">
              <div className="bg-blue-400 py-[4rem] lg:pt-6 lg:mt-12 flex flex-row rounded-b-[5rem] lg:rounded-[2rem] lg:shadow-2xl lg:ml-4 lg:basis-1/2 lg:bg-[url('../../../public/cosmic.jpg')] lg:bg-cover">
                <div className="basis-1/4 flex justify-end pb-[8rem] lg:items-center">
                  <IoPersonOutline className="w-[6rem] h-[6rem] lg:w-[8rem] lg:h-[8em] -mt-2 text-white" />
                </div>
                <div className="basis-3/4 pb-[8rem] lg:flex lg:items-center">
                  <div className="">
                    <p className="font-Kanit text-lg lg:text-[3rem] pl-2 lg:text-white">
                      Welcome,
                    </p>
                    <p className="font-Philosopher text-6xl lg:text-[6rem] pl-4 lg:text-white">
                      {user?.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* main information containing div */}
              <div className="lg:relative lg:mt-[12rem] flex justify-center lg:basis-1/2">
                <div className="relative bg-slate-100 w-[90%] shadow-xl rounded-2xl  -mt-[9rem] h-[38rem]">
                  <div className="py-4">
                    <div className="flex flex-row">
                      <div className="basis-1/4 flex justify-end">
                        {/* <Avatar className="w-14 h-14 border-2 border-blue-400">
                          <AvatarImage src={user.image} alt={user._id} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar> */}
                        <div>
                          {user.image ? (
                            <img src={user.image} alt={user._id} />
                          ) : (
                            <>
                            {user.name.charAt(0)}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="basis-3/4 flex flex-col justify-start items-center">
                        <p className="w-full flex justify-start pl-[2.7rem] font-Philosopher">
                          User Id:
                        </p>
                        <p className="w-full flex justify-start pl-[2.7rem] font-Kanit">
                          {user?._id}
                        </p>
                      </div>
                      <div className=""></div>
                    </div>
                  </div>

                  <hr className="w-full text-slate-300" />

                  {!user?.isVerified ? (
                    <div className="flex flex-col justify-center items-center space-y-4 mt-2">
                      <p className="text-red-600 font-semibold">
                        You are not verified
                      </p>
                      <button className="px-4 py-2 bg-black font-Philosopher text-white rounded-lg" onClick={handleRequestVerify}>
                        Verify Email
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="">
                        <div className="text-slate-300 w-full flex justify-start pl-[2rem] py-2 text-lg font-Kanit">
                          Account Settings
                        </div>

                        <div className="w-full flex flex-col py-2">
                          <button className="" onClick={toggleEditProfile}>
                            <div className="flex flex-row">
                              <div className="basis-3/4 flex justify-start text-xl font-Kanit pl-[2rem]">
                                Edit Profile
                              </div>
                              <div className="basis-1/4 flex justify-center">
                                <MdNavigateNext
                                  className={`w-[2rem] h-[2rem] ${
                                    openEdit
                                      ? "transition ease-in-out rotate-90"
                                      : "transition ease-in-out"
                                  }`}
                                />
                              </div>
                            </div>
                          </button>
                          {openEdit ? (
                            <div
                              id="dropdown"
                              className="relative bg-slate-200 flex flex-col items-start rounded-lg shadow-lg transition ease-in-out delay-150 py-2 my-2"
                            >
                              <form
                                action=""
                                className="w-full"
                                onSubmit={formHandleSubmit(onSubmit)}
                              >
                                <div className="flex flex-col w-full py-4">
                                  <label
                                    htmlFor=""
                                    className="pl-8 pb-2 font-Kanit"
                                  >
                                    Set New Name:
                                  </label>
                                  <div className="flex flex-row">
                                    <input
                                      type="text"
                                      className="ml-8 w-[80%] py-1 rounded-lg shadow-lg pl-4 flex justify-center items-center font-Kanit"
                                      placeholder="New Name"
                                      {...formRegister("name", {
                                        required: true,
                                      })}
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col w-full py-2">
                                  <label
                                    htmlFor=""
                                    className="pl-8 pb-2 font-Kanit"
                                  >
                                    Set New Profile Picture:
                                  </label>
                                  <div className="flex flex-row">
                                    <input
                                      name="avatar"
                                      type="file"
                                      accept="image/*"
                                      className="ml-8 w-[80%] py-1 rounded-lg  flex justify-center items-center font-Kanit"
                                      onChange={handleChange}
                                      placeholder="Profile Pic"
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-center">
                                  <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-400 text-white rounded-lg font-Philosopher"
                                  >
                                    {/* {open ? "Saving..." : "Save Changes"} */}
                                    Save Changes
                                  </button>
                                </div>
                              </form>
                            </div>
                          ) : null}
                        </div>

                        <div className="w-full flex flex-row py-2 mt-2 mb-8">
                          <div className="basis-3/4 flex justify-start text-xl font-Kanit pl-[2rem]">
                            Change Password
                          </div>
                          <div className="basis-1/4 flex justify-center">
                            <MdNavigateNext className="w-[2rem] h-[2rem]" />
                          </div>
                        </div>

                        <hr className="w-full text-slate-300" />

                        <div className="text-slate-300 w-full flex justify-start pl-[2rem] py-2 text-lg font-Kanit">
                          More
                        </div>

                        {/* set Reset Dillema */}
                        <div className="w-full flex flex-col py-2 mt-3">
                          <button className="" onClick={toggleReset}>
                            <div className="flex flex-row">
                              <div className="basis-3/4 flex justify-start text-xl font-Kanit pl-[2rem]">
                                {user.accountType === "google"
                                  ? "Set Password"
                                  : "Reset Password"}
                              </div>
                              <div className="basis-1/4 flex justify-center">
                                <MdNavigateNext
                                  className={`w-[2rem] h-[2rem] ${
                                    openReset
                                      ? "transition ease-in-out rotate-90"
                                      : "transition ease-in-out"
                                  }`}
                                />
                              </div>
                            </div>
                          </button>
                          <div className="w-full">
                            {openReset ? (
                              <div
                                id="dropdown"
                                className="relative bg-slate-200 flex flex-col items-start rounded-lg shadow-lg transition ease-in-out delay-150 py-2 my-2"
                              >
                                <form
                                  action=""
                                  className="w-full"
                                  onSubmit={sepFormHandleSubmit(
                                    handleResetPassword
                                  )}
                                >
                                  {user?.accountType !== "google" && (
                                    <div className="flex flex-col w-full py-4">
                                      <label
                                        htmlFor=""
                                        className="pl-8 pb-2 font-Kanit"
                                      >
                                        Enter Old Password:
                                      </label>
                                      <div className="flex flex-row">
                                        <input
                                          type={
                                            pwdVisible ? "text" : "password"
                                          }
                                          className="ml-8 w-[70%] py-1 rounded-l-lg shadow-lg pl-4 flex justify-center items-center font-Kanit"
                                          placeholder="Old Password"
                                          {...sepFormRegister("oldPassword", {
                                            required: true,
                                          })}
                                        />
                                        <button
                                          type="button"
                                          className="px-2 rounded-r-lg shadow-lg"
                                          onClick={togglePwdVisible}
                                        >
                                          {pwdVisible ? (
                                            <FaEyeSlash className="w-[1.5rem] h-[1.5rem]" />
                                          ) : (
                                            <FaEye className="w-[1.5rem] h-[1.5rem]" />
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex flex-col w-full pb-4">
                                    <label
                                      htmlFor=""
                                      className="pl-8 pb-2 font-Kanit"
                                    >
                                      Enter New Password:
                                    </label>
                                    <div className="flex flex-row">
                                      <input
                                        type={
                                          newpwdVisible ? "text" : "password"
                                        }
                                        className="ml-8 w-[70%] py-1 rounded-l-lg shadow-lg pl-4 flex justify-center items-center font-Kanit"
                                        placeholder="New Password"
                                        {...sepFormRegister("newPassword", {
                                          required: true,
                                        })}
                                      />
                                      <button
                                        type="button"
                                        className="px-2 rounded-r-lg shadow-lg"
                                        onClick={toggleNewPwdVisible}
                                      >
                                        {newpwdVisible ? (
                                          <FaEyeSlash className="w-[1.5rem] h-[1.5rem]" />
                                        ) : (
                                          <FaEye className="w-[1.5rem] h-[1.5rem]" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                  <div className="flex flex-col w-full pb-4">
                                    <label
                                      htmlFor=""
                                      className="pl-8 pb-2 font-Kanit"
                                    >
                                      Confirm Password:
                                    </label>
                                    <div className="flex flex-row">
                                      <input
                                        type={
                                          conpwdVisible ? "text" : "password"
                                        }
                                        className="ml-8 w-[70%] py-1 rounded-l-lg shadow-lg pl-4 flex justify-center items-center font-Kanit"
                                        placeholder="Confirm Password"
                                        {...sepFormRegister("confirmPassword", {
                                          required: true,
                                        })}
                                      />
                                      <button
                                        type="button"
                                        className="px-2 rounded-r-lg shadow-lg"
                                        onClick={toggleConPwdVisible}
                                      >
                                        {conpwdVisible ? (
                                          <FaEyeSlash className="w-[1.5rem] h-[1.5rem]" />
                                        ) : (
                                          <FaEye className="w-[1.5rem] h-[1.5rem]" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                  <div className="w-full flex justify-center py-3">
                                    <button
                                      className="px-4 py-2 bg-blue-400 text-white font-Philosopher rounded-lg shadow-lg hover:cursor-pointer"
                                      //   onClick={sepForm.handleSubmit(
                                      //     handleResetPassword
                                      //   )}
                                    >
                                      {openSep ? "Saving..." : "Save Changes"}
                                    </button>
                                  </div>
                                </form>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div
                          className="w-full flex flex-col py-2 my-2"
                          onClick={toggleDelete}
                        >
                          <div className="flex flex-row hover:cursor-pointer">
                            <div className="basis-3/4 flex justify-start text-xl font-Kanit pl-[2rem]">
                              Delete Account
                            </div>
                            <div className="basis-1/4 flex justify-center">
                              <MdNavigateNext
                                className={`w-[2rem] h-[2rem] ${
                                  openDelete
                                    ? "transition ease-in-out rotate-90"
                                    : "transition ease-in-out"
                                }`}
                              />
                            </div>
                          </div>
                          <div className="w-full flex justify-center">
                            {openDelete ? (
                              <div
                                id="dropdown"
                                className="absolute bg-red-200 flex flex-col items-start rounded-lg px-10 py-4 shadow-lg transition ease-in-out delay-150"
                              >
                                <p className="text-sm underline p-2 font-Philosopher">
                                  Warning:
                                </p>
                                <p className="pl-2 text-red-400 font-Kanit">
                                  Deleting your account will permanently delete
                                  all your data in this website.
                                </p>
                                <p className="pl-2 text-sm font-Kanit">
                                  Do you wish to proceed?
                                </p>
                                <div className="w-full flex justify-center">
                                  <button
                                    className="px-4 py-2 bg-red-400 text-white font-Philosopher rounded-lg my-2 shadow-lg"
                                    onClick={handleDeleteAccount}
                                    disabled={deleteLoading}
                                  >
                                    {deleteLoading
                                      ? "Deleting You..."
                                      : "Delete Account"}
                                  </button>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p>You are not logged in</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Profile;
