import { ROLE_ADMIN, ROLE_DOCTOR, ROLE_PATIENT } from "@/constants/constants";
import { redirectToProfilePage } from "./routeUtils";

const HomePath = {
  name: "Home",
  href: "/",
  icon: {
    default: "fal fa-home",
    active: "fas fa-home",
  },
  current: false,
};

export const navbarRoutes = (isLoggedIn: boolean, role: string) => {
  const myProfile = {
    name: "My Profile",
    href: redirectToProfilePage(role),
    icon: {
      default: "fal fa-user",
      active: "fas fa-user",
    },
    current: false,
  };

  const Hospitals = {
    name: "Hospitals",
    href: "/patients/hospitals",
    icon: {
      default: "fal fa-hospital",
      active: "fas fa-hospital",
    },
    current: false,
  };

  const Patients = {
    name: "Patients",
    href:
      role === ROLE_DOCTOR
        ? "/doctor/patients"
        : role === ROLE_ADMIN
        ? "/admin/patients"
        : "/",
    icon: {
      default: "fal fa-wheelchair",
      active: "fas fa-wheelchair",
    },
    current: false,
  };

  const Doctors = {
    name: "Doctors",
    href: "/admin/doctors",
    icon: {
      default: "fal fa-user-md",
      active: "fas fa-user-md",
    },
    current: false,
  };

  // const UploadFile = {
  //   name: "Upload File",
  //   href: "/upload",
  //   icon: {
  //     default: "fal fa-file-upload",
  //     active: "fas fa-file-upload",
  //   },
  //   current: false,
  // };
  const Prescription = {
    name: "Prescription",
    href: "/patients/prescriptions",
    icon: {
      default: "fal fa-file-prescription",
      active: "fas fa-file-prescription",
    },
    current: false,
  }

  const readOnlyPrescription = {
    name: "Read Only Prescriptions",
    href: "/doctor/prescriptions",
    icon: {
      default: "fal fa-file-prescription",
      active: "fas fa-file-prescription",
    },
    current: false,
  }

  if (!isLoggedIn) return [{ ...HomePath }];

  if (role === ROLE_PATIENT) return [HomePath, myProfile, Hospitals, Prescription];

  if (role === ROLE_DOCTOR) return [HomePath, myProfile, Patients, readOnlyPrescription];

  if (role === ROLE_ADMIN) return [HomePath, myProfile, Patients, Doctors];

  return [{ ...HomePath }];
};
