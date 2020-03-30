const getQuestions = () => [
  [
    {
      question: "Applicant First Name",
      valueName: "forename",
      type: "text",
    },
    {
      question: "Applicant Preferred Name",
      valueName: "namePreference",
      optional: true,
      type: "text",
    },
    {
      question: "Applicant Surname",
      valueName: "surname",
      type: "text",
    },
    {
      question: "Applicant Gender",
      valueName: "gender",
      allowedFields: ["Male", "Female", "Prefer not to say"],
      type: "dropdown"
    },
    {
      question: "Applicant Date of Birth",
      valueName: "dob",
      type: "date",
    },
  ],
  [
    {
      question: "House Name / Number",
      valueName: "houseID",
      type: "text",
    },
    {
      question: "Name of street",
      valueName: "streetName",
      type: "text",
    },
    {
      question: "Town",
      valueName: "town",
      type: "text",
    },
    {
      question: "County",
      valueName: "county",
      type: "text",
    },
    {
      question: "Postcode",
      valueName: "postcode",
      type: "text",
    },
  ],
  [
    {
      question: "Student Email Address",
      valueName: "studentEmail",
      type: "text",
    },
    {
      question: "Current School",
      valueName: "currentSchool",
      type: "text",
    },
    {
      question: "Current Year Group",
      valueName: "currentYearGroup",
      type: "text",
    },
    {
      question: "Name of Head of Year",
      valueName: "headOfYearName",
      type: "text",
    },
  ],
  [
    {
      question: "Are you a British Citizen?",
      valueName: "britishCitizen",
      allowedFields: ["Yes", "No"],
      type: "dropdown"
    },
    {
      question: "Have you been a legal resident in the UK for 3 years?",
      valueName: "ukResident",
      allowedFields: ["Yes", "No"],
      type: "dropdown"
    }
  ],
  [
    {
      question: "Parent / Carer Contact 1 Title",
      valueName: "contact1Title",
      type: "text",
    },
    {
      question: "Parent / Carer Contact 1 Forename",
      valueName: "contact1Forename",
      type: "text",
    },
    {
      question: "Parent / Carer Contact 1 Surname",
      valueName: "contact1Surname",
      type: "text",
    },
    {
      question: "Parent / Carer Contact 1 Work Telephone",
      valueName: "contact1WorkTelephone",
      type: "text",
    },
    {
      question: "Parent / Carer Contact 1 Relationship to Child",
      valueName: "contact1Relationship",
      type: "text",
    },
    {
      question: "Parent / Carer Contact 1 Do you have parental responsibility?",
      valueName: "contact1ParentalResponsibility",
      allowedFields: ["Yes", "No"],
      type: "dropdown",
    },
    {
      question: "Parent / Carer Contact 1 Email Address",
      valueName: "contact1Email",
      type: "text",
    }
  ],
  [
    {
      question: "Parent / Carer Contact 2 Title",
      valueName: "contact2Title",
      type: "text",
      optional: true,
    },
    {
      question: "Parent / Carer Contact 2 Forename",
      valueName: "contact2Forename",
      type: "text",
      optional: true,
    },
    {
      question: "Parent / Carer Contact 2 Surname",
      valueName: "contact2Surname",
      type: "text",
      optional: true,
    },
    {
      question: "Parent / Carer Contact 2 Work Telephone",
      valueName: "contact2WorkTelephone",
      type: "text",
      optional: true,
    },
    {
      question: "Parent / Carer Contact 2 Relationship to Child",
      valueName: "contact2Relationship",
      type: "text",
      optional: true,
    },
    {
      question: "Parent / Carer Contact 2 Do you have parental responsibility?",
      valueName: "contact2ParentalResponsibility",
      allowedFields: ["Yes", "No"],
      type: "dropdown",
      optional: true,
    },
    {
      question: "Parent / Carer Contact 2 Email Address",
      valueName: "contact2Email",
      type: "text",
      optional: true,
    }
  ],
  [
    {
      question: "Subject Choice Selection",
      valueName: "subjectChoices",
      type: "subjectSelector",
      optional: false,
    }
  ],
  [
    {
      question: "GCSE Predicted Grades",
      valueName: "expectedQualifications",
      type: "qualificationFiller",
      optional: false,
    }
  ],
  [
    {
      question: "Qualifications Already Achieved",
      valueName: "currentQualifications",
      type: "currentQualificationFiller",
      optional: true,
      hideOptionalText: true,
    }
  ],
  [
    {
      question: "Additional Qualifications (eg scouting, music, sports, Duke of Edinburgh, etc.)",
      valueName: "additionalQualifications",
      type: "largeText",
      optional: true,
      hideOptionalText: true,
    },
    {
      question: "Extra curricular interests outside of school",
      valueName: "extraCurricularInterests",
      type: "largeText",
      optional: true,
      hideOptionalText: true,
    },
    {
      preText: "Please select the events that you have attended or intend to attend.",
      question: "Open Evening (14th November 2019)",
      valueName: "attendedOpenEvening",
      allowedFields: ["Yes", "No"],
      type: "dropdown",
    },
    {
      question: "Discovery Day Event (1st February 2019)",
      valueName: "attendedDiscoveryDay",
      allowedFields: ["Yes", "No"],
      type: "dropdown",
    },
    {
      question: "Open Week Tours (10th-14th February 2020)",
      valueName: "attendedOpenWeekTours",
      allowedFields: ["Yes", "No"],
      type: "dropdown",
    }
  ],
  [
    {
      preText: "We want to ensure that you receive any support that you may need while you are in the Sixth Form. Please answer the following questions.",
      question: "Do you have a disability, medical condition or difficulties with mobility?",
      valueName: "hasDisabilityOrMedicalCondition",
      allowedFields: ["Yes", "No"],
      type: "dropdown",
    },
    {
      question: "If so, please give details below of the provision put in place at your current school to support you.",
      valueName: "disabilityOrMedicalConditionSupportInformation",
      type: "largeText",
      optional: true,
      hideOptionalText: true,
    },
    {
      question: "Do you currently receive any additional support at school? This would include any AEN provision or additional time in assessments",
      valueName: "receivesAdditionalSupport",
      allowedFields: ["Yes", "No"],
      type: "dropdown",
    },
    {
      question: "If so, please give details below.",
      valueName: "additionalSupportInformation",
      type: "largeText",
      optional: true,
      hideOptionalText: true,
    },
  ],
  [
    {
      question: "By selecting Proceed below, you hereby agree that all provided information is correct.",
      valueName: "_proceedAllowed",
      type: "none",
      optional: true,
      hideOptionalText: true,
    }
  ]
];

export default getQuestions;