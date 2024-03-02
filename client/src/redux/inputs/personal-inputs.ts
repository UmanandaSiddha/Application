export const phNum = [
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
    }
] as const;

export const emailAdd = [
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
    }
] as const;



export const homeTown = [
    {
        name: "hometown",
        label: "Home Town",
        text: "Enter your home town",
    },
    {
        name: "currentcity",
        label: "Current City",
        text: "Enter your current city",
    },
    {
        name: "languages",
        label: "Languages Spoken",
        text: "Enter Languages Spoken",
    },
    {
        name: "favmusic",
        label: "Favorite Music/Artists/Genres",
        text: "Enter Favorite Music/Artists/Genres",
    },
    {
        name: "favcolor",
        label: "Favorite Color(s)",
        text: "Enter your Favorite Color(s)",
    },
    {
        name: "favcity",
        label: "Favorite City/Cities",
        text: "Enter your Favorite City/Cities",
    },
    {
        name: "dreamtravel",
        label: "Dream Travel Destinations",
        text: "Enter your Dream Travel Destinations",
    },
    {
        name: "favseason",
        label: "Favorite Season",
        text: "Enter your Favorite Season",
    },
    {
        name: "uniqueskills",
        label: "Unusual or Unique Skills",
        text: "Enter your Unusual or Unique Skills",
    },
    {
        name: "favcuisine",
        label: "Favorite Cuisine/Food",
        text: "Enter your Favorite Cuisine/Food",
    },
    {
        name: "prefbeve",
        label: "Preferred Beverages",
        text: "Enter your Preferred Beverages",
    },
] as const;

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
    }
] as const;

export const seleInp = [
    {
        name: "prefmode",
        label: "Preferred Mode of Travel",
        text: "Enter your Preferred Mode of Travel",
        options: [
            "Airplane",
            "Train",
            "Cars",
            "Cruise"
        ]
    },
    {
        name: "petlover",
        label: "Pet Lover?",
        text: "Are you a Pet Lover?",
        options: [
            "Yes",
            "No"
        ]
    },
    {
        name: "party",
        label: "Party Enthusiast?",
        text: "Are you a Party Enthusiast?",
        options: [
            "Yes",
            "No"
        ]
    },
    {
        name: "smoker",
        label: "Smoker?",
        text: "Are you a Smoker?",
        options: [
            "Yes",
            "No"
        ]
    },
    {
        name: "martial",
        label: "Marital Status",
        text: "Marital Status",
        options: [
            "Single",
            "In a relationship",
            "Engaged",
            "Married",
        ]
    },
    {
        name: "relation",
        label: "Relationship Status",
        text: "Relationship Status",
        options: [
            'Just exploring',
            'Committed',
            "It's complicated",
            'Single and happy',
        ]
    },
    {
        name: "fitness",
        label: "Fitness Routine/Hobbies",
        text: "Fitness Routine/Hobbies",
        options: [
            'Daily fitness regime',
            'A few times a week',
            'Sometimes when I can',
            'Not much into fitness',
        ]
    },
    {
        name: "morning",
        label: "Morning/Night Person",
        text: "Morning or Night Person",
        options: [
            'Morning person',
            'Night owl',
            'Somewhere in between',
            'Depends on the day',
        ]
    },
    {
        name: "health",
        label: "Health Preferences",
        text: "Any Health or Dietary Preferences?",
        options: [
            'Vegetarian',
            'Vegan',
            'Omnivore',
        ]
    },
    {
        name: "sleeping",
        label: "Sleeping Habits",
        text: "Sleeping Habits",
        options: [
            'Early Riser',
            'Night Owl',
            'Somewhere in between',
            'Varies based on the day',
        ]
    },
    {
        name: "genre",
        label: "Favorite Movies/TV Shows/Genres",
        text: "Favorite Movies/TV Shows/Genres",
        options: [
            'Action',
            'Comedy',
            'Drama',
            'Sci-Fi/Fantasy',
            'Documentary',
        ]
    },
    {
        name: "outdoor",
        label: "Sports or Outdoor Activities",
        text: "Sports or Outdoor Activities",
        options: [
            'Basketball',
            'Tennis',
            'Hiking',
            'Cycling',
            'Swimming',
        ]
    },
    {
        name: "artistic",
        label: "Artistic Pursuits/Hobbies",
        text: "Artistic Pursuits/Hobbies",
        options: [
            'Drawing/Painting',
            'Photography',
            'Writing',
            'Crafts',
            'Music',
        ]
    },
    {
        name: "gamingpref",
        label: "Gaming Preferences",
        text: "Gaming Preferences",
        options: [
            'Action',
            'Adventure',
            'Puzzle',
            'Role-playing',
            'Simulation',
        ]
    },
    {
        name: "collecting",
        label: "Collecting Hobby or Interest",
        text: "Collecting Hobby or Interest",
        options: [
            'Coins/Stamps',
            'Comics/Figurines',
            'Antiques',
            'Trading cards',
            'Memorabilia',
        ]
    },
    {
        name: "coffee",
        label: "Coffee or Tea Lover",
        text: "Coffee or Tea Lover",
        options: [
            'Coffee addict',
            'Tea enthusiast',
            'Both!',
            'None, prefer other beverages',
        ]
    },
    {
        name: "cooking",
        label: "Cooking Skills",
        text: "Cooking Skills",
        options: [
            'Novice',
            'Intermediate',
            'Expert',
        ]
    },
    {
        name: "spiritual",
        label: "Spiritual or Religious Beliefs",
        text: "Spiritual or Religious Beliefs",
        options: [
            'Religious',
            'Spiritual',
            'Atheist',
            'Agnostic',
        ]
    },
    {
        name: "corevalue",
        label: "Core Values",
        text: "Core Values",
        options: [
            'Honesty',
            'Respect',
            'Kindness',
            'Integrity',
        ]
    },
    {
        name: "philosophy",
        label: "Philosophies I Believe In",
        text: "Philosophies I Believe In",
        options: [
            'Stoicism',
            'Existentialism',
            'Humanism',
            'Nihilism',
        ]
    },
    {
        name: "environment",
        label: "Environmental/Social Causes I Support",
        text: "Environmental/Social Causes I Support",
        options: [
            'Environmental Conservation',
            'Human Rights',
            'Animal Welfare',
            'Education',
        ]
    },
] as const;

