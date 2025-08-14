import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  type = 'button',
}) => {
  const baseClasses = 'px-4 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-[#007aff] text-white hover:bg-[#0056cc] focus:ring-[#007aff]',
    secondary: 'bg-[#2c2c2e] text-white hover:bg-[#3c3c3e] focus:ring-[#2c2c2e]',
    danger: 'bg-[#ff3b30] text-white hover:bg-[#d70015] focus:ring-[#ff3b30]',
  };

  const widthClasses = fullWidth ? 'w-full' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClasses} ${disabledClasses}`}
    >
      {children}
    </button>
  );
};

export default Button;