import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: (e?: any) => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "ghost";
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
}

const variantClasses = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-600 hover:bg-gray-700 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  ghost: "bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white",
};

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  icon,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variantClasses[variant]} font-semibold px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2 justify-center ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
