export const perInfo = [
    { name: "name", label: "Name", text: "Enter your name", type: "text" },
    { name: "dateOfBirth", label: "Date of Birth", text: "Enter your Date of Birth", type: "date" },
    { name: "gender", label: "Gender", text: "Enter your Gender", type: "text" },
    { name: "phone", label: "Phone Number", text: "Enter your Phone Number", type: "tel" },
    { name: "email", label: "Email Address", text: "Enter your Email Address", type: "email" }
];

export const emCon = [
    { name: "emergencyName", label: "Name", text: "Enter Name", type: "text" },
    { name: "emergencyRelation", label: "Relation", text: "Enter Relationship", type: "text" },
    { name: "emergencyPhone", label: "Phone", text: "Enter Phone Number", type: "tel" }
];

export const medAdd = [
    { name: "street", label: "Street", text: "Enter Street Address", type: "text" },
    { name: "city", label: "City", text: "Enter City", type: "text" },
    { name: "state", label: "State", text: "Enter State/Province", type: "text" },
    { name: "postalCode", label: "Postal", text: "Enter Postal Code", type: "number" }
];

export const medDetails = [
    { name: "height", label: "Height", text: "Enter Height (in meters)", type: "number" },
    { name: "weight", label: "Weight", text: "Enter Weight (in kgs)", type: "number" },
    { name: "age", label: "Age", text: "Enter State/Province", type: "number" },
];

export const medDetailBlood = [
    { name: "blood", label: "Blood Group", type: "text", text: "Enter blood group", options: ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"] }
];

export const healthHistory = [
    {
        name: "allergyHistory", multiple: true, label: "Known Allergies", text: "Enter Known Allergies", type: "text",
        options: ['Medications', 'Foods', 'Insects', 'Latex', 'Pollen', 'Other']
    },
    {
        name: "chronicHistory", multiple: true, label: "Chronic Conditions", text: "Enter Chronic Medical Conditions", type: "text",
        options: ['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Arthritis', 'Thyroid Disorder', 'Chronic Pain', 'Respiratory Issues', 'Chronic Obstructive Pulmonary Disease (COPD)', 'Cardiovascular Diseases', 'Cancer', 'Chronic Kidney Disease (CKD)', 'Tuberculosis', 'Rheumatic Heart Disease', 'Hepatitis', 'Alzheimer’s Disease', 'Osteoarthritis', 'Rheumatoid Arthritis', 'Bronchitis', 'Emphysema', 'Cystic Fibrosis', 'Eczema', 'Endometriosis', 'Ehlers-Danlos Syndrome', 'Other']
    }
];

export const medicalCondition = [
    { name: "currentMedication", label: "Current Medications", text: "Current Medications", type: "textarea" },
    { name: "previousSurgeries", label: "Previous Surgeries", text: "Previous Surgeries", type: "textarea" },
];

export const healthhabits = [
    { name: "smoker", label: "Smoker", text: "Smoker", type: "text", options: ['Yes, currently', 'Used to, but quit', 'No'] },
    { name: "alcohol", label: "Alcohol Consumption", text: "Alcohol Consumption", type: "text", options: ['Regularly', 'Occasionally', 'Rarely', 'Never'] },
    { name: "exercise", label: "Exercise Routine", text: "Exercise Routine", type: "text", options: ['Regularly', 'Occasionally', 'Sedentary lifestyle', 'Gym, Yoga, Running, etc.', 'Other'] },
    { name: "diet", label: "Dietary Preferences", text: "Dietary Preferences", type: "text", options: ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Other'] },
    { name: "mentalCondition", label: "Mental Health", multiple: true, text: "Mental Health", type: "text", options: ['Depression', 'Anxiety', 'Bipolar Disorder', 'PTSD', 'Eating Disorders', 'OCD'] },
    { name: "vaccinationHistory", label: "Routine Vaccinations", multiple: true, text: "Routine Vaccinations", type: "text", options: ['Influenza', 'Tetanus', 'Hepatitis', 'Measles, Mumps, Rubella (MMR)', 'COVID-19'] }
];

export const inSur = [
    { name: "insuranceProvider", label: "Provider", text: "Insurance Provider", type: "text" },
    { name: "insurancePolicyNumber", label: "Policy", text: "Policy Number", type: "number" },
    { name: "insuranceGrpNumber", label: "Group", text: "Group Number (if applicable)", type: "number" }
];

export const otherInputs = [
    { name: "exercise_Other", type: "text" },
    { name: "diet_Other", type: "text" },
    { name: "allergyHistory_Other", type: "text" },
    { name: "chronicHistory_Other", type: "text" },
];