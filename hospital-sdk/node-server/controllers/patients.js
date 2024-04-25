const {
  ROLE_ADMIN,
  ROLE_DOCTOR,
  ROLE_PATIENT,
  capitalize,
  validateRole,
} = require("../utils/utils.js");
const network = require("../../fabric-network/app.js");
const { UserDetails } = require("../db/schema.js");

/**
 * @param  {Request} req Role in the header and patientId in the url
 * @param  {Response} res Body consists of json of the patient object
 * @description This method retrives an existing patient from the ledger
 */
const getPatientById = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  const isValidate = await validateRole(
    [ROLE_DOCTOR, ROLE_PATIENT],
    userRole,
    res
  );
  if (isValidate) return res.status(401).json({ message: "Unauthorized Role" });

  // const patientId = req.headers.username;
  const patientId = req.params.patientId
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  if (networkObj.error) return res.status(400).send(networkObj.error);
  const response = await UserDetails.findOne({ username: patientId });
  console.log("pat",response)
  response.error
    ?
    res.status(500).send(response.error) :
    res.status(200).send(response);
  // Invoke the smart contract function
  // console.log("Invoking patient contract")
  // const response = await network.invoke(
  //   networkObj,
  //   true,
  //   capitalize(userRole) + "Contract:readPatient",
  //   patientId
  // );
  // console.log("response", response)
  // response.error
  //   ? res.status(400).send(response.error)
  //   : res.status(200).send(JSON.parse(response));
};

const getPrescriptionById = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  const isValidate = await validateRole(
    [ROLE_DOCTOR, ROLE_PATIENT],
    userRole,
    res
  );
  if (isValidate) return res.status(401).json({ message: "Unauthorized Role" });

  const prescriptionId = req.params.prescriptionId;
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  if (networkObj.error) return res.status(400).send(networkObj.error);
  // Invoke the smart contract function
  console.log("Invoking patient contract")
  const response = await network.invoke(
    networkObj,
    true,
    capitalize(userRole) + "Contract:readPrescription",
    prescriptionId
  );
  console.log("response", response)
  response.error
    ? res.status(400).send(response.error)
    : res.status(200).send(JSON.parse(response));
};

/**
 * @param  {Request} req Body must be a json, role in the header and patientId in the url
 * @param  {Response} res A 200 response if patient is updated successfully else a 500 response with s simple message json
 * @description  This method updates an existing patient personal details. This method can be executed only by the patient.
 */
// const updatePatientPersonalDetails = async (req, res) => {
//   // User role from the request header is validated
//   const userRole = req.headers.role;
//   console.log("userRole", userRole);
//   const isValidate = await validateRole([ROLE_PATIENT], userRole, res);
//   if (isValidate) return res.status(401).json({ message: "Unauthorized Role" });

//   // The request present in the body is converted into a single json string
//   let args = req.body;
//   args.patientId = req.headers.username;
//   args.changedBy = req.headers.username;
//   args = [JSON.stringify(args)];
//   // Set up and connect to Fabric Gateway
//   const networkObj = await network.connectToNetwork(req.headers.username);
//   if (networkObj.error) return res.status(400).send(networkObj.error);
//   // Invoke the smart contract function
//   const response = await network.invoke(
//     networkObj,
//     false,
//     capitalize(userRole) + "Contract:updatePatientPersonalDetails",
//     args
//   );
//   response.error
//     ? res.status(500).send(response.error)
//     : res.status(200).send("Successfully Updated Patient.");
// };

const updatePatientPersonalDetails = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  console.log("userRole", userRole);
  const isValidate = await validateRole([ROLE_PATIENT], userRole, res);
  if (isValidate) return res.status(401).json({ message: "Unauthorized Role" });

  // The request present in the body is converted into a single json string
  let args = req.body;
  const updatedPatient = await UserDetails.updateOne({ username: req.headers.username }, { $set: args });
  if (updatedPatient.error) {
    return res.status(500).send(updatedPatient);
  } 
  res.status(200).send("Successfully Updated Patient.");
  // args.patientId = req.headers.username;
  // args.prescriptionId = req.params.prescriptionId;
  // args.changedBy = req.headers.username;
  // args = [JSON.stringify(args)];
  // // Set up and connect to Fabric Gateway
  // const networkObj = await network.connectToNetwork(req.headers.username);
  // if (networkObj.error) return res.status(400).send(networkObj.error);
  // // Invoke the smart contract function
  // const response = await network.invoke(
  //   networkObj,
  //   false,
  //   capitalize(userRole) + "Contract:updatePatientPrescriptionDetails",
  //   args
  // );
  // response.error
  //   ? res.status(500).send(response.error)
  //   : res.status(200).send("Successfully Updated Patient Prescription.");
};

