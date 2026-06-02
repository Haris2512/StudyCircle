import React, { forwardRef } from "react";

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className = "", leadingIcon, trailingIcon, ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label htmlFor={props.id || props.name} className="text-sm font-medium text-gray-300">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leadingIcon && (
            <div className="absolute left-3.5 text-gray-400">
              {leadingIcon}
            </div>
          )}
          <input
            ref={ref}
            {...props}
            className={`
              w-full py-2.5 rounded-lg
              bg-dark-card text-white placeholder-gray-500
              border transition-all duration-200
              ${leadingIcon ? "pl-10" : "pl-3.5"}
              ${trailingIcon ? "pr-10" : "pr-3.5"}
              ${error
                ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                : "border-dark-border focus:ring-primary-500/20 focus:border-primary-500"
              }
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:opacity-50 disabled:cursor-not-allowed
              text-sm
            `}
          />
          {trailingIcon && (
            <div className="absolute right-3.5 text-gray-400">
              {trailingIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
      </div>
    );
  }
);
FormInput.displayName = "FormInput";
