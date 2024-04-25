import { withAuth } from "@/components/Auth";
import Loader from "@/components/Helper/Loader";
import PrescriptionUnderPatient from "@/components/Patients/PrescriptionUnderPatient";
import { getPrescriptionsUnderPatient } from "@/redux/actions/patientActions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { PatientPrescritionDetailsUpdateByPatient } from "@/types/patient";
import React, { useEffect } from "react";

// List of Prescriptions granted to the doctor by the patients
const AuthorisedPatientsForDoctors = () => {
  const dispatch = useAppDispatch();
  const patient = useAppSelector((state) => state.patient);

  useEffect(() => {
    dispatch(getPrescriptionsUnderPatient());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (patient.loading) return <Loader />;

  if (patient.prescriptions.length === 0)
    return (
      <div
        className="flex justify-center items-center font-bold text-xl mt-12"
        style={{ minHeight: "calc(100vh - 300px)" }}
      >
        {/* No Patients Granted Access To You... !
         */}
         No Prescription Yet... !
      </div>
    );

  return (
    // bug
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-wrap justify-center lg:justify-normal flex-col lg:flex-row mt-3 px-6 gap-6">
        {patient.prescriptions.map(
          (data: PatientPrescritionDetailsUpdateByPatient, index: number) => {
            return <PrescriptionUnderPatient key={data.prescriptionId} prescriptionDetail={data} />;
          }
        )}
        {/* {
          JSON.stringify(patient.prescriptions, null, 2)
        } */}
      </div>
    </div>
  );
};

export default withAuth(AuthorisedPatientsForDoctors);
