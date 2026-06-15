import { forwardRef, useId } from "react";

const Input = forwardRef(
  ({ label, type = "text", className = "", ...props }, ref) => {
    const id = useId();
    return (
      <div className="w-full flex flex-col text-left space-x-1.5">
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
          className={`${className} input-base border py-2 px-2 rounded-lg focus:border-blue-500`}
          {...props}
          ref={ref}
        />
      </div>
    );
  },
);

export default Input;
