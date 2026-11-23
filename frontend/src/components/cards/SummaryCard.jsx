import { LuTrash2 } from "react-icons/lu";
import { getInitials } from "../../utils/helper";

const SummaryCard = ({
  role,
  colors,
  topicsToFocus,
  experience,
  questions,
  description,
  latestUpdated,
  onSelect,
  onDelete,
}) => {
  return (
    <article
      className="relative rounded-2xl overflow-hidden
                 backdrop-blur-lg bg-white/70 shadow-sm hover:shadow-xl
                 hover:scale-[1.02] transition-all duration-300 group"
    >
      {/* Gradient Top Section */}
      <div
        className="p-5 pr-14 flex items-center relative"
        style={{ background: colors.bgcolor }}
      >
        {/* Initials / Logo */}
        <div className="flex-shrink-0 w-14 h-14 bg-white/90 rounded-xl flex items-center justify-center shadow-md">
          <span className="text-xl font-bold text-gray-800">
            {getInitials(role)}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="ml-4 flex flex-col">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            <button onClick={onSelect} className="cursor-pointer text-left hover:underline">{role}</button>
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 line-clamp-1">
            {topicsToFocus}
          </p>
        </div>

        {/* Floating Delete Button */}
        <button
          className="absolute top-3 right-3
                     transition-all duration-300 bg-white/80 hover:bg-rose-500 hover:text-white
                     p-2 rounded-full shadow-md"
          aria-label={`Delete ${role} session`}
          onClick={onDelete}
        >
          <LuTrash2 size={16} />
        </button>
      </div>

      {/* Details Section */}
      <div className="p-5">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs font-medium">
          <span className="px-3 py-1 rounded-full border border-gray-300 bg-gray-50 text-gray-700">
            {experience} {experience == 1 ? "year" : "years"} exp
          </span>
          <span className="px-3 py-1 rounded-full border border-gray-300 bg-gray-50 text-gray-700">
            {questions} Q&A
          </span>
          <span className="px-3 py-1 rounded-full border border-gray-300 bg-gray-50 text-gray-700">
            Updated: {latestUpdated}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-4 line-clamp-3 leading-relaxed">
          {description}
        </p>
      </div>
    </article>
  );
};

export default SummaryCard;
