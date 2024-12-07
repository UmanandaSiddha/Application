export const perosnalName = [{ name: "name", type: "text" }];

export const aboutPersonal = [{ name: "aboutMe", type: "text" }];

export const contactInfo = [
    { name: "mobileNumber", label: "Mobile", text: "Enter mobile phone number", type: "tel" },
    { name: "homeNumber", label: "Home", text: "Enter home phone number", type: "tel" },
    { name: "workNumber", label: "Work", text: "Enter work phone number", type: "tel" },
    { name: "otherNumber", label: "Other", text: "Enter any other phone number", type: "tel" }
];

export const emailInfo = [
    { name: "personalEmail", label: "Personal", text: "Enter Personal Email Address", type: "text" },
    { name: "workEmail", label: "Work", text: "Enter Work Email Address", type: "text" },
    { name: "otherEmail", label: "Other", text: "Enter any other email address", type: "text" },
];

export const socials = [
    { name: "", label: "Instagram", text: "Enter Your Instagram Profile", type: "text" },
    { name: "", label: "Youtube", text: "Enter Your Youtube Profile", type: "text" },
    { name: "", label: "Facebook", text: "Enter Your Facebook Profile", type: "text" },
    { name: "", label: "Discord", text: "Enter Your Discord Profile", type: "text" },
    { name: "", label: "X", text: "Enter Your X Profile", type: "text" },
];

export const lifestyle = [
    { name: "dateOfBirth", label: "Date of Birth", text: "Enter your Date of Birth", type: "date" },
    { name: "homeTown", label: "Hometown", text: "Enter your Hometown", type: "text" },
    { name: "currentCity", label: "Current City", text: "Enter your Current City", type: "text" },
    { name: "languages", label: "Languages", text: "Enter languages spoken", type: "text" },
];

export const Favourites = [
    { name: "music", label: "Favourite Music", text: "Enter Favourite Music/Artists", type: "text" },
    { name: "color", label: "Favourite Color(s)", text: "Enter Favourite Color(s)", type: "text" },
    { name: "city", label: "Favourite City", text: "Enter Favourite City", type: "text" },
    { name: "travelDestination", label: "Favourite Destination", text: "Enter Favourite Destinations", type: "text" },
    { name: "season", label: "Favourite Season", text: "Enter Favourite Season", type: "text" },
    { name: "uniqueSkills", label: "Unique Skills", text: "Enter Unique Skills", type: "text" },
    { name: "cuisine", label: "Favourite Cuisine", text: "Enter Favourite Cuisine/Food", type: "text" },
    { name: "beverage", label: "Favourite Beverage", text: "Enter Beverage", type: "text" },
];

export const miscellaneous = [
    { name: "petLover", label: "Pet Lover?", type: "text", text: "Enter Yes/No", options: ["Yes", "No"] },
    { name: "partyEnthusiast", label: "Party Enthusiast?", type: "text", text: "Enter Yes/No", options: ["Yes", "No"] },
    { name: "smoker", label: "Smoker?", text: "Enter Yes/No", type: "text", options: ["Yes", "No"] },
    { name: "maritalStatus", label: "Marital Status?", type: "text", text: "Enter Yes/No", options: ["Single", "In a relationship", "Engaged", "Married"] },
    { name: "relationshipStatus", label: "Relationship?", type: "text", text: "Enter Yes/No", options: ["Just Exploring", "Committed", "It's complicated", "Single and Happy"] },
    { name: "morningPerson", label: "Morning/Night Person?", type: "text", text: "Enter Yes/No", options: ["Morning person", "Night Owl", "Somewhere in between", "Depends on the day"] },
    { name: "sleepingHabit", label: "Sleeping Habits?", type: "text", text: "Enter Sleeping Habits", options: ["Early Riser", "Night Owl", "Somewhere in between", "Depends on the day"] },
    { name: "fitnessRoutine", label: "Fitness Routine", type: "text", text: "Enter Fitness Routine", options: ["Daily fitness regime", "A few times a week", "Sometimes when I can", "Not much into fitness"] },
    { name: "diet", label: "Dietary Preferences", type: "text", text: "Enter Dietary Preferences", options: ["Vegetarian", "Vegan", "Omnivore", "Other"] },
];

export const motto = [
    { name: "inspirationalQuotes", label: "Inspirational", type: "text", text: "Enter any Inspirational Quote" },
    { name: "funnyQuotes", label: "Funny", type: "text", text: "Enter any Funny Quote" },
    { name: "motivationalQuotes", label: "Motivational", type: "text", text: "Enter any Motivational Quote" },
    { name: "otherQuotes", label: "Other", type: "text", text: "Enter any Other Quote" },
];

