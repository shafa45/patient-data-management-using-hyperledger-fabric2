class Prescription {
    constructor(
      patientId,
      doctorId,
      prescriptionId,
    //   firstName,
    //   lastName,
    //   password,
    //   age,
    //   phoneNumber,
    //   emergPhoneNumber,
    //   address,
    //   bloodGroup,
      changedBy = "",
      allergies = "",
      symptoms = "",
      diagnosis = "",
      treatment = "",
      followUp = "",
      reports = [],
      permissionGranted = []
    ) {
      this.patientId = patientId;
    //   this.firstName = firstName;
    //   this.lastName = lastName;
    //   this.password = password;
    //   this.age = age;
    //   this.phoneNumber = phoneNumber;
    //   this.emergPhoneNumber = emergPhoneNumber;
    //   this.address = address;
    //   this.bloodGroup = bloodGroup;
     this.doctorId = doctorId;
     this.prescriptionId = prescriptionId || (patientId + ":" + doctorId);
      this.changedBy = changedBy;
      this.allergies = allergies;
      this.symptoms = symptoms;
      this.diagnosis = diagnosis;
      this.treatment = treatment;
      this.followUp = followUp;
      this.pwdTemp = true;
      this.permissionGranted = [];
      this.reports = reports;
      return this;
    }
  }
  module.exports = Prescription;
  