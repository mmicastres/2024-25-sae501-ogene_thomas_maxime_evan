import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-purple hover:bg-purple text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border-2 border-purple text-purple hover:bg-purple-50'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${variants[variant]} w-full px-4 py-4 rounded-xl text-base font-semibold transition-all duration-200 focus:outline-none active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
