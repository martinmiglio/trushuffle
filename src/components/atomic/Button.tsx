import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const defaultColor =
  "bg-theme-700 hover:bg-theme-600 border-theme-100 text-theme-100 disabled:bg-theme-100 transition-colors transition-100";

export default function Button({
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`whitespace-nowrap py-2 px-3 border rounded-md ${defaultColor} ${className}`}
    >
      {children}
    </button>
  );
}

export function IconButton({
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`whitespace-nowrap h-16 w-16 border rounded-full ${defaultColor} ${className}`}
    >
      {children}
    </button>
  );
}
