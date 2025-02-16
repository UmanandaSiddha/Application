import { Document } from "mongoose";

export interface IndividualData extends Document {
    name: string;
    mobileNumber?: string;
    homeNumber?: string;
    workNumber?: string;
    otherNumber?: string;
    personalEmail?: string;
    workEmail?: string;
    otherEmail?: string;
    aboutMe?: string;
    dateOfBirth?: string;
    homeTown?: string;
    currentCity?: string;
    languages?: string;
    music?: string;
    socialCause_Other?: string;
    philosophy_Other?: string;
    color?: string;
    city?: string;
    travelDestination?: string;
    season?: string;
    uniqueSkills?: string;
    cuisine?: string;
    beverage?: string;
    inspirationalQuotes?: string;
    funnyQuotes?: string;
    motivationalQuotes?: string;
    otherQuotes?: string;
    petLover?: string;
    partyEnthusiast?: string;
    smoker?: string;
    maritalStatus?: string;
    relationshipStatus?: string;
    fitnessRoutine?: string;
    morningPerson?: string;
    diet?: string;
    sleepingHabit?: string;
    travelMode?: string;
    genre?: string;
    sports?: string;
    artistisPursuits?: string;
    gaming?: string;
    collectignHobby?: string;
    coffee?: string;
    cookingSkills?: string;
    currentOcupation?: string;
    careerAspiation?: string;
    education?: string;
    skills?: string;
    travelMode_Other?: string;
    spiritual_Other?: string;
    core_Other?: string;
    genre_Other?: string;
    sports_Other?: string;
    artistisPursuits_Other?: string;
    gaming_Other?: string;
    collectignHobby_Other?: string;
    coffee_Other?: string;
    cookingSkills_Other?: string;
    currentOcupation_Other?: string;
    careerAspiation_Other?: string;
    education_Other?: string;
    skills_Other?: string;
    diet_Other?: string;
    spiritual?: string;
    core?: string;
    philosophy?: string;
    socialCause?: string;
    globalIssues?: string;
    weirdBelief?: string;
    otherInterests?: string;
    futureGoals?: string;
    current?: string;
    unusualExperinece?: string;
    strangeHabits?: string;
    socialMedia: {
        label: string;
        link: string;
    }[];
}

export interface BotanyData extends Document {
    name: string;
    scientificName?: string;
    waterRequirement?: string;
    sunlightRequirement?: string;
    commonPestsDiseases?: string;
    description?: string;
    height?: string;
    leafType?: string;
    symptoms?: string;
    nutritionalNeeds?: string;
    careInstructions?: string;
    specialFeatures?: string;
    caretakerMobileNumber?: string;
    additionalNotes?: string;
}

export interface CreatorData extends Document {
    name: string;
    links: {
        label: string;
        link: string;
    }[];
}

export interface AnimalData extends Document {
    name: string;
    signIllness?: string;
    vaccination?: string;
    physicalDescription?: string;
    diet?: string;
    lifespan?: string;
    behavior?: string;
    commonHealth?: string;
    ownerName?: string;
    location?: string;
    caretakerMobileNumber?: string;
    additionalNotes?: string;
}

export interface MedicalData extends Document {
    name: string;
    dateOfBirth?: string;
    gender?: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    phone?: string;
    email?: string;
    emergencyName?: string;
    emergencyRelation?: string;
    emergencyPhone?: string;
    allergyHistory?: string;
    chronicHistory?: string;
    currentMedication?: string;
    previousSurgeries?: string;
    smoker?: string;
    alcohol?: string;
    exercise?: string;
    blood?: string;
    height?: string;
    weight?: string;
    age?: string;
    allergyHistory_Other?: string;
    chronicHistory_Other?: string;
    diet_Other?: string;
    exercise_Other?: string;
    diet?: string;
    mentalCondition?: string;
    vaccinationHistory?: string;
    insuranceProvider?: string;
    insurancePolicyNumber?: string;
    insuranceGrpNumber?: string;
}