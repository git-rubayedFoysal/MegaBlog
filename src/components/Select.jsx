import { useId, forwardRef } from "react";

function Select({ options, label, className = "", ...props }, ref) {
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
      <select
        id={id}
        className={`${className} input-base cursor-pointer`}
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
