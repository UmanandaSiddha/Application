import mongoose, { Schema } from "mongoose";
import { AnimalData, BotanyData, CreatorData, IndividualData, MedicalData } from "./card.types.js";

export const CardEnum = {
    INDIVIDUAL: "INDIVIDUAL",
    BOTANICAL: "BOTANICAL",
    MEDICAL: "MEDICAL",
    ANIMAL: "ANIMAL",
    CREATOR: "CREATOR",
} as const;

export interface ICard extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    type: (typeof CardEnum)[keyof typeof CardEnum];
    data: IndividualData | BotanyData | CreatorData | AnimalData | MedicalData;
    shortCode: string;
    userId: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const BotanyCardSchema: Schema<BotanyData> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        scientificName: String,
        family: String,
        origin: String,
        habitat: String,
        description: String,
        height: String,
        leafType: String,
        flowerColor: String,
        uses: String,
        careInstructions: String,
        specialFeatures: String,
        caretakerMobileNumber: String,
        additionalNotes: String,
    }, {
        _id: false
    }
);

const MedicalCardSchema: Schema<MedicalData> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        dateOfBirth: String,
        gender: String,
        street: String,
        city: String,
        state: String,
        postalCode: String,
        phone: String,
        email: String,
        emergencyName: String,
        emergencyRelation: String,
        emergencyPhone: String,
        allergyHistory: String,
        chronicHistory: String,
        currentMedication: String,
        previousSurgeries: String,
        smoker: String,
        alcohol: String,
        exercise: String,
        blood: String,
        height: String,
        weight: String,
        age: String,
        allergyHistory_Other: String,
        chronicHistory_Other: String,
        diet_Other: String,
        exercise_Other: String,
        diet: String,
        mentalCondition: String,
        vaccinationHistory: String,
        insuranceProvider: String,
        insurancePolicyNumber: String,
        insuranceGrpNumber: String,
    }, {
        _id: false
    }
);

const IndividualCardSchema: Schema<IndividualData> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        mobileNumber: String,
        homeNumber: String,
        workNumber: String,
        otherNumber: String,
        personalEmail: String,
        workEmail: String,
        otherEmail: String,
        aboutMe: String,
        dateOfBirth: String,
        homeTown: String,
        currentCity: String,
        languages: String,
        music: String,
        socialCause_Other: String,
        philosophy_Other: String,
        color: String,
        city: String,
        travelDestination: String,
        season: String,
        uniqueSkills: String,
        cuisine: String,
        beverage: String,
        inspirationalQuotes: String,
        funnyQuotes: String,
        motivationalQuotes: String,
        otherQuotes: String,
        petLover: String,
        partyEnthusiast: String,
        smoker: String,
        maritalStatus: String,
        relationshipStatus: String,
        fitnessRoutine: String,
        morningPerson: String,
        diet: String,
        sleepingHabit: String,
        travelMode: String,
        genre: String,
        sports: String,
        artistisPursuits: String,
        gaming: String,
        collectignHobby: String,
        coffee: String,
        cookingSkills: String,
        currentOcupation: String,
        careerAspiation: String,
        education: String,
        skills: String,
        travelMode_Other: String,
        spiritual_Other: String,
        core_Other: String,
        genre_Other: String,
        sports_Other: String,
        artistisPursuits_Other: String,
        gaming_Other: String,
        collectignHobby_Other: String,
        coffee_Other: String,
        cookingSkills_Other: String,
        currentOcupation_Other: String,
        careerAspiation_Other: String,
        education_Other: String,
        skills_Other: String,
        diet_Other: String,
        spiritual: String,
        core: String,
        philosophy: String,
        socialCause: String,
        globalIssues: String,
        weirdBelief: String,
        otherInterests: String,
        futureGoals: String,
        current: String,
        unusualExperinece: String,
        strangeHabits: String,
        socialMedia: {
            type: [{
                label: String,
                link: String,
            }],
            default: []
        },
    }, {
        _id: false
    }
);

const CreatorCardSchema: Schema<CreatorData> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        links: {
            type: [{
                label: String,
                link: String,
            }],
            default: []
        },
    }, {
        _id: false
    }
);

const AnimalCardSchema: Schema<AnimalData> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        scientificName: String,
        habitat: String,
        geographicalRange: String,
        physicalDescription: String,
        diet: String,
        lifespan: String,
        behavior: String,
        conservationStatus: String,
        ownerName: String,
        location: String,
        caretakerMobileNumber: String,
        additionalNotes: String,
    }, {
        _id: false
    }
);

const CardSchema: Schema<ICard> = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: Object.values(CardEnum),
            required: true,
        },
        data: {
            type: BotanyCardSchema || MedicalCardSchema || IndividualCardSchema || CreatorCardSchema || AnimalCardSchema,
            required: true,
            validate: {
                validator: function (value: any) {
                    return typeof value === "object" && Object.keys(value).length > 0;
                },
                message: "Data field must be a non-empty object",
            },
        },
        shortCode: { type: String, required: true, index: true, unique: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    {
        timestamps: true
    }
);

const Card = mongoose.model("Card", CardSchema);
export default Card;