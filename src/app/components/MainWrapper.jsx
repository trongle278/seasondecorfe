import { AnimationBackground } from "./ui/AnimationBg";

const MainWrapper = ({ children }) => {
  return (
    <AnimationBackground>
      <div className="relative pb-40 bg-transparent dark:bg-transparent  pt-20 md:pt-20 overflow-hidden px-2 md:px-4 lg:px-8">
        {children}
      </div>
    </AnimationBackground>
  );
};

export default MainWrapper;