export const interests = [
    { name: "travelMode", label: "Travel", multiple: true, type: "text", text: "Enter your Preferred Mode of Travel", options: ["Airplane", "Train", "Cars", "Cruise", "Other"] },
    { name: "genre", label: "Movies/ TV Shows", multiple: true, type: "text", text: "Favorite Movies/TV Shows/Genres", options: ["Action", "Comedy", "Drama", "Sci-Fi/Fantasy", "Documentary", "Other"] },
    { name: "sports", label: "Sports Activites", multiple: true, type: "text", text: "Sports or Outdoor Activities", options: ["Basketball", "Tennis", "Hiking", "Cycling", "Swimming", "Other"] },
    { name: "artistisPursuits", label: "Artistic Hobbies", multiple: true, type: "text", text: "Artistic Pursuits/Hobbies", options: ["Drawing/Painting", "Photography", "Writing", "Crafts", "Music", "Other"] },
    { name: "gaming", label: "Gaming Preferences", multiple: true, type: "text", text: "Gaming Preferences", options: ["Action", "Adventure", "Puzzle", "Role-playing", "Simulation", "Other"] },
    { name: "collectignHobby", label: "Collecting Hobby /Interest", multiple: true, type: "text", text: "Collecting Hobby or Interest", options: ["Coins/Stamps", "Comics/Figurines", "Antiques", "Trading cards", "Memorabilia", "Other"] },
    { name: "coffee", label: "Coffee or Tea?", type: "text", text: "Coffee or Tea Lover", options: ["Coffee addict", "Tea enthusiast", "Both!", "None, prefer other beverages"] },
    { name: "cookingSkills", label: "Cooking Skills", type: "text", text: "Cooking Skills", options: ["Novice", "Intermediate", "Expert"] },
];

export const sepPersonal = [
    { name: "spiritual", label: "Beliefs", type: "text", text: "Spiritual or Religious Beliefs", options: ["Religious", "Spiritual", "Atheist", "Agnostic", "Other"] },
    { name: "core", label: "Core Values", multiple: true, type: "text", text: "Core Values", options: ["Honesty", "Respect", "Kindness", "Integrity", "Other"] },
    { name: "philosophy", label: "Philosophies", type: "text", text: "Philosophies I Believe In", options: ["Stoicism", "Existentialism", "Humanism", "Nihilism", "Other"] },
    { name: "socialCause", label: "Causes I Support", multiple: true, type: "text", text: "Environmental/Social Causes I Support", options: ["Environmental Conservation", "Human Rights", "Animal Welfare", "Education", "Other"] },
]

export const professional = [
    { name: "currentOcupation", label: "Current Occupation", type: "text", text: "Enter Current Occupation/Industry", options: ["Technology", "Healthcare", "Education", "Finance", "Arts/Entertainment", "Other"] },
    { name: "careerAspiation", label: "Career Aspiation", type: "text", text: "Enter Career Aspirations/Goals", options: ["Leadership", "Entrepreneurship", "Creativity", "Advancement", "Other"] },
    { name: "education", label: "Education Background", type: "text", text: "Enter Education Background/Degrees", options: ["High School", "Bachelor's Degree", "Master's Degree", "Doctorate", "Other"] },
    { name: "skills", label: "Professional Skills", multiple: true, type: "text", text: "Enter Professional Skills or Expertise", options: ["Communication", "Problem-solving", "Teamwork", "Leadership", "Other"] },
];

export const additionalInfo = [
    { name: "globalIssues", label: "Global Issues", type: "text", text: "Enter Global Issues" },
    { name: "weirdBelief", label: "Weird Belief", type: "text", text: "Enter Weird Belief" },
    { name: "otherInterests", label: "Other Interests", type: "text", text: "Any Other Interests" },
    { name: "futureGoals", label: "Future Goals", type: "text", text: "Future Goals" },
    { name: "current", label: "Currently Learning", type: "text", text: "Things I'm Learning" },
    { name: "unusualExperinece", label: "Unusual Experience", type: "text", text: "Unusual Experience" },
    { name: "strangeHabits", label: "Strangest Habits", type: "text", text: "Strangest Habit I Have" },
];

export const otherInputs = [
    { name: "spiritual_Other" },
    { name: "core_Other" },
    { name: "philosophy_Other" },
    { name: "socialCause_Other" },
    { name: "travelMode_Other" },
    { name: "genre_Other" },
    { name: "sports_Other" },
    { name: "artistisPursuits_Other" },
    { name: "gaming_Other" },
    { name: "collectignHobby_Other" },
    { name: "coffee_Other" },
    { name: "cookingSkills_Other" },
    { name: "currentOcupation_Other" },
    { name: "careerAspiation_Other" },
    { name: "education_Other" },
    { name: "skills_Other" },
    { name: "diet_Other" },
];