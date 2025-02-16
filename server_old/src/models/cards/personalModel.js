import mongoose from "mongoose";

const personalSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Enter Individual Name"],
        },
        mobileNumber: {
            type: String,
            default: ""
        },
        homeNumber: {
            type: String,
            default: ""
        },
        workNumber: {
            type: String,
            default: ""
        },
        otherNumber: {
            type: String,
            default: ""
        },
        personalEmail: {
            type: String,
            default: ""
        },
        workEmail: {
            type: String,
            default: ""
        },
        otherEmail: {
            type: String,
            default: ""
        },
        aboutMe: {
            type: String,
            default: ""
        },
        dateOfBirth: {
            type: String,
            default: ""
        },
        homeTown: {
            type: String,
            default: ""
        },
        currentCity: {
            type: String,
            default: ""
        },
        languages: {
            type: String,
            default: ""
        },
        music: {
            type: String,
            default: ""
        },
        socialCause_Other: {
            type: String,
            default: ""
        },
        philosophy_Other: {
            type: String,
            default: ""
        },
        color: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            default: ""
        },
        travelDestination: {
            type: String,
            default: ""
        },
        season: {
            type: String,
            default: ""
        },
        uniqueSkills: {
            type: String,
            default: ""
        },
        cuisine: {
            type: String,
            default: ""
        },
        beverage: {
            type: String,
            default: ""
        },
        inspirationalQuotes: {
            type: String,
            default: ""
        },
        funnyQuotes: {
            type: String,
            default: ""
        },
        motivationalQuotes: {
            type: String,
            default: ""
        },
        otherQuotes: {
            type: String,
            default: ""
        },
        petLover: {
            type: String,
            default: ""
        },
        partyEnthusiast: {
            type: String,
            default: ""
        },
        smoker: {
            type: String,
            default: ""
        },
        maritalStatus: {
            type: String,
            default: ""
        },
        relationshipStatus: {
            type: String,
            default: ""
        },
        fitnessRoutine: {
            type: String,
            default: ""
        },
        morningPerson: {
            type: String,
            default: ""
        },
        diet: {
            type: String,
            default: ""
        },
        sleepingHabit: {
            type: String,
            default: ""
        },
        travelMode: {
            type: String,
            default: ""
        },
        genre: {
            type: String,
            default: ""
        },
        sports: {
            type: String,
            default: ""
        },
        artistisPursuits: {
            type: String,
            default: ""
        },
        gaming: {
            type: String,
            default: ""
        },
        collectignHobby: {
            type: String,
            default: ""
        }, 
        coffee: {
            type: String,
            default: ""
        },
        cookingSkills: {
            type: String,
            default: ""
        },
        currentOcupation: {
            type: String,
            default: ""
        },
        careerAspiation: {
            type: String,
            default: ""
        },
        education: {
            type: String,
            default: ""
        },
        skills: {
            type: String,
            default: ""
        },
        travelMode_Other: {
            type: String,
            default: ""
        },
        spiritual_Other: {
            type: String,
            default: ""
        },
        core_Other: {
            type: String,
            default: ""
        },
        genre_Other: {
            type: String,
            default: ""
        },
        sports_Other: {
            type: String,
            default: ""
        },
        artistisPursuits_Other: {
            type: String,
            default: ""
        },
        gaming_Other: {
            type: String,
            default: ""
        },
        collectignHobby_Other: {
            type: String,
            default: ""
        },
        coffee_Other: {
            type: String,
            default: ""
        },
        cookingSkills_Other: {
            type: String,
            default: ""
        },
        currentOcupation_Other: {
            type: String,
            default: ""
        },
        careerAspiation_Other: {
            type: String,
            default: ""
        },
        education_Other: {
            type: String,
            default: ""
        },
        skills_Other: {
            type: String,
            default: ""
        },
        diet_Other: {
            type: String,
            default: ""
        },
        spiritual: {
            type: String,
            default: ""
        },
        core: {
            type: String,
            default: ""
        },
        philosophy: {
            type: String,
            default: ""
        },
        socialCause: {
            type: String,
            default: ""
        },
        globalIssues: {
            type: String,
            default: ""
        },
        weirdBelief: {
            type: String,
            default: ""
        },
        otherInterests: {
            type: String,
            default: ""
        },
        futureGoals: {
            type: String,
            default: ""
        },
        current: {
            type: String,
            default: ""
        },
        unusualExperinece: {
            type: String,
            default: ""
        },
        strangeHabits: {
            type: String,
            default: ""
        },
        socialMedia: {
            type: [Object],
            default: []
        },
        shortCode : {
            type: String,
            required: true,
            unique: true,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        }, 
    },
    {
        timestamps: true
    }
)

const Personal = mongoose.model("Personal", personalSchema);
export default Personal;