/**
 * @param  {Request} req Role in the header and patientId in the url
 * @param  {Response} res Body consists of json of history of the patient object consists of time stamps and patient object
 * @description Retrives the history transaction of an asset(Patient) in the ledger
 */
// const getPatientHistoryById = async (req, res) => {
//   // User role from the request header is validated
//   const userRole = req.headers.role;
//   const isValidate = await validateRole(
//     [ROLE_DOCTOR, ROLE_PATIENT],
//     userRole,
//     res
//   );
//   if (isValidate) return res.status(401).json({ message: "Unauthorized Role" });

//   const patientId = req.params.patientId;
//   // Set up and connect to Fabric Gateway
//   const networkObj = await network.connectToNetwork(req.headers.username);
//   if (networkObj.error) return res.status(400).send(networkObj.error);
//   // Invoke the smart contract function
//   const response = await network.invoke(
//     networkObj,
//     true,
//     capitalize(userRole) + "Contract:getPatientHistory",
//     patientId
//   );
//   const parsedResponse = await JSON.parse(response);
//   response.error
//     ? res.status(400).send(response.error)
//     : res.status(200).send(parsedResponse);
// };
const getPatientHistoryById = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  const patientId = req.params.patientId;
  const prescriptionId = patientId + ":" + req.headers.username;
  console.log("prescriptionId", prescriptionId)
  const isValidate = await validateRole(
    [ROLE_DOCTOR, ROLE_PATIENT],
    userRole,
    res
  );
  if (isValidate) return res.status(401).json({ message: "Unauthorized Role" });
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  if (networkObj.error) return res.status(400).send(networkObj.error);
  // Invoke the smart contract function
  const response = await network.invoke(
    networkObj,
    true,
    capitalize(userRole) + "Contract:getPrescriptionHistory",
    prescriptionId
  );
  const parsedResponse = await JSON.parse(response);
  console.log("parsedResponse", parsedResponse)
  response.error
    ? res.status(400).send(response.error)
    : res.status(200).send(parsedResponse);
};
const getPrescriptionHistoryById = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  const prescriptionId = req.params.prescriptionId
  console.log("prescriptionId", prescriptionId)
  const isValidate = await validateRole(
    [ROLE_PATIENT],
    userRole,
    res
  );
  if (isValidate) return res.status(401).json({ message: "Unauthorized Role" });
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  if (networkObj.error) return res.status(400).send(networkObj.error);
  // Invoke the smart contract function
  const response = await network.invoke(
    networkObj,
    true,
    capitalize(userRole) + "Contract:getPrescriptionHistory",
    prescriptionId
  );
  const parsedResponse = await JSON.parse(response);
  console.log("parsedResponse", parsedResponse)
  response.error
    ? res.status(400).send(response.error)
    : res.status(200).send(parsedResponse);
};

/**
 * @param  {Request} req Role in the header and hospitalId in the url
 * @param  {Response} res 200 response with array of all doctors else 500 with the error message
 * @description Get all the doctors of the mentioned hospitalId
 */
const getDoctorsByHospitalId = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  const isValidate = await validateRole(
    [ROLE_PATIENT, ROLE_ADMIN],
    userRole,
    res
  );
  if (isValidate) return res.status(401).json({ message: "Unauthorized Role" });
  const hospitalId = parseInt(req.params.hospitalId);
  // Set up and connect to Fabric Gateway
  userId =
    hospitalId === 1
      ? "hosp1admin"
      : hospitalId === 2
      ? "hosp2admin"
      : "hosp3admin";
  const networkObj = await network.connectToNetwork(userId);
  if (networkObj.error) return res.status(400).send(networkObj.error);
  // Use the gateway and identity service to get all users enrolled by the CA
  const response = await network.getAllDoctorsByHospitalId(
    networkObj,
    hospitalId
  );
  response.error
    ? res.status(500).send(response.error)
    : res.status(200).send(response);
};
/**
 * @param  {Request} req Role in the header. patientId, doctorId in the url
 * @param  {Response} res 200 response if access was granted to the doctor else 500 with the error message
 * @description Patient grants access to the doctor.
 */
