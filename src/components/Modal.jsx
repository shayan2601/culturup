import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='relative w-full max-w-3xl rounded-xl bg-white p-6 shadow-lg'>
        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-gray-500 hover:text-gray-800'
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
