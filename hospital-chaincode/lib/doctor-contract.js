/**
 * @desc [Smartcontract to read, update patient details in legder]
 */

/*
 * SPDX-License-Identifier: Apache-2.0
 */
"use strict";

const AdminContract = require("./admin-contract.js");
const PrimaryContract = require("./primary-contract.js");

class DoctorContract extends AdminContract {
  //Read patient details based on patientId
  // async readPatient(ctx, patientId) {
  //   let asset = await PrimaryContract.prototype.readPatient(ctx, patientId);

  //   // Get the doctorID, retrieves the id used to connect the network
  //   const doctorId = await this.getClientId(ctx);
  //   // Check if doctor has the permission to read the patient
  //   const permissionArray = asset.permissionGranted;
  //   if (!permissionArray.includes(doctorId)) {
  //     throw new Error(
  //       `The doctor ${doctorId} does not have permission to patient ${patientId}`
  //     );
  //   }
  //   asset = {
  //     patientId: patientId,
  //     firstName: asset.firstName,
  //     lastName: asset.lastName,
  //     age: asset.age,
  //     bloodGroup: asset.bloodGroup,
  //     allergies: asset.allergies,
  //     symptoms: asset.symptoms,
  //     diagnosis: asset.diagnosis,
  //     treatment: asset.treatment,
  //     followUp: asset.followUp,
  //   };
  //   return asset;
  // }

  async readPrescription(ctx, prescriptionId) {
    let asset = await PrimaryContract.prototype.readPrescription(ctx, prescriptionId);

    // Get the doctorID, retrieves the id used to connect the network
    const doctorId = await this.getClientId(ctx);
    // Check if doctor has the permission to read the patient
    const permissionArray = asset.permissionGranted;
    if (!permissionArray.includes(doctorId)) {
      throw new Error(
        `The doctor ${doctorId} does not have permission to prescription ${prescriptionId}`
      );
    }
    asset = {
      prescriptionId: prescriptionId,
      // firstName: asset.firstName,
      // lastName: asset.lastName,
      // age: asset.age,
      // bloodGroup: asset.bloodGroup,
      doctorId: doctorId,
      patientId: asset.patientId,
      allergies: asset.allergies,
      symptoms: asset.symptoms,
      diagnosis: asset.diagnosis,
      treatment: asset.treatment,
      followUp: asset.followUp,
    };
    return asset;
  }

  //This function is to update patient medical details. This function should be called by only doctor.
  async updatePatientMedicalDetails(ctx, args) {
    args = JSON.parse(args);
    let isDataChanged = false;
    let prescriptionId = args.prescriptionId;
    let newSymptoms = args.symptoms;
    let newDiagnosis = args.diagnosis;
    let newTreatment = args.treatment;
    let newFollowUp = args.followUp;
    let updatedBy = args.changedBy;

    const prescription = await PrimaryContract.prototype.readPrescription(ctx, prescriptionId);
    if (!prescription.permissionGranted.includes(args.doctorId)) {
      throw new Error(`Unauthorized Doctor Trying To Update prescription Details`);
    }

    prescription.reports = [];
    if (
      newSymptoms !== null &&
      newSymptoms !== "" &&
      prescription.symptoms !== newSymptoms
    ) {
      prescription.symptoms = newSymptoms;
      isDataChanged = true;
    }

    if (
      newDiagnosis !== null &&
      newDiagnosis !== "" &&
      prescription.diagnosis !== newDiagnosis
    ) {
      prescription.diagnosis = newDiagnosis;
      isDataChanged = true;
    }

    if (
      newTreatment !== null &&
      newTreatment !== "" &&
      prescription.treatment !== newTreatment
    ) {
      prescription.treatment = newTreatment;
      isDataChanged = true;
    }

    if (
      newFollowUp !== null &&
      newFollowUp !== "" &&
      prescription.followUp !== newFollowUp
    ) {
      prescription.followUp = newFollowUp;
      isDataChanged = true;
    }

    if (updatedBy !== null && updatedBy !== "") {
      prescription.changedBy = updatedBy;
    }

    if (isDataChanged === false) return;

    const buffer = Buffer.from(JSON.stringify(prescription));
    await ctx.stub.putState(prescriptionId, buffer);
  }

  //Read patients based on lastname
  async queryPatientsByLastName(ctx, lastName) {
    return await super.queryPatientsByLastName(ctx, lastName);
  }

  //Read patients based on firstName
  async queryPatientsByFirstName(ctx, firstName) {
    return await super.queryPatientsByFirstName(ctx, firstName);
  }

  //Retrieves patient medical history based on patientId
  async getPrescriptionHistory(ctx, prescriptionId) {
    let resultsIterator = await ctx.stub.getHistoryForKey(prescriptionId);
    let asset = await this.getAllPrescritionResults(resultsIterator, true);

    return this.fetchLimitedFields(asset, true);
  }

  //Retrieves all patients details
  // async queryAllPatients(ctx, doctorId) {
  //   let resultsIterator = await ctx.stub.getStateByRange("", "");
  //   let asset = await this.getAllPatientResults(resultsIterator, false);
  //   const permissionedAssets = [];
  //   for (let i = 0; i < asset.length; i++) {
  //     const obj = asset[i];
  //     if (
  //       "permissionGranted" in obj.Record &&
  //       obj.Record.permissionGranted.includes(doctorId)
  //     ) {
  //       permissionedAssets.push(asset[i]);
  //     }
  //   }

  //   return this.fetchLimitedFields(permissionedAssets);
  // }

  async queryAllPrescriptions(ctx, doctorId) {
    let resultsIterator = await ctx.stub.getStateByRange("", "");
    let asset = await this.getAllPrescritionResults(resultsIterator, false);
    const permissionedAssets = [];
    for (let i = 0; i < asset.length; i++) {
      const obj = asset[i];
      if (
        "doctorId" in obj.Record &&
        obj.Record.doctorId === doctorId
      ) {
        permissionedAssets.push(asset[i]);
      }
    }

    return this.fetchLimitedFields(permissionedAssets);
  }

  fetchLimitedFields = (asset, includeTimeStamp = false) => {
    for (let i = 0; i < asset.length; i++) {
      const obj = asset[i];
      asset[i] = {
        prescriptionId: obj.Key,
        // patientId: obj.Key,
        // firstName: obj.Record.firstName,
        // lastName: obj.Record.lastName,
        // age: obj.Record.age,
        // bloodGroup: obj.Record.bloodGroup,
        patientId: obj.Record.patientId,
        doctorId: obj.Record.doctorId,
        allergies: obj.Record.allergies,
        symptoms: obj.Record.symptoms,
        diagnosis: obj.Record.diagnosis,
        treatment: obj.Record.treatment,
        followUp: obj.Record.followUp,
        phoneNumber: obj.Record.phoneNumber,
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
   * @description Get the client used to connect to the network.
   */
  async getClientId(ctx) {
    const clientIdentity = ctx.clientIdentity.getID();
    // Ouput of the above - 'x509::/OU=client/CN=hosp1admin::/C=US/ST=North Carolina/L=Durham/O=hosp1.lithium.com/CN=ca.hosp1.lithium.com'
    let identity = clientIdentity.split("::");
    identity = identity[1].split("/")[2].split("=");
    return identity[1].toString("utf8");
  }
}
module.exports = DoctorContract;
