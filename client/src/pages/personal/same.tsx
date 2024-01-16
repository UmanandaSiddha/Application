const Same = ({ personal }: any) => {
    return (
        <div>
            <p>
                <span className="font-semibold">PersonalId:</span>{" "}
                {personal?._id}
            </p>
            <p>
                <span className="font-semibold">Name:</span>{" "}
                {personal?.name}
            </p>
            <p>
                <span className="font-semibold">Mobile Number:</span>{" "}
                {personal?.contactInfo.phoneNumber.mobile}
            </p>
            <p>
                <span className="font-semibold">Home Number:</span>{" "}
                {personal?.contactInfo.phoneNumber.home}
            </p>
            <p>
                <span className="font-semibold">Work Number:</span>{" "}
                {personal?.contactInfo.phoneNumber.work}
            </p>
            <p>
                <span className="font-semibold">Other Number:</span>{" "}
                {personal?.contactInfo.phoneNumber.other}
            </p>
            <p>
                <span className="font-semibold">Personal Email:</span>{" "}
                {personal?.contactInfo.emailAddress.personal}
            </p>
            <p>
                <span className="font-semibold">Work Email:</span>{" "}
                {personal?.contactInfo.emailAddress.work}
            </p>
            <p>
                <span className="font-semibold">Other Email:</span>{" "}
                {personal?.contactInfo.emailAddress.other}
            </p>
            <div className="my-3">
                <h1 className="text-lg font-semibold">Social Links</h1>
                {personal?.socialMedia.map((link: any, index: number) => (
                    <p key={index}><span className="font-semibold">{link.label}:</span> {link.name}</p>
                ))}
            </div>
            <p>
                <span className="font-semibold">About Me:</span>{" "}
                {personal?.aboutMe.aboutme}
            </p>
            <p>
                <span className="font-semibold">DOB:</span>{" "}
                {new Date(personal?.aboutMe.birth).toDateString()}
            </p>
            <p>
                <span className="font-semibold">Home Town:</span>{" "}
                {personal?.aboutMe.homeTown}
            </p>
            <p>
                <span className="font-semibold">Current City:</span>{" "}
                {personal?.aboutMe.currentCity}
            </p>
            <p>
                <span className="font-semibold">Preferences:</span>{" "}
            </p>
            <p>
                <span className="font-semibold">Languages Spoken:</span>{" "}
                {personal?.preferences.languages}
            </p>
            <p>
                <span className="font-semibold">Favourite Music/Artists/Genres:</span>{" "}
                {personal?.preferences.favmusic}
            </p>
            <p>
                <span className="font-semibold">Favourite Color(s):</span>{" "}
                {personal?.preferences.favcolor}
            </p>
            <p>
                <span className="font-semibold">Favourite City/Cities:</span>{" "}
                {personal?.preferences.favcity}
            </p>
            <p>
                <span className="font-semibold">Dream Travel Destinations:</span>{" "}
                {personal?.preferences.dreamtravel}
            </p>
            <p>
                <span className="font-semibold">Favourite Season:</span>{" "}
                {personal?.preferences.favseason}
            </p>
            <p>
                <span className="font-semibold">Unique Skills:</span>{" "}
                {personal?.preferences.uniqueSkills}
            </p>
            <p>
                <span className="font-semibold">Favourite Cuisine:</span>{" "}
                {personal?.preferences.favcuisine}
            </p>
            <p>
                <span className="font-semibold">Preferred beverages:</span>{" "}
                {personal?.preferences.prefbeve}
            </p>
            <p>
                <span className="font-semibold">Favourite Quotes/Mottos:</span>{" "}
            </p>
            <p>
                <span className="font-semibold">Inspirational:</span>{" "}
                {personal?.preferences.quotes.inspirational}
            </p>
            <p>
                <span className="font-semibold">Funny:</span>{" "}
                {personal?.preferences.quotes.funny}
            </p>
            <p>
                <span className="font-semibold">Motivational:</span>{" "}
                {personal?.preferences.quotes.motivational}
            </p>
            <p>
                <span className="font-semibold">Other:</span>{" "}
                {personal?.preferences.quotes.othermotto}
            </p>
            <p>
                <span className="font-semibold">Favourite City/Cities:</span>{" "}
                {personal?.preferences.currentCity}
            </p>
            <p>
                <span className="font-semibold">Preferred Mode of Travel:</span>{" "}
                {personal?.lifeStyle.prefmode}
            </p>
            <p>
                <span className="font-semibold">Pet Lover:</span>{" "}
                {personal?.lifeStyle.petlover}
            </p>
            <p>
                <span className="font-semibold">Party ENthusiast:</span>{" "}
                {personal?.lifeStyle.party}
            </p>
            <p>
                <span className="font-semibold">Smoker:</span>{" "}
                {personal?.lifeStyle.smoker}
            </p>
            <p>
                <span className="font-semibold">Marital Status:</span>{" "}
                {personal?.lifeStyle.marital}
            </p>
            <p>
                <span className="font-semibold">Relationship Status:</span>{" "}
                {personal?.lifeStyle.relation}
            </p>
            <p>
                <span className="font-semibold">Morning or Night person:</span>{" "}
                {personal?.lifeStyle.morning}
            </p>
            <p>
                <span className="font-semibold">Any Health or Dietary Preferences:</span>{" "}
                {personal?.lifeStyle.health}
            </p>
            <p>
                <span className="font-semibold">Sleeping Habits:</span>{" "}
                {personal?.lifeStyle.sleeping}
            </p>
            <p>
                <span className="font-semibold">Favourite Movies/TV Shows/Genres:</span>{" "}
                {personal?.lifeStyle.genre}
            </p>
            <p>
                <span className="font-semibold">Sports or Outdoor Activites:</span>{" "}
                {personal?.lifeStyle.outdoor}
            </p>
            <p>
                <span className="font-semibold">Artistic Pursuits/Hobbies:</span>{" "}
                {personal?.lifeStyle.artistic}
            </p>
            <p>
                <span className="font-semibold">Gaming Preferences:</span>{" "}
                {personal?.lifeStyle.gamingpref}
            </p>
            <p>
                <span className="font-semibold">Collecting Hobby or Interest:</span>{" "}
                {personal?.lifeStyle.collecting}
            </p>
            <p>
                <span className="font-semibold">Coffee or Tea Lover:</span>{" "}
                {personal?.lifeStyle.coffee}
            </p>
            <p>
                <span className="font-semibold">Cooking Skills:</span>{" "}
                {personal?.lifeStyle.cookingSkills}
            </p>
            <p>
                <span className="font-semibold">Spiritual or Religious Beliefs:</span>{" "}
                {personal?.lifeStyle.spiritual}
            </p>
            <p>
                <span className="font-semibold">Core Values:</span>{" "}
                {personal?.lifeStyle.core}
            </p>
            <p>
                <span className="font-semibold">Philosophies I believe in:</span>{" "}
                {personal?.lifeStyle.philosophy}
            </p>
            <p>
                <span className="font-semibold">Environment/Social Causes I Support:</span>{" "}
                {personal?.lifeStyle.socialCause}
            </p>
            <p>
                <span className="font-semibold">Opinions on Global Issues:</span>{" "}
                {personal?.beliefs.global}
            </p>
            <p>
                <span className="font-semibold">Weirdest or Uncommon Belief I Hold:</span>{" "}
                {personal?.beliefs.weirdbelief}
            </p>
            <p>
                <span className="font-semibold">Current Occupation/Industry:</span>{" "}
                {personal?.professional.occupation}
            </p>
            <p>
                <span className="font-semibold">Career Aspirations/Goals:</span>{" "}
                {personal?.professional.aspiration}
            </p>
            <p>
                <span className="font-semibold">Education Background/Degrees:</span>{" "}
                {personal?.professional.education}
            </p>
            <p>
                <span className="font-semibold">Professional Skills or Expertise:</span>{" "}
                {personal?.professional.skills}
            </p>
            <p>
                <span className="font-semibold">Any Other Interests or Specific Details:</span>{" "}
                {personal?.additional.otherInterests}
            </p>
            <p>
                <span className="font-semibold">Future Goals or Bucket List Items:</span>{" "}
                {personal?.additional.futureGoals}
            </p>
            <p>
                <span className="font-semibold">Things I'm currently Learning/Exploring:</span>{" "}
                {personal?.additional.current}
            </p>
            <p>
                <span className="font-semibold">Most Unusual Experience or Event I've Been Part Of:</span>{" "}
                {personal?.additional.unusualExperinece}
            </p>
            <p>
                <span className="font-semibold">Strangest Habit or Quirk I Have:</span>{" "}
                {personal?.additional.strangeHabits}
            </p>
        </div>
    )
}

export default Same;