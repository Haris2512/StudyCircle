import React, { forwardRef, useId } from "react";

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className = "", leadingIcon, trailingIcon, ...props }, ref) => {
    const autoId = useId();
    const inputId = props.id || props.name || autoId;
    const errorId = inputId + "-error";

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-300">
            {label}
            {props.required && <span className="text-red-400 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leadingIcon && (
            <div className="absolute left-3.5 text-gray-400" aria-hidden="true">
              {leadingIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            aria-required={props.required || undefined}
            {...props}
            className={`
              w-full py-3 rounded-xl
              bg-white/[0.03] backdrop-blur-md text-white placeholder-gray-500
              border transition-all duration-300 shadow-inner
              ${leadingIcon ? "pl-11" : "pl-4"}
              ${trailingIcon ? "pr-11" : "pr-4"}
              ${error
                ? "border-red-500 focus:ring-red-500/20 focus:border-red-500 bg-red-500/5"
                : "border-white/10 hover:border-white/20 focus:bg-white/[0.05] focus:ring-primary-500/30 focus:border-primary-500"
              }
              focus:outline-none focus:ring-4 focus:ring-offset-0
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
        {error && (
          <p id={errorId} role="alert" className="text-xs text-red-400 mt-0.5">
            {error}
          </p>
        )}
      </div>
    );
  }
);
FormInput.displayName = "FormInput";
