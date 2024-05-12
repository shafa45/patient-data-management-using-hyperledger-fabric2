import {
  PatientDetailsUpdateByDoctor,
  PatientPersonalDetails,
} from '@/types/patient';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import React, { Fragment, useEffect, useState } from 'react';
// import UpdatePatientDetailsByDoctor from "./UpdatePatientDetailsByDoctor";
import PatientHistoryRecords from '../Doctors/PatientHistoryRecords';
import { useAppDispatch } from '@/redux/store';
import FormInputReadonly from '../Helper/FormInputReadonly';
import FormInputWriteOnly from '../Helper/FormInputWriteOnly';
import { getUserDetails } from '@/redux/utils/cookies';
import { generateUserProfilePicture } from '@/utils/generateUserProfilePicture';
import { PatientPrescritionDetailsUpdateByPatient } from '@/types/patient';
import PrescriptionHistoryRecords from './PrescriptionHistoryRecords';
import UpdatePatientPrescriptionDetailsByPatient from './UpdatePatientPrescriptionDetailsByPatient';
import axiosInstance from '@/redux/axios/axiosInterceptor';
import { API_BASE_URL } from '@/constants/constants';
import Loader from '../Helper/Loader';
import { DoctorDetails } from '@/types/doctor';
import { toast } from 'react-toastify';
import Select from 'react-select';
import doctor from '@/pages/doctor';
import { Field } from 'formik';
import SelectField from '../Helper/FormSelect';

