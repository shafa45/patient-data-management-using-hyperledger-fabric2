import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios/axiosInterceptor";
import { API_BASE_URL } from "@/constants/constants";
import { patient } from "../slices/patients";

export const getPatientPersonalDetails = createAsyncThunk(
  "patient/getPatientPersonalDetails",
  async (patientId: string, thunkAPI) => {
    try {
      thunkAPI.dispatch(patient.actions.isPending());
      const response = await axiosInstance.get(
        `${API_BASE_URL}/patients/${patientId}`
      );
      thunkAPI.dispatch(
        patient.actions.getPatientPersonalDetails(response.data)
      );
    } catch (error) {
      console.error(error, "error");
      thunkAPI.dispatch(
        patient.actions.isError(
          "Retrieving All Patient Records Failed. Please Try Again.."
        )
      );
    } finally {
      thunkAPI.dispatch(patient.actions.isFullfilled());
    }
  }
);

export const getPrescriptionsUnderPatient = createAsyncThunk(
  "patient/getPrescriptionsUnderPatient",
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(patient.actions.isPending());
      const response = await axiosInstance.get(
        `${API_BASE_URL}/patients/prescriptions/_all`
      );
      thunkAPI.dispatch(patient.actions.getPrescriptionsUnderPatient(response.data));
    } catch (error) {
      thunkAPI.dispatch(
        patient.actions.isError(
          "Fetching Prescriptions Under Patient Failed. Please Try Again.."
        )
      );
      console.error(error, "error");
    } finally {
      thunkAPI.dispatch(patient.actions.isFullfilled());
    }
  }
);
