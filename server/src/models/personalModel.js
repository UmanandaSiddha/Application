import mongoose from "mongoose";

const personalSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Enter your Name"],
        },
        contactInfo: {
            phoneNumber: {
                mobile: Number,
                home: Number,
                work: Number,
                other: Number,
            },
            emailAddress: {
                personal: String,
                work: String,
                other: String,
            }
        },
        socialMedia: [Object],
        aboutMe: {
            aboutme: String,
            birth: String,
            homeTown: String,
            currentCity: String,
        },
        preferences: {
            languages: String,
            music: String,
            color: String,
            city: String,
            travelDestination: String,
            season: String,
            uniqueSkills: String,
            cuisine: String,
            beverage: String,
            quotes: {
                inspirational: String,
                funny: String,
                motivational: String,
                other: String,
            },
        },
        lifeStyle :{
            travelMode: String,
            petLover: String,
            partyEnthusiast: String,
            smoker: String,
            maritalStatus: String,
            relationshipStatus: String,
            fitnessRoutine: String,
            morningPerson: String,
            diet: String,
            sleepingHabit: String,
            genre: String,
            sports: String,
            artistisPursuits: String,
            gaming: String,
            collectignHobby: String, 
            coffee: String,
            cookingSkills: String,
            spiritual: String,
            core: String,
            philosophy: String,
            socialCause: String,
        },
        beliefs: {
            globalIssues: String,
            weirdBelief: String,
        },
        professional: {
            currentOcupation: String,
            careerAspiation: String,
            education: String,
            skills: String,
        },
        additional: {
            otherInterests: String,
            futureGoals: String,
            current: String,
            unusualExperinece: String,
            strangeHabits: String,
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

export default mongoose.model("Personal", personalSchema);