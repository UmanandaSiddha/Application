import { useForm } from "react-hook-form";
import { MdOutlineNavigateNext } from "react-icons/md";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

// import {
//   phNum,
//   emailAdd,
//   homeTown,
//   motto,
//   seleInp,
//   seloInp,
//   textAr,
// } from "@/redux/inputs/personal-inputs";

import {
    contactInfo,
    emails,
    socials,
    Favourites,
    miscellaneous,
    lifestyle,
    motto,
    interests,
    background,
    expertise,
    values,
    professional,
    additionalInfo,
  } from "../../../redux/inputs/personal-inputs";

const arr: any = [
  {
    name: "about",
    text: "Enter about youself",
    label: "About Me",
  },
];

// const inputFields = [
//   ...contactInfo.map((input) => ({
//     ...input,
//     type: "text",
//     section: "Phone Number",
//   })),
//   ...arr.map((input: any) => ({ ...input, type: "textarea", section: "" })),
//   ...emails.map((input) => ({
//     ...input,
//     type: "text",
//     section: "Email Address",
//   })),
//   ...lifestyle.map((input) => ({
//     ...input,
//     type: "text",
//     section: "Home Town",
//   })),
//   ...Favourites.map((input) => ({
//     ...input,
//     type: "text",
//     section: "Favourites",
//   })),
//   ...motto.map((input) => ({
//     ...input,
//     type: "text",
//     section: "Favorite Quotes/Mottos",
//   })),
//   ...miscellaneous.map((input) => ({
//     ...input,
//     type: "select",
//     section: "Miscellaneous",
//   })),
//   ...professional.map((input) => ({
//     ...input,
//     type: "select",
//     section: "Selection Inputs",
//   })),
//   ...interests.map((input) => ({
//     ...input,
//     type: "select",
//     section: "Selection Inputs",
//   })),
//   ...additionalInfo.map((input) => ({ ...input, type: "text", section: "Text Areas" })),
// ];

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { creatorInput } from "@/types/form-inputs";
import { personalNotTemp, personalTemp } from "@/redux/reducer/personalReducer";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { SinglePersonalResponse } from "@/types/api-types";

