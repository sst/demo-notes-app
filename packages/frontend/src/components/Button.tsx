import React, { ButtonHTMLAttributes } from "react";
import { BsArrowRepeat } from "react-icons/bs";

type ButtonVariant = "primary" | "success" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className = "",
  disabled = false,
  loading = false,
  children,
  ...rest
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";

  const sizeClass = "py-2 px-5 text-lg";

  const variantBaseClasses = {
    'primary': 'bg-blue-600 text-white focus:ring-blue-500 border border-blue-600',
    'success': 'bg-green-600 text-white focus:ring-green-500 border border-green-600',
    'danger': 'bg-red-600 text-white focus:ring-red-500 border border-red-600',
  };

  const variantHoverClasses = {
    'primary': 'hover:bg-blue-700',
    'success': 'hover:bg-green-700',
    'danger': 'hover:bg-red-700',
  };

  const disabledClasses = disabled ? "opacity-60" : "";

  const hoverClass = (!disabled && !loading) ? variantHoverClasses[variant] : '';

  const buttonClasses = [
    baseClasses,
    sizeClass,
    variantBaseClasses[variant],
    hoverClass,
    disabledClasses,
    className
  ].join(" ");

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <BsArrowRepeat className="animate-spin mr-2" />}
      {children}
    </button>
  );
};

export default Button;
