import { Personal } from "@/types/card_types";
import { useState } from "react";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaSpotify } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FcAbout, FcBriefcase } from "react-icons/fc";
import { FcBusinessContact } from "react-icons/fc";
import { FcCloth } from "react-icons/fc";
import { FcComboChart } from "react-icons/fc";
import { FcDataProtection } from "react-icons/fc";
import { GrLinkNext } from "react-icons/gr";

interface PropsType {
  card: Personal | null;
}

const PersonalComponent = ({ card }: PropsType) => {
  // const [social, setSocial] = useState<boolean>(false);
  const [lifestyles, setLifestyles] = useState<boolean>(false);
  const [fav, setFav] = useState<boolean>(false);
  const [misc, setMisc] = useState<boolean>(false);
  const [interest, setInterest] = useState<boolean>(false);
  const [professionals, setProfessionals] = useState<boolean>(false);
  const [others, setOthers] = useState<boolean>(false);

  const birthDate = card?.dateOfBirth ? new Date(card?.dateOfBirth) : null;
  const formattedDate = birthDate ? birthDate.toLocaleDateString() : null;

  const professionalDetails = [
    {
      label: "Current Occupation",
      value: card?.currentOcupation,
    },{
      label: "Career Goals",
      value: card?.careerAspiation,
    }
  ];

  const favourites = [
    {
      label: "Fav Music",
      value: card?.music,
    },{
      label: "Fav Colour",
      value: card?.color
    },{
      label: "Fav City",
      value: card?.city,
    },{
      label: "Fav-Destination",
      value: card?.travelDestination,
    },{
      label: "Fav Season",
      value: card?.season,
    },{
      label: "Unique Skills",
      value: card?.uniqueSkills,
    },{
      label: "Fav-Cuisine",
      value: card?.cuisine,
    }
  ];

  const lifestyless = [
    {
      label: "Date of Birth",
      value: formattedDate ?? "",
    },{
      label: "Home Town",
      value: card?.homeTown,
    },{
      label: "Current City",
      value: card?.currentCity,
    },{
      label: "Languages",
      value: card?.languages,
    },
  ];

  const miscellaneouss = [
    {
      label: "Pet Lover?",
      value: card?.petLover,
    },{
      label: "Party Enthusiast?",
      value: card?.partyEnthusiast,
    },{
      label: "Smoker?",
      value: card?.smoker,
    },{
      label: "Marital Status?",
      value: card?.maritalStatus,
    },{
      label: "Relationship?",
      value: card?.relationshipStatus,
    },{
      label: "Morning/Night Person?",
      value: card?.morningPerson,
    },{
      label: "Sleeping Habits?",
      value: card?.sleepingHabit,
    },{
      label: "Dietary Preferences",
      value: card?.diet,
    },{
      label: "Fitness Routine",
      value: card?.fitnessRoutine,
    }
  ];

  const interestss = [
    {
      label: "Preferred Mode of Travel",
      value: card?.travelMode
    },{
      label: "Fav Movies/TV Shows",
      value: card?.genre
    },{
      label: "Sports Activites",
      value: card?.sports,
    },{
      label: "Artistic Hobbies",
      value: card?.artistisPursuits,
    },{
      label: "Gaming Preferences",
      value: card?.gaming,
    },{
      label: "Collecting Hobby/Interest",
      value: card?.collectignHobby,
    },{
      label: "Coffee or Tea?",
      value: card?.coffee,
    },{
      label: "Cooking Skills",
      value: card?.cookingSkills,
    }
  ];

  const additionalData = [
    {
      label: "Other Interests",
      value: card?.otherInterests,
    },{
      label: "Future Goals",
      value: card?.futureGoals,
    },{
      label: "Currently Learning",
      value: card?.current,
    },{
      label: "Most Unusual Experience",
      value: card?.unusualExperinece,
    },{
      label: "Strangest Habit I Have",
      value: card?.strangeHabits,
    },
  ];

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

  function toggleInterests() {
    if (interest == true) {
      setInterest(false);
    } else {
      setInterest(true);
    }
  }

  function toggleOthers() {
    if (others == true) {
      setOthers(false);
    } else {
      setOthers(true);
    }
  }

  function toggleProfessional() {
    if (professionals == true) {
      setProfessionals(false);
    } else {
      setProfessionals(true);
    }
  }

  return (
    <>
      <div className="relative flex flex-col w-full bg-blue-500 py-4 rounded-br-[4rem] tab:pt-[2rem] rounded-bl-[3rem] z-10 shadow-xl">
        <div className="flex justify-start font-Kanit pl-10 py-4">
          <p className="font-bold text-white">Individual Data</p>
        </div>
        <div className="flex justify-start text-5xl font-bold mt-3 mb-10">
          <h1 className="font-Philosopher pl-10 text-white">{card?.name}</h1>
        </div>
      </div>

      <div className="relative flex justify-center lg:mb-2 lg:rounded-b-xl bg-blue-200 font-Kanit -mt-[4rem] lg:pb-[7rem]">
        <div className="flex flex-col w-[90%] mt-[6rem]">
          <div className="flex flex-col w-full py-2">
            <div className="flex flex-col justify-start">
              <label htmlFor="name" className="text-xl font-Philosopher">
                Name:
              </label>
              <input
                type="text"
                className="border-2 border-slate-200 w-full rounded-lg pl-3 py-1 text-lg shadow-xl font-bold mt-2"
                defaultValue={card?.name}
                readOnly
              />
            </div>
            <div className="flex flex-col w-full py-10">
              <div className="flex justify-center">
                <div className="w-[90%] bg-white flex flex-col items-center py-4 rounded-2xl shadow-2xl">
                  <div className="w-[80%] flex justify-center mt-2">
                    <div className="flex flex-row w-full gap-2">
                      <div className="basis-1/5 flex justify-center border-2 rounded-full w-[3.1rem] h-[3.1rem] items-center">
                        <FaInstagram className="p-1 w-[2rem] h-[2rem]" />
                      </div>
                      <div className="basis-1/5 flex justify-center border-2 rounded-full w-[3.1rem] h-[3.1rem] items-center">
                        <FaYoutube className="p-1 w-[2rem] h-[2rem]" />
                      </div>
                      <div className="basis-1/5 flex justify-center border-2 rounded-full w-[3.1rem] h-[3.1rem] items-center">
                        <FaSpotify className="p-1 w-[2rem] h-[2rem]" />
                      </div>
                      <div className="basis-1/5 flex justify-center border-2 rounded-full w-[3.1rem] h-[3.1rem] items-center">
                        <FaDiscord className="p-1 w-[2rem] h-[2rem]" />
                      </div>
                      <div className="basis-1/5 flex justify-center border-2 rounded-full w-[3.1rem] h-[3.1rem] items-center">
                        <FaXTwitter className="p-1 w-[2rem] h-[2rem]" />
                      </div>
                    </div>
                  </div>

                  <div className="w-[80%] border-2 border-slate-200 mt-6  py-2 rounded-full shadow-lg">
                    <button
                      className="w-full px-4 border-none flex flex-row"
                      onClick={toggleLifestyle}
                      type="button"
                    >
                      <div className="flex flex-row w-full">
                        <div className="basis-1/5 flex items-center justify-center">
                          <FcBriefcase className="w-[2rem] h-[2rem]" />
                        </div>
                        <div className="basis-3/5 flex justify-start items-center font-Kanit">
                          <p className="pl-2 text-sm font-bold pt-1">
                            Lifestyle
                          </p>
                        </div>
                        <div className="basis-1/5 flex justify-end items-center">
                          <GrLinkNext className="w-[1.5rem] h-[1.5rem]" />
                        </div>
                      </div>
                    </button>
                  </div>
                  {lifestyles ? (
                      <div
                        id="dropdown"
                        className="relative bg-slate-400 divide-gray-100 rounded-lg shadow-lg w-[98%] dark:bg-gray-700 py-2 mt-2 flex justify-center"
                      >
                        <ul
                          className=" text-sm text-gray-700 dark:text-gray-200"
                          aria-labelledby="dropdownDefaultButton"
                        >
                          {lifestyles && (
                            <div className="flex flex-col space-y-2">
                              {lifestyless.map((life, idx) => (
                                <div
                                  key={idx}
                                  className="flex flex-row justify-center items-center gap-2"
                                >
                                  <div className="basis-1/3 flex justify-center items-center text-lg text-white">
                                    <label htmlFor="" className="">
                                      {life.label}
                                    </label>
                                  </div>
                                  <div className="basis-2/3 px-4">
                                    <input
                                      type="text"
                                      className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600"
                                      // readOnly
                                      disabled
                                      value={life?.value}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </ul>
                      </div>
                    ) : null}

                  <div className="w-[80%] border-2 border-slate-200 mt-3 py-2 rounded-3xl shadow-lg">
                    <div className="relative">
                      <button
                        className="w-full px-4 border-none flex flex-row"
                        onClick={toggleFavs}
                        type="button"
                      >
                        <div className="flex flex-row w-full">
                          <div className="basis-1/5 flex items-center justify-center">
                            <FcBusinessContact className="w-[2rem] h-[2rem]" />
                          </div>
                          <div className="basis-3/5 flex justify-start items-center font-Kanit">
                            <p className="pl-2 text-sm font-bold pt-1">
                              Favourites
                            </p>
                          </div>
                          <div className="basis-1/5 flex justify-end items-center">
                            <GrLinkNext className="w-[1.5rem] h-[1.5rem]" />
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                  {fav ? (
                    <div
                      id="dropdown"
                      className="relative bg-slate-400 divide-gray-100 rounded-lg shadow-lg w-[98%] dark:bg-gray-700 mt-2"
                    >
                      <ul
                        className="text-sm text-gray-200 dark:text-gray-200"
                        aria-labelledby="dropdownDefaultButton"
                      >
                          <div className="flex flex-col space-y-2">
                            {favourites.map((favourites, idx) => (
                              <div
                                key={idx}
                                className="flex flex-row justify-center items-center gap-2"
                              >
                                <div className="basis-1/3 flex justify-center items-center text-lg">
                                  <label htmlFor="" className="pl-2">
                                    {favourites.label}
                                  </label>
                                </div>
                                <div className="basis-2/3 px-4">
                                  <input
                                    type="text"
                                    className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600"
                                    readOnly
                                    defaultValue={favourites.value}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                      </ul>
                    </div>
                  ) : null}

                  <div className="w-[80%] border-2 border-slate-200 mt-3 py-2 rounded-3xl shadow-lg">
                    <div className="relative">
                      <button
                        className="w-full px-4 border-none flex flex-row"
                        onClick={toggleMisc}
                        type="button"
                      >
                        <div className="flex flex-row w-full">
                          <div className="basis-1/5 flex items-center justify-center">
                            <FcCloth className="w-[2rem] h-[2rem]" />
                          </div>
                          <div className="basis-3/5 flex justify-start items-center font-Kanit">
                            <p className="pl-2 text-sm font-bold pt-1">
                              Miscellaneous
                            </p>
                          </div>
                          <div className="basis-1/5 flex justify-end items-center">
                            <GrLinkNext className="w-[1.5rem] h-[1.5rem]" />
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                  {misc ? (
                      <div
                        id="dropdown"
                        className="relative bg-slate-400 divide-gray-100 rounded-lg shadow w-[98%] dark:bg-gray-700 mt-2"
                      >
                        <ul
                          className=" text-sm text-gray-200 dark:text-gray-200"
                          aria-labelledby="dropdownDefaultButton"
                        >
                          {misc && (
                            <div className="flex flex-col space-y-2">
                              {miscellaneouss.map((misce, idx) => (
                                <div
                                  key={idx}
                                  className="flex flex-row justify-center items-center gap-2"
                                >
                                  <div className="basis-1/3 flex justify-start items-center text-lg">
                                    <label htmlFor="" className="pl-2">
                                      {misce.label}
                                    </label>
                                  </div>
                                  <div className="basis-2/3 px-4">
                                    <input
                                      type="text"
                                      className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600"
                                      readOnly
                                      defaultValue={misce.value}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </ul>
                      </div>
                    ) : null}

                  <div className="w-[80%] border-2 border-slate-200 mt-3 py-2 rounded-3xl shadow-lg">
                    <button
                      className="w-full px-4 border-none flex flex-row"
                      onClick={toggleInterests}
                      type="button"
                    >
                      <div className="flex flex-row w-full">
                        <div className="basis-1/5 flex items-center justify-center">
                          <FcComboChart className="w-[2rem] h-[2rem]" />
                        </div>
                        <div className="basis-3/5 flex justify-start items-center font-Kanit">
                          <p className="pl-2 text-sm font-bold pt-1">
                            Interests & Activities
                          </p>
                        </div>
                        <div className="basis-1/5 flex justify-end items-center">
                          <GrLinkNext className="w-[1.5rem] h-[1.5rem]" />
                        </div>
                      </div>
                    </button>
                  </div>
                  {interest ? (
                      <div
                        id="dropdown"
                        className="relative bg-slate-400 divide-gray-100 rounded-lg shadow w-[98%] dark:bg-gray-700 mt-2"
                      >
                        <ul
                          className=" text-sm text-gray-200 dark:text-gray-200"
                          aria-labelledby="dropdownDefaultButton"
                        >
                          {interest && (
                            <div className="flex flex-col space-y-2">
                              {interestss.map((int, idx) => (
                                <>
                                <div
                                  key={idx}
                                  className="flex flex-row justify-center items-center gap-2 py-1"
                                >
                                  <div className="basis-1/3 flex justify-start items-center text-lg">
                                    <label htmlFor="" className="pl-2">
                                      {int.label}
                                    </label>
                                  </div>
                                  <div className="basis-2/3 px-4">
                                    <input
                                      type="text"
                                      className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600"
                                      readOnly
                                      defaultValue={int.value}
                                    />
                                  </div>
                                  
                                </div>
                                </>
                              ))}
                            </div>
                          )}
                        </ul>
                      </div>
                    ) : null}

                  <div className="w-[80%] border-2 border-slate-200 mt-3 py-2 rounded-3xl shadow-lg">
                    <button
                      className="w-full px-4 border-none flex flex-row"
                      onClick={toggleProfessional}
                      type="button"
                    >
                      <div className="flex flex-row w-full">
                        <div className="basis-1/5 flex items-center justify-center">
                          <FcDataProtection className="w-[2rem] h-[2rem]" />
                        </div>
                        <div className="basis-3/5 flex justify-start items-center font-Kanit">
                          <p className="pl-2 text-sm font-bold pt-1">
                            Professional Details
                          </p>
                        </div>
                        <div className="basis-1/5 flex justify-end items-center">
                          <GrLinkNext className="w-[1.5rem] h-[1.5rem]" />
                        </div>
                      </div>
                    </button>
                  </div>
                  {professionals ? (
                      <div
                        id="dropdown"
                        className="relative bg-slate-400 divide-gray-100 rounded-lg shadow w-[98%] dark:bg-gray-700 mt-2"
                      >
                        <ul
                          className=" text-sm text-gray-200 dark:text-gray-200"
                          aria-labelledby="dropdownDefaultButton"
                        >
                          {professionals && (
                            <div className="flex flex-col space-y-2">
                              {professionalDetails.map((prof, idx) => (
                                <>
                                <div
                                  key={idx}
                                  className="flex flex-row justify-center items-center gap-2 py-1"
                                >
                                  <div className="basis-1/3 flex justify-start items-center text-lg">
                                    <label htmlFor="" className="pl-2">
                                      {prof.label}
                                    </label>
                                  </div>
                                  <div className="basis-2/3 px-4">
                                    <input
                                      type="text"
                                      className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600"
                                      readOnly
                                      defaultValue={prof.value}
                                    />
                                  </div>
                                </div>
                                </>
                              ))}
                            </div>
                          )}
                          <div className="flex flex-row justify-center items-center gap-2 py-1">
                                <div className="basis-1/3 flex justify-start items-center text-lg">
                                    <label htmlFor="" className="pl-2">
                                      Education Background
                                    </label>
                                  </div>
                                  <div className="basis-2/3 px-4">
                                    <input
                                      type="text"
                                      className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600"
                                      readOnly
                                      defaultValue={card?.education}
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-row justify-center items-center gap-2 py-1">
                                <div className="basis-1/3 flex justify-start items-center text-lg">
                                    <label htmlFor="" className="pl-2">
                                      Professional Skills
                                    </label>
                                  </div>
                                  <div className="basis-2/3 px-4">
                                    <input
                                      type="text"
                                      className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600"
                                      readOnly
                                      defaultValue={card?.skills}
                                    />
                                  </div>
                                </div>
                        </ul>
                      </div>
                    ) : null}

                  <div className="w-[80%] border-2 border-slate-200 mt-3 py-2 rounded-3xl shadow-lg">
                    <button
                      className="w-full px-4 border-none flex flex-row"
                      onClick={toggleOthers}
                      type="button"
                    >
                      <div className="flex flex-row w-full">
                        <div className="basis-1/5 flex items-center justify-center">
                          <FcAbout className="w-[2rem] h-[2rem]" />
                        </div>
                        <div className="basis-3/5 flex justify-start items-center font-Kanit">
                          <p className="pl-2 text-sm font-bold pt-1">Others</p>
                        </div>
                        <div className="basis-1/5 flex justify-end items-center">
                          <GrLinkNext className="w-[1.5rem] h-[1.5rem]" />
                        </div>
                      </div>
                    </button>
                  </div>
                  {others ? (
                      <div
                        id="dropdown"
                        className="relative bg-slate-400 divide-gray-100 rounded-lg shadow w-[98%] dark:bg-gray-700 mt-2"
                      >
                        <ul
                          className=" text-sm text-gray-200 dark:text-gray-200"
                          aria-labelledby="dropdownDefaultButton"
                        >
                          {others && (
                            <div className="flex flex-col space-y-2">
                              {additionalData.map((add, idx) => (
                                <>
                                <div
                                  key={idx}
                                  className="flex flex-row justify-center items-center gap-2 py-1"
                                >
                                  <div className="basis-1/3 flex justify-start items-center text-lg">
                                    <label htmlFor="" className="pl-2">
                                      {add.label}
                                    </label>
                                  </div>
                                  <div className="basis-2/3 px-4">
                                    <input
                                      type="text"
                                      className="block py-2.5 px-0 w-full text-base font-Kanit bg-transparent border-0 border-b-2 border-black appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600"
                                      readOnly
                                      defaultValue={add.value}
                                    />
                                  </div>
                                </div>
                                </>
                              ))}
                            </div>
                          )}
                        </ul>
                      </div>
                    ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalComponent;
