const Bytescale = require('@bytescale/sdk');
const {
  ROLE_DOCTOR,
  capitalize,
  validateRole,
  ROLE_ADMIN,
} = require('../utils/utils.js');
const network = require('../../fabric-network/app.js');
const { UserDetails } = require('../db/schema.js');

/**
 * @param  {Request} req Body must be a json, role in the header and patientId in the url
 * @param  {Response} res A 200 response if patient is updated successfully else a 500 response with s simple message json
 * @description Updates an existing asset(patient medical details) in the ledger. This method can be executed only by the doctor.
 */
const updatePatientMedicalDetails = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  const isValidate = await validateRole([ROLE_DOCTOR], userRole, res);
  if (isValidate) return res.status(401).json({ message: 'Unauthorized Role' });
  let args = req.body;
  const prescriptionId = req.params.patientId + ':' + req.headers.username;
  args.prescriptionId = prescriptionId;
  args.changedBy = req.headers.username;
  args.doctorId = req.headers.username;
  args = [JSON.stringify(args)];
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  if (networkObj.error) return res.status(400).send(networkObj.error);
  // Invoke the smart contract function
  const response = await network.invoke(
    networkObj,
    false,
    capitalize(userRole) + 'Contract:updatePatientMedicalDetails',
    args
  );
  response.error
    ? res.status(500).send(response.error)
    : res.status(200).send('Successfully Updated Patient Details.');
};

/**
 * @param  {Request} req Body must be a json, role in the header and patientId in the url and reportId in the url
 * @param  {Response} res A 200 response if patient is updated successfully else a 500 response with s simple message json
 * @description Retrieves an existing patient medical report from the ledger. This method can be executed only by the doctor.
 */

const getPatientMedicalReport = async (req, res) => {
  // User role from the request header is validated
  // console.log("Inside Patient Medical Report")
  const reportId = req.params.reportId;
  // const userRole = req.headers.role;
  // const isValidate = await validateRole([ROLE_DOCTOR], userRole, res);
  // if (isValidate) return res.status(401).json({ message: "Unauthorized Role" });
  // // Set up and connect to Fabric Gateway
  // const networkObj = await network.connectToNetwork(req.headers.username);
  // if (networkObj.error) return res.status(400).send(networkObj.error);
  // // Invoke the smart contract function
  // const response = await network.query(
  //   networkObj,
  //   capitalize(userRole) + "Contract:getPatientMedicalReport",
  //   req.params.patientId,
  //   reportId
  // );
  // response.error
  //   ? res.status(500).send(response.error)
  //   : res.status(200).send(response);

  const response = Bytescale.UrlBuilder.url({
    accountId: 'FW25bzs',
    filePath: reportId,
  });

  console.log('response', response);
  return res.status(200).send(response);
};

/**
 * @param  {Request} req role in the header and hospitalId, doctorId in the url
 * @param  {Response} res A 200 response if doctor is present else a 500 response with a error json
 * @description This method retrives an existing doctor
 */
const getDoctorById = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  const isValidate = await validateRole([ROLE_DOCTOR], userRole, res);
  if (isValidate) return res.status(401).json({ message: 'Unauthorized Role' });
  const hospitalId = parseInt(req.params.hospitalId);
  // Set up and connect to Fabric Gateway
  const userId =
    hospitalId === 1
      ? 'hosp1admin'
      : hospitalId === 2
      ? 'hosp2admin'
      : 'hosp3admin';
  const doctorId = req.headers.username;
  const networkObj = await network.connectToNetwork(userId);
  if (networkObj.error) return res.status(400).send(networkObj.error);
  // Use the gateway and identity service to get all users enrolled by the CA
  const response = await network.getAllDoctorsByHospitalId(
    networkObj,
    hospitalId
  );
  // Filter the result using the doctorId
  response.error
    ? res.status(500).send(response.error)
    : res.status(200).send(
        response.filter(function (response) {
          return response.id === doctorId;
        })[0]
      );
};

const getAllReadOnlyPrescriptions = async (req, res) => {
  try {
    let userRole = req.headers.role;
    const isValidate = await validateRole([ROLE_DOCTOR], userRole, userRole);
    if (isValidate)
      return res.status(401).json({ message: 'Unauthorized Role' });
    userRole = ROLE_ADMIN;
    const doctorId = req.headers.username;
    const doctor = await UserDetails.findOne({ username: doctorId });
    const prescriptionIds = doctor.viewAccess;
    console.log('prescriptionIds', prescriptionIds);
    let prescriptions = [];
    console.log('prescriptionIds', prescriptionIds);
    for (let i = 0; i < prescriptionIds.length; i++) {
      const networkObj = await network.connectToNetwork(doctorId);
      if (networkObj.error) return res.status(400).send(networkObj.error);
      const response = await network.invoke(
        networkObj,
        true,
        capitalize(userRole) + 'Contract:readPrescription',
        prescriptionIds[i]
      );
      const parsedResponse = await JSON.parse(response);
      prescriptions.push(parsedResponse);
    }
    res.status(200).send(prescriptions);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = {
  getDoctorById,
  updatePatientMedicalDetails,
  getPatientMedicalReport,
  getAllReadOnlyPrescriptions,
};