const PrescriptionUnderPatient: React.FC<{
  prescriptionDetail: PatientPrescritionDetailsUpdateByPatient;
}> = ({ prescriptionDetail }) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState({} as PatientPersonalDetails);
  const [doctors, setDoctors] = useState([]);
  const [isAccessInProcess, setIsAccessInProcess] = useState(false);
  // const [viewAcces, setViewAccess] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const prescriptionId = prescriptionDetail.prescriptionId;
  const [selectDoctor, setSelectDoctor] = useState('');
  const [viewAccess, setViewAccess] = useState('');
  const [isOpenn, setIsOpenn] = useState(false);

  const closeModal = () => setIsOpen(false);
  const closeModall = () => setIsOpenn(false);

  const openModal = () => setIsOpen(true);

  const closeHistoryModal = () => {
    dispatch({
      type: 'patient/getPatientHistory',
      payload: [],
    });
    setIsHistoryOpen(false);
  };

  const AuthorizingAccess = async () => {
    setIsAccessInProcess(true);
    const grant = confirmText.includes('Grant View Access') ? true : false;
    try {
      // if (selectDoctor === prescriptionDetail.doctorId) {
      //   toast.error('You already granted access to this doctor.');
      //   return;
      // }
      if (!doctors.find((doctor: any) => doctor === selectDoctor)) {
        toast.error('Doctor not found');
        setIsOpenn(false);
        return;
      }
      if(grant && patient?.prescriptionsToDoctors?.[prescriptionId]?.includes(selectDoctor)){ 
        toast.error('You already granted access to this doctor.');
        setIsOpenn(false);
        return;
      }
      if(!grant && !patient?.prescriptionsToDoctors?.[prescriptionId]?.includes(selectDoctor)){ 
        toast.error('You already revoked access from this doctor.');
        setIsOpenn(false);
        return;
      }
      setIsOpenn(false);
      toast.loading(`${grant ? 'Granting' : 'Revoking'} Access...`);
      const payload = {
        prescriptionId: prescriptionDetail.prescriptionId,
        doctorId: selectDoctor,
        patientId: prescriptionDetail.patientId,
      };
      const response = axiosInstance.patch(
        `${API_BASE_URL}/patients/prescriptions/${grant ? 'grant' : 'revoke'}`,
        payload
      );
      // const response = await axios.post(
      //   `${API_BASE_URL}/admin/${role}s/register`,
      //   {
      //     ...details,
      //     password: hashPassword(details.password),
      //     firstname: details.username,
      //   }
      // );
      // await axiosInstance.patch(
      //   `${API_BASE_URL}/patients/${getUserDetails().username}/${
      //     grant ? "grant" : "revoke"
      //   }/${doctor}`
      // );
      // fetchDoctors(slug || "");
      // dispatch(getPatientPersonalDetails(getUserDetails().username));
      toast.dismiss();
      toast.success(
        `View Access ${grant ? 'Granted' : 'Revoked'} Successfully.`
      );
      setSelectDoctor('');
      getPatientById();
    } catch (error) {
      toast.dismiss();
      toast.error(
        `View ${
          grant ? 'Granting' : 'Revoking'
        } Access Failed. Please Try Again.`
      );
      setSelectDoctor('');
      console.error(error);
    } finally {
      setIsAccessInProcess(false);
      closeModal();
    }
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response1 = await axiosInstance.get(
        // `${API_BASE_URL}/patients/doctors/${hospitalId}/_all`
        `${API_BASE_URL}/patients/doctors/${1}/_all`
      );
      const response2 = await axiosInstance.get(
        // `${API_BASE_URL}/patients/doctors/${hospitalId}/_all`
        `${API_BASE_URL}/patients/doctors/${2}/_all`
      );
      const doctors = response1.data.concat(response2.data);
      const doctorUsernames = doctors.map((doctor: DoctorDetails) => doctor.id);
      const availableDoctors = doctorUsernames.filter(
        (doctor: any) => doctor !== prescriptionDetail.doctorId
      );
      console.log('all doctors', doctorUsernames);
      setDoctors(availableDoctors);
    } catch (error) {
      setDoctors([]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getPatientById = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${API_BASE_URL}/patients/${prescriptionDetail.patientId}`
      );
      console.log('patient details', response.data);
      console.log(
        'prescriptionsToDoctors',
        response.data.prescriptionsToDoctors[prescriptionId]
      );
      // console.log("prescriptionsToDoctors", response.data.prescriptionsToDoctors.prescriptionId);
      // setViewAccess(response.data.prescriptionsToDoctors.prescriptionId);
      setPatient(response.data);
    } catch (error) {
      console.error(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPatientById();
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openHistoryModal = () => {
    setIsHistoryOpen(true);
  };
  console.log('prescriptionDetail', prescriptionDetail);

  const AccessControl = (grant: boolean, username: any) => {
    if (!username) {
      toast.error('Please select a doctor to grant or revoke view access');
      return;
    }
    const confirm = grant
      ? `Grant View Access to ${username}`
      : `Revoke View Access from ${username}`;
    setIsOpenn(true);
    // setDoctor(username);
    setConfirmText(confirm);
    // AuthorizingAccess();
  };

  if (loading)
    return (
      <div className='flex justify-center h-32'>
        <Loader isCard />
      </div>
    );

  // const options = [
  //   { value: 'chocolate', label: 'Chocolate' },
  //   { value: 'strawberry', label: 'Strawberry' },
  //   { value: 'vanilla', label: 'Vanilla' },
  // ];

  return (
    <>
      <div className='flex justify-center items-center mt-6'>
        <div className='max-w-7xl mx-auto  px-2 pb-6 sm:px-4 lg:px-4 bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700'>
          <div className='px-6 py-4'>
            <div className='flex justify-between  flex-col sm:flex-row'>
              <div className='flex  mb-4'>
                <Image
                  className=' w-16 h-16 rounded-full shadow-lg'
                  src={generateUserProfilePicture(getUserDetails().username)}
                  width={720}
                  height={720}
                  alt='Doctor Profile Image'
                />
                <div className='font-semibold pl-3 pt-1 text-xl'>
                  {prescriptionDetail.doctorId}
                  {/* <span className="dark:text-gray-300 block font-normal text-lg">
                    {patientDetail.phoneNumber}
                  </span> */}
                </div>
              </div>
              <div className='mb-8 sm:mb-4 flex flex-col justify-center gap-3 sm:block'>
                <button
                  onClick={openHistoryModal}
                  className=' text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                >
                  View History
                </button>
                <button
                  onClick={openModal}
                  className='sm:ml-4 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
                >
                  Update Details
                </button>
              </div>
            </div>
            <div className='flex  justify-center gap-12 flex-col sm:flex-row'>
              <div className='sm:w-1/2 min-w-fit flex flex-col gap-6'>
                <FormInputReadonly
                  id='Treatment'
                  icon='fas fa-medkit'
                  value={prescriptionDetail.treatment}
                />
                <FormInputReadonly
                  id='Follow Up'
                  icon='fas fa-calendar-check'
                  value={prescriptionDetail.followUp}
                />
                <FormInputReadonly
                  id='Diagnosis'
                  icon='fas fa-stethoscope'
                  value={prescriptionDetail.diagnosis}
                />
                <button
                  onClick={() => AccessControl(true, selectDoctor)}
                  className='bg-green-700 hover:bg-green-800 text-white font-normal p-2 rounded'
                >
                  Grant View Access
                </button>
              </div>
              <div className='sm:w-1/2 min-w-fit  flex flex-col gap-6'>
                <FormInputReadonly
                  id='Allergies'
                  icon='fas fa-allergies'
                  value={prescriptionDetail.allergies}
                />
                <FormInputReadonly
                  id='Symptoms'
                  icon='fas fa-thermometer-half'
                  value={prescriptionDetail.symptoms}
                />

                <div className='mb-3'>
                  <SelectField
                    options={doctors?.map((doctor: any) => ({
                      label: doctor,
                      value: doctor,
                    }))}
                    placeholder='Select Doctor'
                    field={{ value: selectDoctor, name: 'selectDoctor' }}
                    form={{
                      setFieldValue: (name: any, value: any) =>
                        setSelectDoctor(value),
                    }}
                  />
                </div>

                {/* <div className='relative form-input'>
                  <input
                    type='text'
                    id='viewAccess'
                    className='block px-4 pb-2.5 pt-4 w-full text-gray-900 bg-transparent rounded-lg border border-gray-500 appearance-none dark:text-white focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none peer overflow-x-scroll'
                    value={selectDoctor}
                    onChange={(e) => setSelectDoctor(e.target.value)}
                    // placeholder='Enter doctor username'
                  />
                  <label
                    htmlFor='viewAccess'
                    className='absolute text-xl text-black dark:text-white duration-300 transform -translate-y-4 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 left-1'
                  >
                    <i className='fas fa-user'></i>
                    <span className='text-lg'>Doctor Username</span>
                  </label>
                </div> */}
                <button
                  onClick={() => AccessControl(false, selectDoctor)}
                  className='bg-red-700 hover:bg-red-800 text-white font-normal p-2 rounded'
                >
                  Revoke View Access
                </button>
                {/* <div className='w-full'>
                  <label
                    htmlFor='viewAccess'
                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                  >
                    View Access
                  </label>
                  <input
                    type='text'
                    id='viewAccess'
                    value={viewAccess}
                    onChange={(e) => setViewAccess(e.target.value)}
                    placeholder='Enter view access'
                    className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none'
                  />
                </div> */}
              </div>
            </div>
            {/* <div className='flex justify-center gap-6 flex-col md:flex-row'>
           

            </div> */}
            <div className='flex mt-3  justify-center gap-6 flex-row md:flex-row'>
              <div className='pt-6 w-full'>
                <FormInputReadonly
                  id='View Access Granted To'
                  icon='fas fa-user-check'
                  value={patient?.prescriptionsToDoctors?.[prescriptionId]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Transition appear show={isOpenn} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeModall}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-100 p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900'
                  >
                    Are You Sure To {confirmText} ?
                  </Dialog.Title>

                  <div className='mt-6 float-right'>
                    <button
                      type='button'
                      disabled={isAccessInProcess}
                      className='inline-flex justify-center rounded-md border border-transparent  px-4 py-2 text-sm font-medium  focus:outline-none focus-visible:ring-2 bg-red-500 hover:bg-red-600 text-white    focus-visible:ring-offset-2 mr-2'
                      onClick={closeModall}
                    >
                      No
                    </button>
                    <button
                      type='button'
                      disabled={isAccessInProcess}
                      className='inline-flex justify-center rounded-md border border-transparent bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm font-medium   focus:outline-none focus-visible:ring-2  focus-visible:ring-offset-2'
                      onClick={AuthorizingAccess}
                    >
                      Yes
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='  overflow-hidden transform  rounded-2xl  text-left shadow-xl transition-all'>
                  <UpdatePatientPrescriptionDetailsByPatient
                    prescriptionDetails={prescriptionDetail}
                    closeModal={closeModal}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={isHistoryOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeHistoryModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='transform  rounded-2xl text-left shadow-xl transition-all m-3 overflow-auto'>
                  <PrescriptionHistoryRecords
                    prescriptionId={prescriptionDetail.prescriptionId}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default PrescriptionUnderPatient;
