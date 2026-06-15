import { forwardRef, useId } from "react";

const Input = forwardRef(
  ({ label, type = "text", className = "", ...props }, ref) => {
    const id = useId();
    return (
      <div className="w-full text-left">
        {label && (
          <label className="inline-block mb-1 pl-1 font-bold" htmlFor={id}>
            {label}
          </label>
        )}
        <input
          type={type}
          id={id}
          className={`${className} px-3 py-2.5 rounded bg-[#333] text-white outline-none duration-200 border-3 border-[#3e3e3e] w-full focus:bg-[#1a1a1a]`}
          {...props}
          ref={ref}
        />
      </div>
    );
  },
);

export default Input;
