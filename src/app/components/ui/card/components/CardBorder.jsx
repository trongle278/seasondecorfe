const CardBorder = ({
  as: Component = "button",
  className = "",
  color = "white",
  speed = "6s",
  children,
  ...rest
}) => {
  return (
    <Component
      className={`relative inline-block py-[1px] overflow-hidden rounded-[20px] ${className}`}
      {...rest}
    >
      <div
        className="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0 dark:opacity-50"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>

      <div
        className="absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0 dark:opacity-50"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>

      <div
        className="relative z-1 border text-center text-[16px] py-[16px] px-[26px] rounded-[20px] 
        bg-gradient-to-b from-gray-100 to-gray-300 text-black border-gray-300 
        dark:bg-gradient-to-b dark:from-gray-900 dark:to-black dark:text-white dark:border-gray-800"
      >
        {children}
      </div>
    </Component>
  );
};

export default CardBorder;
