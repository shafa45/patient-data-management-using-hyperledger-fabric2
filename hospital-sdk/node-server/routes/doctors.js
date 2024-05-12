const express = require("express");
const { authenticateJWT } = require("../middleware/verifyJwtToken");
const {
  updatePatientMedicalDetails,
  getDoctorById,
  getPatientMedicalReport,
  getAllReadOnlyPrescriptions,
} = require("../controllers/doctors");

const router = express.Router();

// Doctor Routes //

router.patch(
  "/patients/:patientId/details/medical",
  authenticateJWT,
  updatePatientMedicalDetails
);
// router.patch(
//   "/patients/:prescriptionId/details/medical",
//   authenticateJWT,
//   updatePatientMedicalDetails
// );

//medical report routes for doctor
router.get(
  "/patients/:prescriptionId/details/medical/report/:reportId",
  authenticateJWT,
  getPatientMedicalReport
);

router.get("/hello", (req, res) => {
  res.send("Hello from doctors");
});

router.get(
  // "/:hospitalId([0-9]+)/:doctorId(HOSP[0-9]+-DOC[0-9]+)",
  "/:hospitalId/:doctorId",
  authenticateJWT,
  getDoctorById
);

router.get(
  "/prescriptions/all/read_only",
  authenticateJWT,
  getAllReadOnlyPrescriptions
)

module.exports = router;
