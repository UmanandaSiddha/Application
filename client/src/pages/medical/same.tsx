const Same = ({medical}: any) => {
    return (
        <div>
            <p>
                <span className="font-semibold">Name:</span>{" "}
                {medical?.personalInfo?.name}
            </p>
            <p>
                <span className="font-semibold">Birth:</span>{" "}
                {medical?.personalInfo.birth}
            </p>
            <p>
                <span className="font-semibold">Gender:</span>{" "}
                {medical?.personalInfo.gender}
            </p>
            <p>
                <span className="font-semibold">Address:</span>
            </p>
            <p>
                <span className="font-semibold">Street Address:</span>{" "}
                {medical?.personalInfo.address.street}
            </p>
            <p>
                <span className="font-semibold">City:</span>{" "}
                {medical?.personalInfo.address.city}
            </p>
            <p>
                <span className="font-semibold">State:</span>{" "}
                {medical?.personalInfo.address.state}
            </p>
            <p>
                <span className="font-semibold">Postal Code:</span>{" "}
                {medical?.personalInfo.address.postalCode}
            </p>
            <p>
                <span className="font-semibold">Phone Number:</span>{" "}
                {medical?.personalInfo.phone}
            </p>
            <p>
                <span className="font-semibold">Email:</span>{" "}
                {medical?.personalInfo.email}
            </p>
            <p>
                <span className="font-semibold">Name:</span>{" "}
                {medical?.personalInfo.emergency.name}
            </p>
            <p>
                <span className="font-semibold">Relationship:</span>{" "}
                {medical?.personalInfo.emergency.relation}
            </p>
            <p>
                <span className="font-semibold">Phone Number:</span>{" "}
                {medical?.personalInfo.emergency.phone}
            </p>
            <p>
                <span className="font-semibold">Health History:</span>
            </p>
            <p>
                <span className="font-semibold">Known Allergies:</span>{" "}
                {medical?.healthHistory.allergy}
            </p>
            <p>
                <span className="font-semibold">Chronic Medical Conditions :</span>{" "}
                {medical?.healthHistory.chronic}
            </p>
            <p>
                <span className="font-semibold">Current Medication:</span>{" "}
                {medical?.currentMedication}
            </p>
            <p>
                <span className="font-semibold">Previous Surgeries:</span>{" "}
                {medical?.previousSurgeries}
            </p>
            <p>
                <span className="font-semibold">Health Habits:</span>
            </p>
            <p>
                <span className="font-semibold">Smoker:</span>{" "}
                {medical?.healthHabits.smoker}
            </p>
            <p>
                <span className="font-semibold">Alcohol Consumption:</span>{" "}
                {medical?.healthHabits.alcohol}
            </p>
            <p>
                <span className="font-semibold">Exercise:</span>{" "}
                {medical?.healthHabits.exercise}
            </p>
            <p>
                <span className="font-semibold">Exercise:</span>{" "}
                {medical?.healthHabits.diet}
            </p>
            <p>
                <span className="font-semibold">Exercise:</span>{" "}
                {medical?.healthHabits.mentalCondition}
            </p>
            <p>
                <span className="font-semibold">Exercise:</span>{" "}
                {medical?.healthHabits.vaccinationHistory}
            </p>
            <p>
                <span className="font-semibold">Insurance Provider:</span>
            </p>
            <p>
                <span className="font-semibold">Insurance Provider:</span>{" "}
                {medical?.insuranceInfo.provider}
            </p>
            <p>
                <span className="font-semibold">Insurance Provider:</span>{" "}
                {medical?.insuranceInfo.policyNumber}
            </p>
            <p>
                <span className="font-semibold">Insurance Provider:</span>{" "}
                {medical?.insuranceInfo.grpNumber}
            </p>
        </div>
    )
}

export default Same