

const Same = ({ personal }: any) => {
  return (
    <div className="font-Kanit w-[280px]">
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Personal Id:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?._id}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Name:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.name}</div>
      </div>
      <div className="flex justify-center items-center py-2">
        <span className="text-xl underline font-bold">Contact Information:</span>
      </div>
      <div className="flex justify-center items-center py-1">
        <span className="text-lg underline font-bold">Phone Numbers:</span>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Mobile Number:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.contactInfo.phoneNumber.mobile}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Home Number:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.contactInfo.phoneNumber.home}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Work Number:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.contactInfo.phoneNumber.work}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Other Number:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.contactInfo.phoneNumber.other}</div>
      </div>
      <div className="flex justify-center items-center py-1">
        <span className="text-lg underline font-bold">Email Address:</span>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Personal Email:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.contactInfo.emailAddress.personal}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Work Email:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.contactInfo.emailAddress.work}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Other Email:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.contactInfo.emailAddress.other}</div>
      </div>
      <div className="flex justify-center items-center py-2">
        <span className="text-xl underline font-bold">Social Media Links:</span>
      </div>
      {personal?.socialMedia.map((link: any, index: number) => (
        <div className="flex" key={index}>
          <div className="basis-1/2">
            <span className="font-semibold">
              {link.label}
            </span>
          </div>
          <div className="basis-1/2">
            <a href={link.name} target="blank">
             {link.name}
            </a>
          </div>
        </div>
      ))}
      <div className="flex justify-center items-center py-2">
        <span className="text-xl underline font-bold">About Me:</span>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Date of Birth:</span>{" "}
        </div>
        <div className="basis-1/2">{new Date(personal?.aboutMe.birth).toDateString()}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Home Town:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.aboutMe.homeTown}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Current City:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.aboutMe.currentCity}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Languages Spoken:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.preferences.languages}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Favourite Music/Artists/Genres:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.preferences.favmusic}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Favourite Color(s):</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.preferences.favcolor}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Favourite City/Cities:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.preferences.favcity}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Dream Travel Destinations:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.preferences.dreamtravel}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Favourite Season:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.preferences.favseason}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Unique Skills:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.preferences.uniqueSkills}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Favourite Cuisine:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.preferences.favcuisine}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Preferred beverages:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.preferences.prefbeve}</div>
      </div>
      <div className="flex justify-center items-center py-2">
        <span className="text-xl underline font-bold">Favourite Quotes/Mottos:</span>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Inspirational:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.preferences.quotes.inspirational}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Funny:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.preferences.quotes.funny}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Motivational:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.preferences.quotes.motivational}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Other:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.preferences.quotes.othermotto}</div>
      </div>
      <div className="flex pt-4 pb-1">
        <div className="basis-1/2">
          <span className="font-semibold">Current City:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.preferences.currentCity}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Preferred Mode of Travel:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.lifeStyle.prefmode}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Pet Lover:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.lifeStyle.petlover}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Party Enthusiast:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.lifeStyle.party}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Smoker:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.lifeStyle.smoker}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Marital Status:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.lifeStyle.marital}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Relationship Status:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.lifeStyle.relation}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Any Health or Dietary Preferences:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.lifeStyle.marital}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Sleeping Habits:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.lifeStyle.sleeping}</div>
      </div>
      <div className="flex justify-center items-center py-2">
        <span className="text-xl underline font-bold">Interests & Hobbies:</span>
      </div>
      <div className="flex py-2">
        <div className="basis-1/2">
          <span className="font-semibold">Favourite Movies/TV Shows/Genres:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.lifeStyle.genre}</div>
      </div>
      <div className="flex py-2">
        <div className="basis-1/2">
          <span className="font-semibold">Sports or Outdoor Activites:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.lifeStyle.outdoor}</div>
      </div>
      <div className="flex py-2">
        <div className="basis-1/2">
          <span className="font-semibold">Artistic Pursuits/Hobbies:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.lifeStyle.artistic}</div>
      </div>
      <div className="flex py-2">
        <div className="basis-1/2">
          <span className="font-semibold">Gaming Preferences:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.lifeStyle.gamingpref}</div>
      </div>
      <div className="flex py-2">
        <div className="basis-1/2">
          <span className="font-semibold">Collecting Hobby or Interest:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.lifeStyle.collecting}</div>
      </div>
      <div className="flex py-2">
        <div className="basis-1/2">
          <span className="font-semibold">Coffee or Tea Lover:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.lifeStyle.coffee}</div>
      </div>
      <div className="flex py-2">
        <div className="basis-1/2">
          <span className="font-semibold">Cooking Skills:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.lifeStyle.cookingSkills}</div>
      </div>
      <div className="flex py-2">
        <div className="basis-1/2">
          <span className="font-semibold">Spiritual or Religious Beliefs:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.lifeStyle.spiritual}</div>
      </div>
      <div className="flex py-2">
        <div className="basis-1/2">
          <span className="font-semibold">Core Values:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.lifeStyle.core}</div>
      </div>
      <div className="flex py-2">
        <div className="basis-1/2">
          <span className="font-semibold">Philosophies I believe in:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.lifeStyle.philosophy}</div>
      </div>
      <div className="flex py-2">
        <div className="basis-1/2">
          <span className="font-semibold">Environment/Social Causes I Support:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.lifeStyle.socialCause}</div>
      </div>
      <div className="flex py-2">
        <div className="basis-1/2">
          <span className="font-semibold">Opinions on Global Issues:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.beliefs.global}</div>
      </div>
      <div className="flex py-2">
        <div className="basis-1/2">
          <span className="font-semibold">Weirdest or Uncommon Belief I Hold:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.beliefs.weirdbelief}</div>
      </div>
      <div className="flex justify-center items-center py-2">
        <span className="text-xl underline font-bold">Professional Details:</span>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Current Occupation/Industry:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.professional.occupation}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Career Aspirations/Goals:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.professional.aspiration}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Education Background/Degrees:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.professional.education}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Professional Skills or Expertise:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.professional.skills}</div>
      </div>
      <div className="flex justify-center items-center py-2">
        <span className="text-xl underline font-bold">Additional Information:</span>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Any Other Interests or Specific Details:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.additional.otherInterests}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Future Goals or Bucket List Items:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.additional.futureGoals}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Things I'm currently Learning/Exploring:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.additional.current}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Most Unusual Experience or Event I've Been Part Of:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.additional.unusualExperinece}</div>
      </div>
      <div className="flex py-1">
        <div className="basis-1/2">
          <span className="font-semibold">Strangest Habit or Quirk I Have:</span>{" "}
        </div>
        <div className="basis-1/2">{personal?.additional.strangeHabits}</div>
      </div>
    </div>
  );
};

export default Same;
