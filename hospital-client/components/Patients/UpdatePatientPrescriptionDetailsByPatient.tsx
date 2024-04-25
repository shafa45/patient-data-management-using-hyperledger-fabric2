import { API_BASE_URL } from "@/constants/constants";
import { useAppDispatch } from "@/redux/store";
import {
  DoctorUpdatePatientRecords,
  PatientDetailsUpdateByDoctor,
  PatientPrescritionDetailsUpdateByPatient
} from "@/types/patient";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import axiosInstance from "@/redux/axios/axiosInterceptor";
import { getPrescriptionsUnderPatient } from "@/redux/actions/patientActions";
import { Upload } from "../Helper/Upload";

type prescriptionDetail = {
  prescriptionDetails: PatientPrescritionDetailsUpdateByPatient;
  closeModal: () => void;
};
const UpdatePatientPrescriptionDetailsByPatient: React.FC<prescriptionDetail> = ({
  prescriptionDetails,
  closeModal,
}) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reports, setReports] = useState([]);

  function fileUpload(files: any) {
    console.log("files", files);
    const file_urls = files?.map((file: any) => file?.fileUrl)
    setReports(file_urls);
    console.log("reports", reports)
  }

  const UpdateDetails = async (prescriptionDetails: PatientPrescritionDetailsUpdateByPatient) => {
    setIsSubmitting(true);
    console.log("updatePayload", prescriptionDetails)
    try {
      if(reports.length > 0) {
        prescriptionDetails.reports = reports;
      }
      toast.loading("Updating Records..");
      await axiosInstance.patch(
        `${API_BASE_URL}/patients/${prescriptionDetails.prescriptionId}/details/medical`,
        prescriptionDetails
      );

      dispatch(getPrescriptionsUnderPatient());
      closeModal();
      toast.dismiss();
      toast.success("Successfully Updated Details..");
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("Updating Details Failed. Please Try Again..");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex  justify-center mt-8">
      <div className="bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md  xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-lg font-semibold leading-tight tracking-tight text-gray-900  dark:text-white">
            <i className="fas fa-pencil-alt mr-2"></i>
            Update Details
          </h1>
          <Formik initialValues={prescriptionDetails} onSubmit={UpdateDetails}>
            {() => (
              <Form className="space-y-4 md:space-y-6">
                 <div className="w-full">
                    <label
                      htmlFor="allergies"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Allergies
                    </label>
                    <Field
                      type="text"
                      name="allergies"
                      id="allergies"
                      placeholder=""
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
                    />
                    <ErrorMessage
                      name="allergies"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                <div className="w-full">
                   <Upload handleFile={fileUpload}/>
                </div>

                <button
                  type="submit"
                  // disabled={authState.loading}
                  className="w-full text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  {isSubmitting ? "Updating.." : "Update"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default UpdatePatientPrescriptionDetailsByPatient;
