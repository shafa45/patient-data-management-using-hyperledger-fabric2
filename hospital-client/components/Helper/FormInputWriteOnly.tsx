import React from "react";

interface FormInput {
  id: string;
  icon: string;
  value: string | number | string[];
}

const FormInputWriteOnly: React.FC<FormInput> = ({ id, icon, value }) => {
    return (
      <div className="relative form-input">
        <input
          type="text"
          id={id}
          onChange={() => {}}
          className="block px-4 pb-2.5 pt-4 w-full text-gray-900 bg-transparent rounded-lg border border-gray-500 appearance-none dark:text-white focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none peer overflow-x-scroll"
          value={value}
        />
        <label
          htmlFor={id}
          className="absolute text-xl text-black dark:text-white duration-300 transform -translate-y-4 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
        >
          <i className={`${icon} mr-2`}></i>
          <span className=" text-lg">{id}</span>
        </label>
      </div>
    );
  }
export default FormWriteOnly;
  