const InputVCard = () => {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const id = search.get("personalId");
  const [progress, setProgress] = useState<number>(25);

  let currentSection: any = null;

  const [isPersonal, setIsPersonal] = useState<boolean>(id ? true : false);
  const [personalLoading, setPersonalLoading] = useState<boolean>(false);

  const { user, isPaid } = useSelector((state: RootState) => state.userReducer);

  const { personal } = useSelector((state: RootState) => state.personalReducer);

  const dispatch = useDispatch();

  const [socialData, setSocialData] = useState<any | null>(
    personal ? personal?.socialMedia : creatorInput
  );
  const [open, setOpen] = useState(false);
  const [otherName, setOtherName] = useState("");
  const [otherLink, setOtherLink] = useState("");

  const [social, setSocial] = useState<boolean>(false);
  const [lifestyles, setLifestyles] = useState<boolean>(false);
  const [fav, setFav] = useState<boolean>(false);
  const [misc, setMisc] = useState<boolean>(false);

  const [collecting, setCollecting] = useState("");
  const [prefMode, setPrefMode] = useState("");
  const [genre, setGenre] = useState("");
  const [outdoor, setOutdoor] = useState("");
  const [artistic, setArtistic] = useState("");
  const [gamingpref, setGamingPref] = useState("");
  const [occupation, setOccupation] = useState("");
  const [aspiration, setAspiration] = useState("");
  const [back, setBack] = useState("");
  const [expert, setExpert] = useState("");

  const [collectingOther, setCollectingOther] = useState("");
  const [prefModeOther, setPrefModeOther] = useState("");
  const [genreOther, setGenreOther] = useState("");
  const [outdoorOther, setOutdoorOther] = useState("");
  const [artisticOther, setArtisticOther] = useState("");
  const [gamingprefOther, setGamingPrefOther] = useState("");
  const [occupationOther, setOccupationOther] = useState("");
  const [aspirationOther, setAspirationOther] = useState("");
  const [backgroundOther, setBackgroundOther] = useState("");
  const [expertiseOther, setExpertiseOther] = useState("");

  const gotPersonal = async () => {
    if (id) {
      try {
        const { data }: { data: SinglePersonalResponse } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/personal/detailed/${id!}`,
          { withCredentials: true }
        );
        dispatch(personalTemp(data.vCard));
        setIsPersonal(true);
      } catch (error: any) {
        toast.error(error.response.data.message);
        dispatch(personalNotTemp());
      }
    }
  };

  useEffect(() => {
    gotPersonal();
  }, []);

  const handleAdd = () => {
    setSocialData([
      ...socialData,
      {
        name: otherLink,
        label: otherName,
        text: "",
      },
    ]);
    setOpen(false);
    setOtherLink("");
    setOtherName("");
  };

  const handleChange = (event: any, index: number) => {
    setSocialData((prevData: any) => [
      ...prevData.slice(0, index),
      {
        ...prevData[index],
        [event.target.name]: event.target.value,
      },
      ...prevData.slice(index + 1),
    ]);
  };

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
        name: personal?.name || "",
        mobilephone: personal?.contactInfo.phoneNumber.mobile || 91,
        homephone: personal?.contactInfo.phoneNumber.home || 91,
        workphone: personal?.contactInfo.phoneNumber.work || 91,
        otherphone: personal?.contactInfo.phoneNumber.other || 91,
        personalemail: personal?.contactInfo.emailAddress.personal || "",
        workemail: personal?.contactInfo.emailAddress.work || "",
        otheremail: personal?.contactInfo.emailAddress.other || "",
        // aboutme: personal?.aboutMe.aboutme || "",
        dob: personal?.lifesty.birth || "",
        hometown: personal?.lifesty.homeTown || "",
        currentCity: personal?.lifesty.currentCity || "",
        languages: personal?.lifesty.languages || "",
  
        favmusic: personal?.favourites.favmusic || "",
        favcolor: personal?.favourites.favcolor || "",
        favcity: personal?.favourites.favcity || "",
        dreamtravel: personal?.favourites.dreamtravel || "",
        favseason: personal?.favourites.favseason || "",
        uniqueskills: personal?.favourites.uniqueSkills || "",
        favcuisine: personal?.favourites.favcuisine || "",
        // prefbeve: personal?.favourites.prefbeve || "",
        petlover: personal?.misce.petlover || "",
        party: personal?.misce.party || "",
        smoker: personal?.misce.smoker || "",
        marital: personal?.misce.marital || "",
        relation: personal?.misce.relation || "",
        fitness: personal?.misce.fitness || "",
        morning: personal?.misce.morning || "",
        diet: personal?.misce.diet || "",
        sleeping: personal?.misce.sleeping || "",
        reading: personal?.misce.reading || "",
  
        prefmode: personal?.interest.prefmode || "",
        genre: personal?.interest.genre || "",
        outdoor: personal?.interest.outdoor || "",
        artistic: personal?.interest.artistic || "",
        gamingpref: personal?.interest.gamingpref || "",
        collecting: personal?.interest.collecting || "",
        coffee: personal?.interest.coffee || "",
        cooking: personal?.interest.cooking || "",
  
        spiritual: personal?.value.spiritual || "",
        corevalue: personal?.value.core || "",
        philosophy: personal?.value.philosophy || "",
        environment: personal?.value.socialCause || "",
  
        inspirationalmotto: personal?.mottos.quotes.inspirational || "",
        funnymotto: personal?.mottos.quotes.funny || "",
        motivationalmotto: personal?.mottos.quotes.motivational || "",
        othermotto: personal?.mottos.quotes.othermotto || "",
  
        global: personal?.beliefs.global || "",
        weirdbelief: personal?.beliefs.weirdbelief || "",
  
        occupation: personal?.profession.occupation || "",
        aspiration: personal?.profession.aspiration || "",
        background: personal?.backg.background || "",
        expertise: personal?.expert.expertise || "",
  
        anyother: personal?.additional.anyother || "",
        futuregoal: personal?.additional.futuregoal || "",
        learning: personal?.additional.learning || "",
        experience: personal?.additional.experience || "",
        habit: personal?.additional.habit || "",
    },
  });

  const onSubmit = async (values: any) => {
    setPersonalLoading(true);
    let final = [];
    for (let i = 0; i < socialData.length; i++) {
      const element = {
        label: socialData[i].label,
        name: socialData[i].name,
      };
      final.push(element);
    }
    const personalData = {
        name: values.name,
        contactInfo: {
          phoneNumber: {
            mobile: values.mobilephone,
            home: values.homephone,
            work: values.workphone,
            other: values.otherphone,
          },
          emailAddress: {
            personal: values.personalemail,
            work: values.workemail,
            other: values.otheremail,
          },
        },
        socialMedia: final,
        lifesty: {
          // aboutme: values.aboutme,
          birth: values.dob,
          homeTown: values.hometown,
          currentCity: values.currentCity,
          languages: values.languages,
        },
        favourites: {
          music: values.favmusic,
          color: values.favcolor,
          city: values.favcity,
          travelDestination: values.dreamtravel,
          season: values.favseason,
          uniqueSkills: values.uniqueskills,
          cuisine: values.favcuisine,
          // beverage: values.prefbeve,
        },
        mottos: {
          quotes: {
            inspirational: values.inspirationalmotto,
            funny: values.funnymotto,
            motivational: values.motivationalmotto,
            other: values.othermotto,
          },
        },
        misce: {
          petLover: values.petlover,
          partyEnthusiast: values.party,
          smoker: values.smoker,
          maritalStatus: values.marital,
          relationshipStatus: values.relation,
          fitness: values.fitness,
          morningPerson: values.morning,
          diet: values.diet,
          sleepingHabit: values.sleeping,
          reading: values.reading,
        },
        interest: {
          prefmode: prefMode === "Other" ? prefModeOther : values.outdoor,
          genre: genre === "Other" ? genreOther : values.outdoor,
          outdoor: outdoor === "Other" ? outdoorOther : values.outdoor,
          artistic: artistic === "Other" ? artisticOther : values.artistic,
          gamingpref:
            gamingpref === "Other" ? gamingprefOther : values.gamingpref,
          collecting:
            collecting === "Other" ? collectingOther : values.collecting,
          coffee: values.coffee,
          cooking: values.cooking,
        },
        value: {
          spiritual: values.spiritual,
          core: values.corevalue,
          philosophy: values.philosophy,
          socialCause: values.environment,
        },
        beliefs: {
          globalIssues: values.global,
          weirdBelief: values.weirdbelief,
        },
        profession: {
          occupation: occupation === "Other" ? occupationOther : values.occupation,
          aspiration: aspiration === "Other" ? aspirationOther : values.aspiration,
        },
        backg: {
          background: back === "Other" ? backgroundOther : values.aspiration,
        },
        expert: {
          expertise: expert === "Other" ? expertiseOther : values.expertise,
        },
        additional: {
          anyother: values.anyother,
          futuregoal: values.futuregoal,
          learning: values.learning,
          experience: values.experience,
          habit: values.habit,
        },
        user: user?._id,
      };
    console.log(personalData);
    try {
      if (isPersonal) {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/cards/edit/${id}?type=personal`,
          personalData,
          { withCredentials: true }
        );
        toast.success("Personal VCards updated!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/cards/new?type=personal`,
          personalData,
          { withCredentials: true }
        );
        toast.success("Personal VCards created!");
      }
      if (isPaid || user?.role === "admin") {
        navigate(-1);
      } else {
        navigate("/plans");
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
      if (!isPaid && user?.role !== "admin") {
        navigate("/plans");
      }
    }
    setPersonalLoading(false);
  };

  const handleProgressForward = () => {
    setProgress(progress + 25);
  };

  const handleProgressBackward = () => {
    setProgress(progress - 25);
  };

  function handleCloseForm(e: React.MouseEvent<HTMLInputElement>) {
    if ((e.target as Element).id === "popupform") {
      setOpen(false);
    }
  }

  function toggleSocials() {
    if (social === true) {
      setSocial(false);
    } else {
      setSocial(true);
    }
  }

  function toggleLifestyle() {
    if (lifestyles === true) {
      setLifestyles(false);
    } else {
      setLifestyles(true);
    }
  }

  function toggleFavs() {
    if (fav === true) {
      setFav(false);
    } else {
      setFav(true);
    }
  }

  function toggleMisc() {
    if (misc === true) {
      setMisc(false);
    } else {
      setMisc(true);
    }
  }

  return (
    <>
      {/* progress bar */}
      <div className="flex justify-center">
        <div className="w-[90%] h-4 bg-gray-300 rounded-full">
          <div
            className="h-4 bg-blue-500 rounded-full"
            style={{ width: `${(progress / 100) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* pop up form */}
      {open && (
        <div className="font-Kanit">
          <div
            className="fixed inset-0 bg-opacity-30 backdrop-blur-md flex justify-center items-center z-10"
            id="popupform"
            onClick={handleCloseForm}
          >
            <div className="bg-white p-8 rounded shadow-lg w-[425px]">
              <h2 className="text-lg font-bold mb-4 flex justify-center underline">
                Add Another Social Profile
              </h2>
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="name"
                    className="text-right text-lg font-semibold"
                  >
                    Name
                  </label>
                  <input
                    className="col-span-3 border rounded px-4 py-2 text-sm"
                    type="text"
                    id="name"
                    value={otherName}
                    onChange={(e) => setOtherName(e.target.value)}
                    placeholder="Enter Social Media Platform"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="link"
                    className="text-right text-lg font-semibold"
                  >
                    Link
                  </label>
                  <input
                    className="col-span-3 border rounded px-4 py-2 text-sm"
                    type="text"
                    id="link"
                    value={otherLink}
                    onChange={(e) => setOtherLink(e.target.value)}
                    placeholder="Enter Social Media Link"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-black text-white font-bold py-2 px-4 rounded"
                  type="button"
                  onClick={handleAdd}
                >
                  Add
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded ml-2"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

<form onSubmit={handleSubmit(onSubmit)} className="space-y-8 font-Kanit">
        {progress === 25 && (
          <div className="flex flex-col justify-center items-center my-8">
            <div className="w-full">
              <h1 className="text-3xl font-bold pl-6">Personal Preferences</h1>
            </div>
            <div className="w-[90%] flex flex-row">
              <div className="basis-1/3 flex justify-center items-center">
                <label htmlFor="" className="text-xl">
                  Name:
                </label>
              </div>
              <div className="basis-2/3 flex justify-center items-center">
                <input
                  type="text"
                  className="block py-2.5 px-0 w-full text-xl font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                  placeholder="Enter your name"
                  {...register("name", { required: true })}
                />
              </div>
            </div>
            <div className="w-full font-semibold text-2xl py-4">
              {/* socials */}
              <div className="pl-6">
                <button
                  className="w-full px-4 pt-2 border-none flex flex-row"
                  onClick={toggleSocials}
                  type="button"
                >
                  <div className="basis-1/4 flex justify-center items-center">
                    Socials
                  </div>
                  <div className="basis-3/4 flex justify-start items-center">
                    <MdOutlineNavigateNext className="w-[3rem] h-[3rem] pl-4 pb-4" />
                  </div>
                </button>
                {/* socials button clicked */}
                {social ? (
                  <div
                    id="dropdown"
                    className="absolute bg-red-400 divide-gray-100 rounded-lg shadow w-[90%] dark:bg-gray-700"
                  >
                    <ul
                      className="py-2 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="dropdownDefaultButton"
                    >
                      {social && (
                        <div className="flex flex-col space-y-2">
                          {socials.map((arr, idx) => (
                            <div
                              key={idx}
                              className="flex flex-row justify-center items-center gap-2"
                            >
                              <div className="basis-1/3 flex justify-center items-center text-lg">
                                <label className="">{arr.label}</label>
                              </div>
                              <div className="basis-2/3 px-4">
                                <input
                                  type="text"
                                  className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600"
                                  // onChange={(e) => handleSocialChange(e, idx)}
                                  placeholder={arr.text}
                                  {...register(`${arr.name}`, {
                                    required: true,
                                  })}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ul>
                  </div>
                ) : null}
              </div>

              {/* lifestyle */}
              <div className="pl-6">
                <button
                  className="w-full px-4 border-none flex flex-row"
                  onClick={toggleLifestyle}
                >
                  <div className="basis-1/4 flex justify-center items-center pl-2">
                    Lifestyle
                  </div>
                  <div className="basis-3/4 flex justify-start items-center">
                    <MdOutlineNavigateNext className="w-[3rem] h-[3rem] pl-4 pb-4" />
                  </div>
                </button>

                {/* lifestyle button clicked */}
                {lifestyles ? (
                  <div
                    id="dropdown"
                    className="absolute bg-red-400 divide-gray-100 rounded-lg shadow w-[90%] dark:bg-gray-700"
                  >
                    <ul
                      className="py-2 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="dropdownDefaultButton"
                    >
                      {lifestyle.map((life, index) => (
                        <li>
                          <div className="flex flex-row" key={index}>
                            <div className="basis-1/3 flex justify-center items-center text-lg">
                              <label htmlFor="" className="">
                                {life.label}
                              </label>
                            </div>
                            <div className="basis-2/3 px-4">
                              <input
                                type="text"
                                className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                                placeholder={life.text}
                                {...register(`${life.name}`, {
                                  required: true,
                                })}
                              />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              {/* Favourites section */}
              <div className="pl-6">
                <button
                  className="w-full px-4 border-none flex flex-row"
                  onClick={toggleFavs}
                >
                  <div className="basis-1/4 flex justify-center items-center pl-2">
                    Favourites
                  </div>
                  <div className="basis-3/4 flex justify-start items-center">
                    <MdOutlineNavigateNext className="w-[3rem] h-[3rem] pl-4 pb-4" />
                  </div>
                </button>

                {/* lifestyle button clicked */}
                {fav ? (
                  <div
                    id="dropdown"
                    className="absolute bg-red-400 divide-gray-100 rounded-lg shadow w-[90%] dark:bg-gray-700"
                  >
                    <ul
                      className="py-2 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="dropdownDefaultButton"
                    >
                      {Favourites.map((favs, index) => (
                        <li>
                          <div className="flex flex-row" key={index}>
                            <div className="basis-1/3 flex justify-start items-center text-lg">
                              <label htmlFor="" className="pl-2">
                                {favs.label}
                              </label>
                            </div>
                            <div className="basis-2/3 px-4">
                              <input
                                type="text"
                                // name={favs.name}
                                className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                                placeholder={favs.text}
                                {...register(`${favs.name}`, {
                                  required: true,
                                })}
                              />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              {/* misc section */}
              <div className="pl-6">
                <button
                  className="w-full px-4 border-none flex flex-row"
                  onClick={toggleMisc}
                >
                  <div className="basis-1/4 flex justify-center items-center pl-2">
                    Miscellaneous
                  </div>
                  <div className="basis-3/4 flex justify-start items-center">
                    <MdOutlineNavigateNext className="w-[3rem] h-[3rem] pl-4 pb-4" />
                  </div>
                </button>

                {/* misc button clicked */}
                {misc ? (
                  <div
                    id="dropdown"
                    className="absolute bg-red-400 divide-gray-100 rounded-lg shadow w-[90%] dark:bg-gray-700"
                  >
                    <ul
                      className="py-2 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="dropdownDefaultButton"
                    >
                      {miscellaneous.map((miscs, index) => (
                        <li className="py-1">
                          {miscs.name === "reading" ? (
                            <div className="flex flex-row" key={index}>
                              <div className="basis-1/3 flex justify-start items-center text-lg">
                                <label htmlFor="" className="pl-2">
                                  {miscs.label}
                                </label>
                              </div>
                              <div className="basis-2/3 px-4">
                                <input
                                  type="text"
                                  // name={miscs.name}
                                  className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                                  placeholder={miscs.text}
                                  {...register(`${miscs.name}`, {
                                    required: true,
                                  })}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-row" key={index}>
                              <div className="basis-1/3 flex justify-start items-center text-lg">
                                <label htmlFor="" className="pl-2">
                                  {miscs.label}
                                </label>
                              </div>
                              <div className="basis-2/3 px-4 flex items-center">
                                <select
                                  // name={miscs.name}
                                  className="w-[75%] rounded-md text-black"
                                  {...register(`${miscs.name}`, {
                                    required: true,
                                  })}
                                >
                                  {miscs.options?.map((option, index) => (
                                    <option key={index}>{option}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* interests & hobbies */}
        {progress === 50 && (
          <div className="flex flex-col justify-center items-center my-8">
            <div className="w-full">
              <h1 className="text-3xl font-bold pl-6">
                Interests & Activities
              </h1>
            </div>
            <div className="pt-6">
              {interests.map((int, index) => (
                <>
                  <div className="flex flex-row py-2" key={index}>
                    <div className="basis-2/5 flex justify-start items-center text-lg">
                      <label htmlFor="" className="pl-2 font-semibold">
                        {int.label}
                      </label>
                    </div>
                    <div className="basis-3/5 px-4 flex items-center">
                      <select
                        className="w-full rounded-md text-black items-center text-lg"
                        {...register(`${int.name}`, { required: true })}
                        onChange={(e) => {
                          if (int.name === "collecting") {
                            setCollecting(e.target.value);
                          } else if (int.name === "prefmode") {
                            setPrefMode(e.target.value);
                          } else if (int.name === "genre") {
                            setGenre(e.target.value);
                          } else if (int.name === "outdoor") {
                            setOutdoor(e.target.value);
                          } else if (int.name === "artistic") {
                            setArtistic(e.target.value);
                          } else if (int.name === "gamingpref") {
                            setGamingPref(e.target.value);
                          }
                        }}
                      >
                        {int.options.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {int.name === "collecting" && collecting === "Other" && (
                    <div className="">
                      <input
                        type="text"
                        className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600"
                        placeholder="Enter custom interest"
                        value={collectingOther}
                        {...register(`${int.customInput.name}`)}
                        onChange={(e) => setCollectingOther(e.target.value)}
                      />
                    </div>
                  )}
                  {int.name === "prefmode" && prefMode === "Other" && (
                    <div className="w-full">
                      <input
                        type="text"
                        className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600"
                        placeholder="Enter custom preference"
                        value={prefModeOther}
                        {...register(`${int.customInput.name}`)}
                        onChange={(e) => setPrefModeOther(e.target.value)}
                      />
                    </div>
                  )}
                  {int.name === "genre" && genre === "Other" && (
                    <div className="">
                      <input
                        type="text"
                        className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600"
                        placeholder="Enter custom genre"
                        value={genreOther}
                        {...register(`${int.customInput.name}`)}
                        onChange={(e) => setGenreOther(e.target.value)}
                      />
                    </div>
                  )}
                  {int.name === "outdoor" && outdoor === "Other" && (
                    <div className="">
                      <input
                        type="text"
                        className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600"
                        placeholder="Enter custom activity"
                        value={outdoorOther}
                        {...register(`${int.customInput.name}`)}
                        onChange={(e) => setOutdoorOther(e.target.value)}
                      />
                    </div>
                  )}
                  {int.name === "artistic" && artistic === "Other" && (
                    <div className="">
                      <input
                        type="text"
                        className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600"
                        placeholder="Enter custom hobby"
                        value={artisticOther}
                        {...register(`${int.customInput.name}`)}
                        onChange={(e) => setArtisticOther(e.target.value)}
                      />
                    </div>
                  )}
                  {int.name === "gamingpref" && gamingpref === "Other" && (
                    <div className="">
                      <input
                        type="text"
                        className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600"
                        placeholder="Enter custom option"
                        value={gamingprefOther}
                        {...register(`${int.customInput.name}`)}
                        onChange={(e) => setGamingPrefOther(e.target.value)}
                      />
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>
        )}

        {progress === 75 && (
          <div className="flex flex-col justify-center items-center my-8">
            <div className="w-full">
              <h1 className="text-3xl font-bold pl-6">Professional Details:</h1>
            </div>
            <div className="w-full pt-6">
              <h3 className="text-2xl font-semibold pl-6 underline">
                Career :
              </h3>
              <div className="pt-2">
                {professional.map((prof, index) => (
                  <>
                    <div className="flex flex-row py-2" key={index}>
                      <div className="basis-1/3 flex justify-start items-center text-lg">
                        <label htmlFor="" className="pl-4 font-semibold">
                          {prof.label}
                        </label>
                      </div>
                      <div className="basis-2/3 px-4 flex items-center">
                        <select
                          className="w-full rounded-md text-black items-center text-lg"
                          {...register(`${prof.name}`, { required: true })}
                          onChange={(e) => {
                            if (prof.name === "occupation") {
                              setOccupation(e.target.value);
                            } else if (prof.name === "aspiration") {
                              setAspiration(e.target.value);
                            }
                          }}
                        >
                          {prof.options.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {prof.name === "occupation" && occupation === "Other" && (
                      <div className="">
                        <input
                          type="text"
                          className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600"
                          placeholder="Enter custom occupation"
                          value={occupationOther}
                          {...register(`${prof.customInput.name}`)}
                          onChange={(e) => setOccupationOther(e.target.value)}
                        />
                      </div>
                    )}
                    {prof.name === "aspiration" && aspiration === "Other" && (
                      <div className="">
                        <input
                          type="text"
                          className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600"
                          placeholder="Enter custom aspiration"
                          value={aspirationOther}
                          {...register(`${prof.customInput.name}`)}
                          onChange={(e) => setAspirationOther(e.target.value)}
                        />
                      </div>
                    )}
                  </>
                ))}
              </div>
            </div>

            <div className="w-full pt-6">
              <h3 className="text-2xl font-semibold pl-6 underline">
                Education :
              </h3>
              <div className="pt-2">
                <div className="flex flex-row py-2">
                  <div className="basis-1/3 flex justify-start items-center text-lg">
                    <label htmlFor="" className="pl-6 font-semibold">
                      {background.label}
                    </label>
                  </div>
                  <div className="basis-2/3 px-4 flex items-center">
                    <select
                      className="w-full rounded-md text-black items-center text-lg"
                      {...register("background", { required: true })}
                      onChange={(e) => setBack(e.target.value)}
                    >
                      {background.options.map((option, index) => (
                        <option key={index}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {back === "Other" && (
                  <div className="">
                    <input
                      type="text"
                      className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600"
                      placeholder="Enter custom background"
                      {...register(`${background.customInput.name}`)}
                      onChange={(e) => setBackgroundOther(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="w-full pt-6">
              <h3 className="text-2xl font-semibold pl-6 underline">
                Skills & Expertise :
              </h3>
              <div className="pt-2">
                <div className="flex flex-row py-2">
                  <div className="basis-1/3 flex justify-start items-center text-lg">
                    <label htmlFor="" className="pl-6 font-semibold">
                      {expertise.label}
                    </label>
                  </div>
                  <div className="basis-2/3 px-4 flex items-center">
                    <select
                      className="w-full rounded-md text-black items-center text-lg"
                      {...register("expertise", { required: true })}
                      onChange={(e) => setExpert(e.target.value)}
                    >
                      {expertise.options.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {expert === "Other" && (
                  <div className="">
                    <input
                      type="text"
                      className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600"
                      placeholder="Enter custom expertise"
                      value={expertiseOther}
                      {...register(`${expertise.customInput.name}`)}
                      onChange={(e) => setExpertiseOther(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {progress === 100 && (
          <div className="flex flex-col justify-center items-center my-8">
            <div className="w-full">
              <h1 className="text-3xl font-bold pl-6">Others</h1>
            </div>
            <div className="py-8">
              {additionalInfo.map((info, index) => (
                <div className="flex flex-row" key={index}>
                  <div className="basis-1/3 flex justify-start items-center text-lg">
                    <label htmlFor="" className="pl-3">
                      {info.label}
                    </label>
                  </div>
                  <div className="basis-2/3 px-4">
                    <input
                      type="text"
                      className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 pl-2"
                      placeholder={info.text}
                      {...register(`${info.name}`, { required: true })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* <button className="w-[350px]" type="submit" disabled={personalLoading}>
          {personalLoading ? "Saving..." : "Save"}
        </button> */}
        <div className="w-full flex flex-row">
          <div className="basis-1/2 flex justify-center">
            {progress === 25 ? (
              <button
                className="px-6 py-2 rounded-lg hover:cursor-pointer bg-blue-300"
                disabled
              >
                Back
              </button>
            ) : (
              <button
                className="px-6 py-2 rounded-lg hover:cursor-pointer bg-blue-400"
                onClick={handleProgressBackward}
              >
                Back
              </button>
            )}
          </div>
          <div className="basis-1/2 flex justify-center">
            {progress === 100 ? (
              <button
                className="px-6 py-2 rounded-lg hover:cursor-pointer bg-blue-400"
                type="submit"
                disabled={personalLoading}
              >
                {personalLoading ? "Saving..." : "Save"}
              </button>
            ) : (
              <button
                className="px-6 py-2 rounded-lg hover:cursor-pointer bg-blue-400"
                onClick={handleProgressForward}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default InputVCard;
