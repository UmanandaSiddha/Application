export const contactInfo = [
    {
      name: "mobilephone",
      label: "Mobile",
      text: "Enter mobile phone number",
    },
    {
      name: "homephone",
      label: "Home",
      text: "Enter home phone number",
    },
    {
      name: "workphone",
      label: "Work",
      text: "Enter work phone number",
    },
    {
      name: "otherphone",
      label: "Other",
      text: "Enter any other phone number",
    },
  ] as const;
  
  export const emails = [
    {
      name: "personalemail",
      label: "Personal",
      text: "Enter Personal Email Address",
    },
    {
      name: "workemail",
      label: "Work",
      text: "Enter Work Email Address",
    },
    {
      name: "otheremail",
      label: "Other",
      text: "Enter any other email address",
    },
  ] as const;
  
  export const socials = [
    {
      name: "Instagram",
      label: "Instagram",
      text: "Enter Instagram Profile",
    },
    {
      name: "Youtube",
      label: "Youtube",
      text: "Enter Youtube Profile",
    },
    {
      name: "Spotify",
      label: "Spotify",
      text: "Enter Spotify Profile",
    },
    {
      name: "Discord",
      label: "Discord",
      text: "Enter Discord Profile",
    },
    {
      name: "X",
      label: "X",
      text: "Enter X Profile",
    },
  ];
  
  export const lifestyle = [
    {
      name: "dob",
      label: "Date of Birth",
      text: "Enter your Date of Birth",
    },
    {
      name: "hometown",
      label: "Hometown",
      text: "Enter your Hometown",
    },
    {
      name: "currentCity",
      label: "Current City",
      text: "Enter your Current City",
    },
    {
      name: "languages",
      label: "Languages",
      text: "Enter languages spoken",
    },
  ];
  
  export const Favourites = [
    {
      name: "favmusic",
      label: "Fav Music",
      text: "Enter Fav Music/Artists",
    },
    {
      name: "favcolor",
      label: "Fav Color(s)",
      text: "Enter Fav Color(s)",
    },
    {
      name: "favcity",
      label: "Fav City",
      text: "Enter Fav City",
    },
    {
      name: "dreamtravel",
      label: "Fav-Destination",
      text: "Enter Fav Destinations",
    },
    {
      name: "favseason",
      label: "Fav Season",
      text: "Enter Fav Season",
    },
    {
      name: "uniqueskills",
      label: "Unique Skills",
      text: "Enter Unique Skills",
    },
    {
      name: "favcuisine",
      label: "Fav Cuisine",
      text: "Enter Fav Cuisine/Food",
    },
  ] as const;
  
  export const miscellaneous = [
    {
      name: "petlover",
      label: "Pet Lover?",
      text: "Enter Yes/No",
      options: ["Yes", "No"],
    },
    {
      name: "party",
      label: "Party Enthusiast?",
      text: "Enter Yes/No",
      options: ["Yes", "No"],
    },
    {
      name: "smoker",
      label: "Smoker?",
      text: "Enter Yes/No",
      options: ["Yes", "No"],
    },
    {
      name: "marital",
      label: "Marital Status?",
      text: "Enter Yes/No",
      options: ["Single", "In a relationship", "Engaged", "Married"],
    },
    {
      name: "relation",
      label: "Relationship?",
      text: "Enter Yes/No",
      options: [
        "Just Exploring",
        "Committed",
        "It's complicated",
        "Single and Happy",
      ],
    },
    {
      name: "morning",
      label: "Morning/Night Person?",
      text: "Enter Yes/No",
      options: [
        "Morning person",
        "Night Owl",
        "Somewhere in between",
        "Depends on the day",
      ],
    },
    {
      name: "sleeping",
      label: "Sleeping Habits?",
      text: "Enter Sleeping Habits",
      options: [
        "Early Riser",
        "Night Owl",
        "Somewhere in between",
        "Depends on the day",
      ],
    },
    {
      name: "fitness",
      label: "Fitness Routine",
      options: [
        "Daily fitness regime",
        "A few times a week",
        "Sometimes when I can",
        "Not much into fitness"
      ]
    },
    {
      name: "diet",
      label: "Dietary Preferences",
      options: [
        "Vegetarian",
        "Vegan",
        "Omnivore",
        "Other"
      ]
    },
    {
      name: "reading",
      label: "Do you like reading?",
      text: "Enter Fav books/novels",
    },
  
  ];
  
  export const motto = [
    {
      name: "inspirationalmotto",
      label: "Inspirational",
      text: "Enter any Inspirational Quote",
    },
    {
      name: "funnymotto",
      label: "Funny",
      text: "Enter any Funny Quote",
    },
    {
      name: "motivationalmotto",
      label: "Motivational",
      text: "Enter any Motivational Quote",
    },
    {
      name: "othermotto",
      label: "Other",
      text: "Enter any Other Quote",
    },
  ] as const;
  
  export const interests = [
    {
      name: "prefmode",
      label: "Preferred Mode of Travel",
      text: "Enter your Preferred Mode of Travel",
      options: ["Airplane", "Train", "Cars", "Cruise", "Other"],
      customInput: {
        name: "prefOther",
        text: "Enter custom preference mode"
      }
    },
    {
      name: "genre",
      label: "Fav Movies/TV Shows",
      text: "Favorite Movies/TV Shows/Genres",
      options: ["Action", "Comedy", "Drama", "Sci-Fi/Fantasy", "Documentary", "Other"],
      customInput: {
        name: "genreOther",
        text: "Enter custom genre"
      }
    },
    {
      name: "outdoor",
      label: "Sports Activites",
      text: "Sports or Outdoor Activities",
      options: ["Basketball", "Tennis", "Hiking", "Cycling", "Swimming", "Other"],
      customInput: {
        name: "sportOther",
        text: "Enter custom activities"
      }
    },
    {
      name: "artistic",
      label: "Artistic Hobbies",
      text: "Artistic Pursuits/Hobbies",
      options: ["Drawing/Painting", "Photography", "Writing", "Crafts", "Music", "Other"],
      customInput: {
        name: "artOther",
        text: "Enter custom hobbies"
      }
    },
    {
      name: "gamingpref",
      label: "Gaming Preferences",
      text: "Gaming Preferences",
      options: ["Action", "Adventure", "Puzzle", "Role-playing", "Simulation", "Other"],
      customInput: {
        name: "gamingOther",
        text: "Enter custom preference"
      }
    },
    {
      name: "collecting",
      label: "Collecting Hobby/Interest",
      text: "Collecting Hobby or Interest",
      options: [
        "Coins/Stamps",
        "Comics/Figurines",
        "Antiques",
        "Trading cards",
        "Memorabilia",
        "Other"
      ],
      customInput: {
        name: "collectingOther",
        text: "Enter custom interest"
      }
    },
    {
      name: "coffee",
      label: "Coffee or Tea?",
      text: "Coffee or Tea Lover",
      options: [
        "Coffee addict",
        "Tea enthusiast",
        "Both!",
        "None, prefer other beverages",
      ],
      customInput: {
        name: "coffeeOther",
        text: "Enter custom coffee"
      }
    },
    {
      name: "cooking",
      label: "Cooking Skills",
      text: "Cooking Skills",
      options: ["Novice", "Intermediate", "Expert"],
      customInput: {
        name: "cookOther",
        text: "Enter custom skill"
      }
    },
  ] as const;
  
  export const values = [
    {
      name: "spiritual",
      label: "Spiritual or Religious Beliefs",
      text: "Spiritual or Religious Beliefs",
      options: ["Religious", "Spiritual", "Atheist", "Agnostic"],
    },
    {
      name: "corevalue",
      label: "Core Values",
      text: "Core Values",
      options: ["Honesty", "Respect", "Kindness", "Integrity"],
    },
    {
      name: "philosophy",
      label: "Philosophies I Believe In",
      text: "Philosophies I Believe In",
      options: ["Stoicism", "Existentialism", "Humanism", "Nihilism"],
    },
    {
      name: "environment",
      label: "Environmental/Social Causes I Support",
      text: "Environmental/Social Causes I Support",
      options: [
        "Environmental Conservation",
        "Human Rights",
        "Animal Welfare",
        "Education",
      ],
    },
  ];
  
  export const professional = [
    {
      name: "occupation",
      label: "Current Occupation",
      text: "Enter Current Occupation/Industry",
      options: [
        "Technology",
        "Healthcare",
        "Education",
        "Finance",
        "Arts/Entertainment",
        "Other"
      ],
      customInput: {
        name: "occupationOther",
        text: "Enter custom occupation"
      }
    },
    {
      name: "aspiration",
      label: "Career Goals",
      text: "Enter Career Aspirations/Goals",
      options: ["Leadership", "Entrepreneurship", "Creativity", "Advancement", "Other"],
      customInput: {
        name: "aspirationOther",
        text: "Enter custom aspiration"
      }
      
    }
  ] as const;
  
  export const background = {
    name: "background",
    label: "Education Background",
    text: "Enter Education Background/Degrees",
    options: [
      "High School",
      "Bachelor's Degree",
      "Master's Degree",
      "Doctorate",
      "Other"
    ],
    customInput: {
      name: "backgroundOther",
      text: "Enter custom background"
    }
  };
  
  export const expertise = {
    name: "expertise",
    label: "Professional Skills",
    text: "Enter Professional Skills or Expertise",
    options: ["Communication", "Problem-solving", "Teamwork", "Leadership", "Other"],
    customInput: {
      name: "expertiseOther",
      text: "Enter custom expertise"
    }
  }
  
  export const additionalInfo = [
    {
      name: "anyother",
      label: "Other Interests",
      text: "Any Other Interests",
    },
    {
      name: "futuregoal",
      label: "Future Goals",
      text: "Future Goals",
    },
    {
      name: "learning",
      label: "Currently Learning",
      text: "Things I'm Learning",
    },
    {
      name: "experience",
      label: "Most Unusual Experience",
      text: "Unusual Experience",
    },
    {
      name: "habit",
      label: "Strangest Habit I Have",
      text: "Strangest Habit I Have",
    },
  ] as const;
  