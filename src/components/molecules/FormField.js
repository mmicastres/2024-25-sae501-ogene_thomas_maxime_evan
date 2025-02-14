import React from 'react';
import Input from '../atoms/Input';

const FormField = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-400 mb-1">
        {label}
      </label>
      <Input error={error} {...props} />
    </div>
  );
};

export default FormField;
