const express = require("express");
const { authenticateJWT } = require("../middleware/verifyJwtToken");
const {
  getPatientById,
  updatePatientPersonalDetails,
  getPatientHistoryById,
  getDoctorsByHospitalId,
  grantAccessToDoctor,
  revokeAccessFromDoctor,
  getPrescriptionById,
  getAllPrescriptions,
  getPrescriptionHistoryById,
  updatePrescriptionMedicalDetails,
  grantViewAccessToDoctor,
  revokeViewAccessFromDoctor
} = require("../controllers/patients");

const router = express.Router();

//  Patient Routes //
router.get( "/prescriptions/_all", authenticateJWT,getAllPrescriptions)
router.get("/:patientId", authenticateJWT, getPatientById);
router.get("/:prescriptionId", authenticateJWT, getPrescriptionById);
router.patch(
  "/:patientId/update/personaldetails",
  authenticateJWT,
  updatePatientPersonalDetails
);
router.patch(
  "/:prescriptionId/update/personaldetails",
  authenticateJWT,
  updatePatientPersonalDetails
);
router.get("/:patientId/history", authenticateJWT, getPatientHistoryById);
router.get("/prescription/:prescriptionId/history", authenticateJWT, getPrescriptionHistoryById);
// router.get("/:prescriptionId/history", authenticateJWT, getPatientHistoryById);
router.get(
  // "/doctors/:hospitalId([0-9]+)/_all",
  "/doctors/:hospitalId/_all",
  authenticateJWT,
  getDoctorsByHospitalId
);
router.get(
  // "/doctors/:hospitalId([0-9]+)/_all",
  "/doctors/:hospitalId/_all",
  authenticateJWT,
  getDoctorsByHospitalId
);
 router.patch(
   "/:patientId/grant/:doctorId",
   authenticateJWT,
   grantAccessToDoctor
 );
/*router.patch(
  "/:prescriptionId/grant/:doctorId",
  authenticateJWT,
  grantAccessToDoctor
);*/
// router.patch(
//   "/:patientId/revoke/:doctorId",
//   authenticateJWT,
//   revokeAccessFromDoctor
// );
router.patch(
  "/:patientId/revoke/:doctorId",
  authenticateJWT,
  revokeAccessFromDoctor
);
router.patch(
  "/:prescriptionId/details/medical",
  authenticateJWT,
  updatePrescriptionMedicalDetails
);
router.patch(
  "/prescriptions/grant",
  authenticateJWT,
  grantViewAccessToDoctor
)
router.patch(
  "/prescriptions/revoke",
  authenticateJWT,
  revokeViewAccessFromDoctor
)

// router.get(
//   "/prescriptions/_all",
//   authenticateJWT,
//   getAllPrescriptions
// )
module.exports = router;
