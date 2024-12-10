import React from 'react';
import { IoIosClose } from "react-icons/io";

export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 mx-4">
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col">
      <button
          onClick={onClose}
          className=" text-white text-right self-end text-3xl mb-4"
        >
          <IoIosClose />
        </button>
        {children}
        
      </div>
    </div>
  );
}
