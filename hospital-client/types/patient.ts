export interface PatientDetails {
  [key: string]: FormDataEntryValue | null;
}

export interface PatientUpdatePersonalDetails {
  firstName: string,
  lastName: string,
  age: string;
  address: string;
  bloodGroup: string;
  emergPhoneNumber?: string;
  phoneNumber: string;
  
}

export interface DoctorUpdatePatientRecords {
  followUp: string;
  allergies: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  bloodGroup?: string;
}

export interface PatientHistory extends DoctorUpdatePatientRecords {
  changedBy: string;
  Timestamp: { seconds: string; nanos: string };
  reports: Array<string>;
}
export interface PatientDetailsUpdateByDoctor
  extends DoctorUpdatePatientRecords {
  age: string;
  patientId: string;
  phoneNumber: string
  // disabledUpdate?: boolean;
  prescriptionId: string;
}

export interface PatientPrescritionDetailsUpdateByDoctor extends DoctorUpdatePatientRecords {
  patientId: string;
  doctorId: string;
  prescriptionId: string;
}

export interface PatientPrescritionDetailsUpdateByPatient extends PatientPrescritionDetailsUpdateByDoctor {
  reports?: Array<string>;
  permissionGranted?: string[]
}


export interface PrescriptionHistory extends PatientPrescritionDetailsUpdateByDoctor {
  changedBy: string;
  Timestamp: { seconds: string; nanos: string };
  reports: Array<string>;
}

export interface PatientRegistrationFields
  extends PatientUpdatePersonalDetails {
  password: string;
  hospitalId: string;
  username: string;
}

export interface PatientPersonalDetails {
  patientId: string;
  firstName: string;
  lastName: string;
  age: string;
  phoneNumber: string;
  emergPhoneNumber: string;
  address: string;
  bloodGroup: string;
  permissionGranted: string[];
  prescriptions: string[];
  prescriptionsToDoctors?: any;
}
