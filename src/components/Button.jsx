function Button({
  children,
  type = "button",
  bgColor = "bg-blue-600",
  textColor = "text-white",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={`py-2.5 px-6 rounded-lg cursor-pointer font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 ${className} ${bgColor} ${textColor}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
