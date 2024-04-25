const { TEMP_PASSWORD } = require("../utils/utils");

const PATIENT_DETAILS = [
  {
    firstName: "Raj",
    lastName: "Kumar",
    username: "pat3",
    age: "50",
    hospitalId: "1",
    phoneNumber: "8754187321",
    emergPhoneNumber: "8754187321",
    address: "153,East New Street,Rjpm",
    permissionGranted: ["hosp1admin", "hosp2admin"],
    changedBy: "initLedger",
    password: "pass",
    pwdTemp: true,
  },
  // {
  //   firstName: "Deepan",
  //   lastName: "Raj",
  //   username: "Deepan Raj",
  //   age: "60",
  //   hospitalId: "2",
  //   phoneNumber: "6743987654",
  //   emergPhoneNumber: "6743987654",
  //   address: " 134, North Car Street,Chennai",
  //   bloodGroup: "B+",
  //   allergies: "No",
  //   symptoms: "Heart Burn, shortness of breath, Acidity",
  //   diagnosis: "Esophagitis",
  //   treatment: "omeprazole 40 mg for 10 days before food",
  //   followUp: "2 Weeks",
  //   permissionGranted: ["hosp1admin", "hosp2admin"],
  //   changedBy: "initLedger",
  //   password: TEMP_PASSWORD,
  //   pwdTemp: true,
  // },
  // {
  //   firstName: "Mahesh",
  //   lastName: "Kumar",
  //   username: "Mahesh Kumar",
  //   age: "63",
  //   hospitalId: "1",
  //   phoneNumber: "8478321234",
  //   emergPhoneNumber: "9478321234",
  //   address: "165,West Street,Pudukottai",
  //   bloodGroup: "B+",
  //   allergies: "No",
  //   symptoms: "Dizziness, Nausea, systolic-150, diastolic-110",
  //   diagnosis: "Hypertension",
  //   treatment: "CORBIS 5 mg one per day",
  //   followUp: "2 Weeks",
  //   permissionGranted: ["hosp1admin", "hosp2admin"],
  //   changedBy: "initLedger",
  //   password: TEMP_PASSWORD,
  //   pwdTemp: true,
  // },
  // {
  //   firstName: "Vignesh",
  //   lastName: "Kumar",
  //   username: "Viki",
  //   age: "75",
  //   hospitalId: "1",
  //   phoneNumber: "7478321234",
  //   emergPhoneNumber: "9978321234",
  //   address: "17,East Street,Madurai",
  //   bloodGroup: "B+",
  //   allergies: "No",
  //   symptoms: "Weight Loss, frequent urination, dizziness",
  //   diagnosis: "Diabetes Mellitus",
  //   treatment:
  //     "PRINIVIL TABS 20 MG (LISINOPRIL), HUMULIN INJ 70/30 20 units after breakfast",
  //   followUp: "4 Weeks",
  //   permissionGranted: ["hosp1admin", "hosp2admin"],
  //   changedBy: "initLedger",
  //   password: TEMP_PASSWORD,
  //   pwdTemp: false,
  // },
  // {
  //   firstName: "Ramesh",
  //   lastName: "Kumar",
  //   username: "Ramesh",
  //   age: "78",
  //   hospitalId: "2",
  //   phoneNumber: "9778321234",
  //   emergPhoneNumber: "7778321234",
  //   address: "12,East Street,Madurai",
  //   bloodGroup: "B+",
  //   allergies: "No",
  //   symptoms: "Pain in the knee joints",
  //   diagnosis: "Osteoarthritis",
  //   treatment: "ULTRADAY 40 mg twice per day",
  //   followUp: "2 Weeks",
  //   permissionGranted: ["hosp1admin", "hosp2admin"],
  //   changedBy: "initLedger",
  //   password: TEMP_PASSWORD,
  //   pwdTemp: false,
  // },
];

module.exports = PATIENT_DETAILS;
