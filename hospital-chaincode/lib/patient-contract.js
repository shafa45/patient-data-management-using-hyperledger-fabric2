/**
 * @desc [Patient Smartcontract to read, update and delete patient details in legder]
 */

/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const crypto = require("crypto");
const PrimaryContract = require("./primary-contract.js");
let Prescription = require("./Prescription.js")
const { Context } = require("fabric-contract-api");

class PatientContract extends PrimaryContract {

  async createPrescription(ctx, args) {
    args = JSON.parse(args);

    // if (args.password === null || args.password === "") {
    //   throw new Error(
    //     `Empty or null values should not be passed for password parameter`
    //   );
    // }

    let newPrescription = new Prescription(
      args.patientId,
      args.doctorId,
      args.prescriptionId,
      args.changedBy || "",
      args.allergies || "",
      args.symptoms|| "",
      args.diagnosis|| "",
      args.treatment|| "",
      args.followUp|| "",
      args.reports|| []
    );
    console.log(newPrescription)
    const exists = await this.prescriptionExists(ctx, newPrescription.prescriptionId);
    if (exists) {
      throw new Error(`The prescription ${prescriptionId.patientId} already exists`);
    }
    const buffer = Buffer.from(JSON.stringify(newPrescription));
    console.log(buffer);
    // await ctx.stub.putState(prescriptionId.patientId, buffer);
    return ctx.stub.putState(args.prescriptionId, buffer);
  }
  //Read prescription details based on prescriptionId
  async readPrescription(ctx, prescriptionId) {
    return await super.readPrescription(ctx, prescriptionId);
  }

  //Delete patient from the ledger based on patientId
  // async deletePatient(ctx, patientId) {
  //   const exists = await this.patientExists(ctx, patientId);
  //   if (!exists) {
  //     throw new Error(`The patient ${patientId} does not exist`);
  //   }
  //   await ctx.stub.deleteState(patientId);
  // }

  //This function is to update patient personal details. This function should be called by patient.
  // async updatePatientPersonalDetails(ctx, args) {
  //   args = JSON.parse(args);
  //   console.log("Inside Update Patient Contract", args)
  //   let isDataChanged = false;
  //   let patientId = args.patientId;
  //   let newFirstname = args.firstName;
  //   let newLastName = args.lastName;
  //   let newAge = args.age;
  //   let updatedBy = args.changedBy;
  //   let newPhoneNumber = args.phoneNumber;
  //   let newEmergPhoneNumber = args.emergPhoneNumber;
  //   let newAddress = args.address;
  //   let newAllergies = args.allergies;
  //   let newReports = args.reports || [];

  //   const patient = await this.readPatient(ctx, patientId);
  //   if (
  //     newFirstname !== null &&
  //     newFirstname !== "" &&
  //     patient.firstName !== newFirstname
  //   ) {
  //     patient.firstName = newFirstname;
  //     isDataChanged = true;
  //   }

  //   if (
  //     newLastName !== null &&
  //     newLastName !== "" &&
  //     patient.lastName !== newLastName
  //   ) {
  //     patient.lastName = newLastName;
  //     isDataChanged = true;
  //   }

  //   if (newAge !== null && newAge !== "" && patient.age !== newAge) {
  //     patient.age = newAge;
  //     isDataChanged = true;
  //   }

  //   if (updatedBy !== null && updatedBy !== "") {
  //     patient.changedBy = updatedBy;
  //   }

  //   if (
  //     newPhoneNumber !== null &&
  //     newPhoneNumber !== "" &&
  //     patient.phoneNumber !== newPhoneNumber
  //   ) {
  //     patient.phoneNumber = newPhoneNumber;
  //     isDataChanged = true;
  //   }

  //   if (
  //     newEmergPhoneNumber !== null &&
  //     newEmergPhoneNumber !== "" &&
  //     patient.emergPhoneNumber !== newEmergPhoneNumber
  //   ) {
  //     patient.emergPhoneNumber = newEmergPhoneNumber;
  //     isDataChanged = true;
  //   }

  //   if (
  //     newAddress !== null &&
  //     newAddress !== "" &&
  //     patient.address !== newAddress
  //   ) {
  //     patient.address = newAddress;
  //     isDataChanged = true;
  //   }

  //   if (
  //     newAllergies !== null &&
  //     newAllergies !== "" &&
  //     patient.allergies !== newAllergies
  //   ) {
  //     patient.allergies = newAllergies;
  //     isDataChanged = true;
  //   }

  //   if(newReports && Array.isArray(newReports) && newReports.length > 0) {
  //     patient.reports = [...new Set(newReports)];
  //     isDataChanged = true;
  //   }

  //   console.log("isDataChanged", isDataChanged);

  //   if (isDataChanged === false) return;

