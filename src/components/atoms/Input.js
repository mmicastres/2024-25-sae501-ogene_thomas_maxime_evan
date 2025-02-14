import React from 'react';

const Input = ({ type, value, onChange, placeholder, error, ...props }) => {
  return (
    <div className="w-full">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 text-gray-700 bg-white border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;