export const seloInp = [
    {
        name: "occupation",
        label: "Current Occupation/Industry",
        text: "Enter Current Occupation/Industry",
        options: [
            'Technology',
            'Healthcare',
            'Education',
            'Finance',
            'Arts/Entertainment',
        ]
    },
    {
        name: "aspiration",
        label: "Career Aspirations/Goals",
        text: "Enter Career Aspirations/Goals",
        options: [
            'Leadership',
            'Entrepreneurship',
            'Creativity',
            'Advancement',
        ]
    },
    {
        name: "background",
        label: "Education Background/Degrees",
        text: "Enter Education Background/Degrees",
        options: [
            "High School",
            "Bachelor's Degree",
            "Master's Degree",
            "Doctorate",
        ]
    },
    {
        name: "expertise",
        label: "Professional Skills or Expertise",
        text: "Enter Professional Skills or Expertise",
        options: [
            'Communication',
            'Problem-solving',
            'Teamwork',
            'Leadership',
        ]
    },
] as const;

export const textAr = [
    {
        name: "anyother",
        label: "Any Other Interests or Specific Details",
        text: "Any Other Interests or Specific Details",
    },
    {
        name: "futuregoal",
        label: "Future Goals or Bucket List Items",
        text: "Future Goals or Bucket List Items",
    },
    {
        name: "learning",
        label: "Things I'm Currently Learning/Exploring",
        text: "Things I'm Currently Learning/Exploring",
    },
    {
        name: "experience",
        label: "Most Unusual Experience or Event I've Been Part Of",
        text: "Most Unusual Experience or Event I've Been Part Of",
    },
    {
        name: "habit",
        label: "Strangest Habit or Quirk I Have",
        text: "Strangest Habit or Quirk I Have",
    },
] as const;