  //   const buffer = Buffer.from(JSON.stringify(patient));
  //   await ctx.stub.putState(patientId, buffer);
  // }
  async updatePatientPrescriptionDetails(ctx, args) {
    args = JSON.parse(args);
    // console.log("Inside Update Patient Contract", args)
    let isDataChanged = false;
    let prescriptionId = args.prescriptionId;
    let updatedBy = args.changedBy;
    let newAllergies = args.allergies;
    let newReports = args.reports || [];

    const prescription = await this.readPrescription(ctx, prescriptionId);
    
    if (updatedBy !== null && updatedBy !== "") {
      prescription.changedBy = updatedBy;
    }

    if (
      newAllergies !== null &&
      newAllergies !== "" &&
      prescription.allergies !== newAllergies
    ) {
      prescription.allergies = newAllergies;
      isDataChanged = true;
    }

    if(newReports && Array.isArray(newReports) && newReports.length > 0) {
      prescription.reports = [...new Set(newReports)];
      isDataChanged = true;
    }

    console.log("isDataChanged", isDataChanged);

    if (isDataChanged === false) return;

    const buffer = Buffer.from(JSON.stringify(prescription));
    await ctx.stub.putState(prescriptionId, buffer);
  }

  //This function is to update patient password. This function should be called by patient.
  // async updatePatientPassword(ctx, args) {
  //   args = JSON.parse(args);
  //   let patientId = args.patientId;
  //   let newPassword = args.newPassword;

  //   if (newPassword === null || newPassword === "") {
  //     throw new Error(
  //       `Empty or null values should not be passed for newPassword parameter`
  //     );
  //   }

  //   const patient = await this.readPatient(ctx, patientId);
  //   patient.password = crypto
  //     .createHash("sha256")
  //     .update(newPassword)
  //     .digest("hex");
  //   if (patient.pwdTemp) {
  //     patient.pwdTemp = false;
  //     patient.changedBy = patientId;
  //   }
  //   const buffer = Buffer.from(JSON.stringify(patient));
  //   await ctx.stub.putState(patientId, buffer);
  // }

  //Returns the patient's password
  // async getPatientPassword(ctx, patientId) {
  //   let patient = await this.readPatient(ctx, patientId);
  //   patient = {
  //     password: patient.password,
  //     pwdTemp: patient.pwdTemp,
  //   };
  //   return patient;
  // }

  //Retrieves patient medical history based on patientId
  async getPrescriptionHistory(ctx, prescriptionId) {
    let resultsIterator = await ctx.stub.getHistoryForKey(prescriptionId);
    let asset = await this.getAllPrescritionResults(resultsIterator, true);

    return this.fetchLimitedFields(asset, true);
  }

  fetchLimitedFields = (asset, includeTimeStamp = false) => {
    for (let i = 0; i < asset.length; i++) {
      const obj = asset[i];
      asset[i] = {
        prescriptionId: obj.Key,
        // firstName: obj.Record.firstName,
        // lastName: obj.Record.lastName,
        // age: obj.Record.age,
        // address: obj.Record.address,
        // phoneNumber: obj.Record.phoneNumber,
        // emergPhoneNumber: obj.Record.emergPhoneNumber,
        // bloodGroup: obj.Record.bloodGroup,
        allergies: obj.Record.allergies,
        symptoms: obj.Record.symptoms,
        diagnosis: obj.Record.diagnosis,
        treatment: obj.Record.treatment,
        followUp: obj.Record.followUp,
        reports: obj.Record.reports || []
      };
      if (includeTimeStamp) {
        asset[i].changedBy = obj.Record.changedBy;
        asset[i].Timestamp = obj.Timestamp;
      }
    }

    return asset;
  };

  /**
   * @description Add the doctor to the permissionGranted array
   */
  async grantAccessToDoctor(ctx, args) {
    args = JSON.parse(args);
    let patientId = args.patientId;
    let doctorId = args.doctorId;
    const prescriptionId = patientId + ":" + doctorId;
    // console.log("patientId", patientId);
    // console.log("doctorId", doctorId);

    // Get the patient asset from world state
    // console.log("Before Prescription created");
    // args = JSON.stringify({patientId, doctorId,prescriptionId})
    // args = [args]
    // const createPrescriptionRes = await this.createPrescription(ctx, args)
    // console.log("After Prescription created");
    const prescription = await this.readPrescription(ctx, prescriptionId);
    console.log("Prescription read", prescription);
    // console.log("patient granting access: ", patient)
    // unique doctorIDs in permissionGranted
    if (!prescription.permissionGranted.includes(doctorId)) {
      prescription.permissionGranted.push(doctorId);
      prescription.doctorId = doctorId;
      prescription.changedBy = patientId;
    }
    console.log("Prescription permission granted");
    const buffer = Buffer.from(JSON.stringify(prescription));
    console.log("Prescription before ledger");
    // Update the ledger with updated permissionGranted
    await ctx.stub.putState(prescriptionId, buffer);
    console.log("Prescription after ledger");
  }  

  /**
   * @description Remove the doctor from the permissionGranted array
   */
  async revokeAccessFromDoctor(ctx, args) {
    args = JSON.parse(args);
    let patientId = args.patientId;
    let doctorId = args.doctorId;
    const prescriptionId = patientId + ":" + doctorId;
    // Get the patient asset from world state
    const prescription = await this.readPrescription(ctx, prescriptionId)

    // const patient = await this.readPatient(ctx, patientId);
    // Remove the doctor if existing
    if (prescription.permissionGranted.includes(doctorId)) {
      prescription.permissionGranted = prescription.permissionGranted.filter(
        (doctor) => doctor !== doctorId
      );
      prescription.changedBy = patientId;
    }
    prescription.doctorId = null;
    const buffer = Buffer.from(JSON.stringify(prescription));
    // Update the ledger with updated permissionGranted
    await ctx.stub.putState(prescriptionId, buffer);
  }
}
module.exports = PatientContract;
