const Same = ({ medical }: any) => {
  return (
    <div className="font-Kanit w-[280px]">
        <div className="flex justify-center items-center py-2">
        <span className="text-xl underline font-bold">Personal Information:</span>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Name:</span>{" "}
        </div>
        <div className="basis-1/2">{medical?.personalInfo.name}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Birth:</span>
        </div>
        <div className="basis-1/2">{medical?.personalInfo.birth}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Gender:</span>
        </div>
        <div className="basis-1/2">{medical?.personalInfo.gender}</div>
      </div>
      <div className="flex justify-center items-center py-2">
        <span className="text-xl underline font-bold">Address:</span>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Street Address:</span>
        </div>
        <div className="basis-1/2">{medical?.personalInfo.address.street}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">City:</span>
        </div>
        <div className="basis-1/2">{medical?.personalInfo.address.city}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">State:</span>
        </div>
        <div className="basis-1/2">{medical?.personalInfo.address.state}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Postal Code:</span>
        </div>
        <div className="basis-1/2">{medical?.personalInfo.address.postalCode}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Phone Number:</span>
        </div>
        <div className="basis-1/2">{medical?.personalInfo.phone}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Email:</span>
        </div>
        <div className="basis-1/2">{medical?.personalInfo.email}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">City:</span>
        </div>
        <div className="basis-1/2">{medical?.personalInfo.address.city}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Name:</span>
        </div>
        <div className="basis-1/2">{medical?.personalInfo.address.city}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Relationship:</span>
        </div>
        <div className="basis-1/2">{medical?.personalInfo.address.relation}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Phone Number:</span>
        </div>
        <div className="basis-1/2">{medical?.personalInfo.address.phone}</div>
      </div>
      <div className="flex justify-center items-center py-2">
        <span className="text-xl underline font-bold">Health History:</span>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Known Allergies:</span>
        </div>
        <div className="basis-1/2">{medical?.healthHistory.allergy}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Chronic Medical Conditions:</span>
        </div>
        <div className="basis-1/2">{medical?.healthHistory.chronic}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Current Medication:</span>
        </div>
        <div className="basis-1/2">{medical?.currentMedication}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Previous Surgeries:</span>
        </div>
        <div className="basis-1/2">{medical?.previousSurgeries}</div>
      </div>
      <div className="flex justify-center items-center py-2">
        <span className="text-xl underline font-bold">Health Habits:</span>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Smoker:</span>
        </div>
        <div className="basis-1/2">{medical?.healthHabits.smoker}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Alcohol Consumption:</span>
        </div>
        <div className="basis-1/2">{medical?.healthHabits.alcohol}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Exercise Routine:</span>
        </div>
        <div className="basis-1/2">{medical?.healthHabits.exercise}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Diet:</span>
        </div>
        <div className="basis-1/2">{medical?.healthHabits.diet}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Mental Condition:</span>
        </div>
        <div className="basis-1/2">{medical?.healthHabits.mentalCondition}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Vaccination History:</span>
        </div>
        <div className="basis-1/2">{medical?.healthHabits.vaccinationHistory}</div>
      </div>
      <div className="flex justify-center items-center py-2">
        <span className="text-xl underline font-bold">Insurance Information:</span>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Insurance Provider:</span>
        </div>
        <div className="basis-1/2">{medical?.insuranceInfo.provider}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Policy Number:</span>
        </div>
        <div className="basis-1/2">{medical?.insuranceInfo.policyNumber}</div>
      </div>
      <div className="flex">
        <div className="basis-1/2">
          <span className="font-semibold">Group Number:</span>
        </div>
        <div className="basis-1/2">{medical?.insuranceInfo.grpNumber}</div>
      </div>
    </div>
  );
};

export default Same;
