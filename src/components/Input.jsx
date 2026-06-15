import { forwardRef, useId } from "react";

const Input = forwardRef(
  ({ label, type = "text", className = "", ...props }, ref) => {
    const id = useId();
    return (
      <div className="w-full text-left">
        {label && (
          <label
            className="inline-block mb-2 pl-1 font-semibold text-gray-300"
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={id}
          className={`${className} input-base`}
          {...props}
          ref={ref}
        />
      </div>
    );
  },
);

export default Input;
