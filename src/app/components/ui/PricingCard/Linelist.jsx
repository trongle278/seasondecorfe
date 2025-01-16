import { FaCheckCircle } from "react-icons/fa";

const LineList = ({content}) => {
  return (
    <li className="flex gap-x-3">
      <FaCheckCircle
        className="text-emerald-600 h-6 w-5 flex-none"
        aria-hidden
      />
      {content}

    </li>
  );
};

export default LineList;