const grantAccessToDoctor = async (req, res) => {
  // User role from the request header is validated
  console.log("Inside grantAccessToDoctor", req.headers.username, req.params.doctorId )
  const userRole = req.headers.role;
  const isValidate = await validateRole([ROLE_PATIENT], userRole, res);
  if (isValidate) return res.status(401).json({ message: "Unauthorized Role" });

  const patientId = req.headers.username;
  const doctorId = req.params.doctorId;
  const prescriptionId = patientId + ":" + doctorId;
  let args = { patientId: patientId, doctorId: doctorId, prescriptionId: prescriptionId };
  args = [JSON.stringify(args)];
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  if (networkObj.error) return res.status(400).send(networkObj.error);
  console.log("Invoking smart  createPrescription")
  const response1 = await network.invoke(
    networkObj,
    false,
    capitalize(userRole) + "Contract:createPrescription",
    args
  );
  if(response1.error) {
    return  res.status(500).send(response1.error);
  }
  // Invoke the smart contract function
  console.log("Invoking smart  grantAccessToDoctor")
  const response2 = await network.invoke(
    networkObj,
    false,
    capitalize(userRole) + "Contract:grantAccessToDoctor",
    args
  );
  if(response2.error) {
    return  res.status(500).send(response2.error);
  }
  
    // const patient = UserDetails.updateOne({ username: patientId }, 
    //     { $push: { permissionGranted: doctorId} });
    // if (patient.error) {
    //   return res.status(500).send(patient)
    // }
    const patient = await UserDetails.updateOne({ username: patientId },
      { $push: { permissionGranted: doctorId, prescriptions: prescriptionId } });
    if (patient.error) 
      res.status(500).send(patient);
     res.status(200).send(`Access granted to ${doctorId}`);
};

const updatePrescriptionMedicalDetails = async (req, res) => {
  // User role from the request header is validated
  console.log("Inside updatePrescriptionMedicalDetails")
  const userRole = req.headers.role;
  const isValidate = await validateRole([ROLE_PATIENT], userRole, res);
  if (isValidate) return res.status(401).json({ message: "Unauthorized Role" });

  const patientId = req.headers.username;
  const prescriptionId = req.params.prescriptionId;
  let args = req.body;
  args.changedBy = patientId
  args = [JSON.stringify(args)];
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  if (networkObj.error) return res.status(400).send(networkObj.error);
  console.log("Invoking smart  createPrescription")
  const response1 = await network.invoke(
    networkObj,
    false,
    capitalize(userRole) + "Contract:updatePatientPrescriptionDetails",
    args
  );
  if(response1.error) {
    return  res.status(500).send(response1.error);
  }

  res.status(200).send(`Prescription Updated Successfully!`);
};
/**
 * @param  {Request} req Role in the header. patientId, doctorId in the url
 * @param  {Response} res 200 response if access was revoked from the doctor else 500 with the error message
 * @description Patient revokes access from the doctor.
 */
const revokeAccessFromDoctor = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  const isValidate = await validateRole([ROLE_PATIENT], userRole, res);
  if (isValidate) return res.status(401).json({ message: "Unauthorized Role" });
  const patientId = req.headers.username;
  const doctorId = req.params.doctorId;
  let args = { patientId: patientId, doctorId: doctorId };
  args = [JSON.stringify(args)];
  const patient = await UserDetails.findOne({ username: patientId });
  //remove 
  const updatedPatient = await UserDetails.updateOne({ username: patientId }, { $pull: { permissionGranted: doctorId } });
  if (updatedPatient.error) {
    return res.status(500).send(updatedPatient);
  }
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  if (networkObj.error) return res.status(400).send(networkObj.error);
  // Invoke the smart contract function
  const response = await network.invoke(
    networkObj,
    false,
  capitalize(userRole) + "Contract:revokeAccessFromDoctor",
    args
  );
  response.error
    ? res.status(500).send(response.error)
    : res.status(200).send(`Access revoked from ${doctorId}`);
};

const getAllPrescriptions = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  const isValidate = await validateRole([ROLE_PATIENT], userRole, res);
  if (isValidate) return res.status(401).json({ message: "Unauthorized Role" });

  const patientId = req.headers.username;
  // Set up and connect to Fabric 
  const patient = await UserDetails.findOne({ username: patientId });
  const prescriptionIds = patient.prescriptions;
  
  
  //Invoke smarkt contract for each prescriptionIds
  let prescriptions = [];
  console.log("prescriptionIds", prescriptionIds)
  for (let i = 0; i < prescriptionIds.length; i++) {
    const networkObj = await network.connectToNetwork(patientId);
    if (networkObj.error) return res.status(400).send(networkObj.error);
    const response = await network.invoke(
      networkObj,
      true,
      capitalize(userRole) + "Contract:readPrescription",
      prescriptionIds[i]
    );
    const parsedResponse = await JSON.parse(response);
    prescriptions.push(parsedResponse);
  }

  res.status(200).send(prescriptions);
  // Invoke the smart contract function
  // const response = await network.invoke(
  //   networkObj,
  //   true,
  //   capitalize(userRole) + "Contract:getAllPrescriptions",
  //   doctorId
  // );
  // response.error
  //   ? res.status(400).send(response.error)
  //   : res.status(200).send(response);
}

module.exports = {
  revokeAccessFromDoctor,
  grantAccessToDoctor,
  getDoctorsByHospitalId,
  getPatientHistoryById,
  getPatientById,
  getPrescriptionById,
  updatePatientPersonalDetails,
  getAllPrescriptions,
  getPrescriptionHistoryById,
  updatePrescriptionMedicalDetails
};
