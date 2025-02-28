import { ButtonHTMLAttributes } from "react";
import { HiArrowPath } from "react-icons/hi2";

type ButtonVariant = "primary" | "success" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
}

function Button({
  variant = "primary",
  className = "",
  disabled = false,
  loading = false,
  children,
  ...rest
}: ButtonProps) {
  const baseClasses =
    `inline-flex items-center justify-center font-medium rounded gap-2`;

  const sizeClass = "py-3 px-5 text-lg";

  const variantBaseClasses = {
    "primary": "bg-sky-600 text-white",
    "success": "bg-teal-600 text-white",
    "danger": "bg-rose-600 text-white",
  };

  const variantHoverClasses = {
    "primary": "hover:bg-sky-500",
    "success": "hover:bg-teal-500",
    "danger": "hover:bg-rose-500",
  };

  const variantActiveClasses = {
    "primary": "active:bg-sky-700",
    "success": "active:bg-teal-700",
    "danger": "active:bg-rose-700",
  };

  const disabledClasses = disabled ? "opacity-60" : "";

  const hoverClass = (!disabled && !loading) ? variantHoverClasses[variant] : "";

  const buttonClasses = [
    baseClasses,
    sizeClass,
    variantBaseClasses[variant],
    variantActiveClasses[variant],
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
      {loading && <HiArrowPath className="animate-spin" />}
      {children}
    </button>
  );
}

export default Button;
