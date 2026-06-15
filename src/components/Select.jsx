import { useId, forwardRef } from "react";

function Select({ options, label, className = "", ...props }, ref) {
  const id = useId();

  return (
    <div className="w-full text-left">
      {label && (
        <label className="inline-block mb-1 pl-1 font-bold" htmlFor={id}>
          {label}
        </label>
      )}
      <select
        id={id}
        className={`${className} px-3 py-2.5 rounded bg-[#333] text-white outline-none duration-200 border-3 border-[#3e3e3e] w-full focus:bg-[#1a1a1a]`}
        ref={ref}
        {...props}
      >
        {options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default forwardRef(Select);
