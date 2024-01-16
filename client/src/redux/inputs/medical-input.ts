export const perInfo = [
    {
        name: "name",
        label: "Name",
        text: "Enter your name",
    },
    {
        name: "birth",
        label: "Date of Birth",
        text: "Enter your Date of Birth",
    },
    {
        name: "gender",
        label: "Gender",
        text: "Enter your Gender",
    },
    {
        name: "phone",
        label: "Phone Number",
        text: "Enter your Phone Number",
    },
    {
        name: "email",
        label: "Email Address",
        text: "Enter your Email Address",
    }
] as const;

export const emCon = [
    {
        name: "emname",
        label: "Name",
        text: "Enter Name",
    },
    {
        name: "emrelation",
        label: "Relation",
        text: "Enter Relationship",
    },
    {
        name: "emphone",
        label: "Phone",
        text: "Enter Phone Number",
    },
] as const;

export const medAdd = [
    {
        name: "street",
        label: "Street",
        text: "Enter Street Address",
    },
    {
        name: "city",
        label: "City",
        text: "Enter City",
    },
    {
        name: "state",
        label: "State",
        text: "Enter State/Province",
    },
    {
        name: "postal",
        label: "Postal",
        text: "Enter Postal Code",
    },
] as const;

export const healthHistory = [
    {
        name: "allergy",
        label: "Known Allergies",
        text: "Enter Known Allergies",
        options: [
            'Medications',
            'Foods',
            'Insects',
            'Latex',
            'Pollen',
        ]
    },
    {
        name: "chronic",
        label: "Chronic Medical Conditions",
        text: "Enter Chronic Medical Conditions",
        options: [
            'Diabetes',
            'Hypertension',
            'Asthma',
            'Heart Disease',
            'Arthritis',
            'Thyroid Disorder',
            'Chronic Pain',
            'Respiratory Issues',
        ]
    },
] as const;

export const healthhabits = [
    {
        name: "smoker",
        label: "Smoker?",
        text: "Smoker?",
        options: [
            'Yes, currently',
            'Used to, but quit',
            'No',
        ]
    },
    {
        name: "alcohol",
        label: "Alcohol Consumption",
        text: "Alcohol Consumption",
        options: [
            'Regularly',
            'Occasionally',
            'Rarely',
            'Never',
        ]
    },
    {
        name: "routine",
        label: "Exercise Routine",
        text: "Exercise Routine",
        options: [
            'Regularly',
            'Occasionally',
            'Sedentary lifestyle',
            'Gym, Yoga, Running, etc.',
        ]
    },
    {
        name: "diet",
        label: "Dietary Preferences",
        text: "Dietary Preferences",
        options: [
            'Vegetarian',
            'Vegan',
            'Gluten-free',
            'Dairy-free',

        ]
    },
    {
        name: "mental",
        label: "History of Mental Health Conditions",
        text: "History of Mental Health Conditions",
        options: [
            'Depression',
            'Anxiety',
            'Bipolar Disorder',
            'PTSD',
            'Eating Disorders',
            'OCD',
        ]
    },
    {
        name: "vaccine",
        label: "Routine Vaccinations Received",
        text: "Routine Vaccinations Received",
        options: [
            'Influenza',
            'Tetanus',
            'Hepatitis',
            'Measles, Mumps, Rubella (MMR)',
            'COVID-19',
        ]
    },
] as const;

export const inSur = [
    {
        name: "provider",
        label: "Provider",
        text: "Insurance Provider",
    },
    {
        name: "policy",
        label: "Policy",
        text: "Policy Number",
    },
    {
        name: "group",
        label: "Group",
        text: "Group Number (if applicable)",
    },
] as const;