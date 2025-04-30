"use client";

const FlipButton = ({first, second, onClick}) => {
  return (
    <button onClick={onClick} className="cursor-pointer bg-gradient-to-b from-indigo-500 to-indigo-600 shadow-[0px_4px_32px_0_rgba(99,102,241,.70)] p-2 rounded-xl border-[1px] border-slate-500 text-white text-sm font-semibold group">
      <div className="relative overflow-hidden flex items-center justify-center">
        <p className="group-hover:-translate-y-7 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
          {first}
        </p>
        <p className="absolute top-7 group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
          {second}
        </p>
      </div>
    </button>
  );
};

export default FlipButton;
