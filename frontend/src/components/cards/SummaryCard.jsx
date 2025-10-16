// import React from 'react'
// import { LuTrash2 } from 'react-icons/lu';
// import { getInitials } from '../../utils/helper';

// const SummaryCard = ({ role , colors ,topicsToFocus, experience , questions, description, latestUpdated, onSelect, onDelete}) => {
//   return (
//     <div className='bg-white border border-gray-300/40 rounded-xl p-2 overflow-hidden cursor-pointer hover:shadow-xl shadow-gray-100
//      relative group' onClick={onSelect}>
//         <div className='rounded-lg p-4 cursor-pointer relative' style={{ background : colors.bgcolor}}>
//             <div className='flex items-start'>
//                 <div className='flex-shrink-0 w-12 h-12 bg-white rounded-md flex items-center justify-center mr-4 '>
//                     <span className='text-lg font-semibold text-black'>
//                         { getInitials(role) }
//                     </span>
//                 </div>
//                 <div className='flex-grow'>
//                     <div className='flex justify-between items-start'>
//                         <div className=''>
//                             <h2 className='text-[17px] font-medium  '>{role}</h2>
//                             <p className='text-xs text-medium text-gray-900 '>{topicsToFocus}</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <button className='hidden group-hover:flex items-center gap-2 text-xs text-rose-500 font-medium bg-rose-50 px-3 py-1 rounded text-nowrap border border-rose-100 hover:border-role-200 cursor-pointer absolute top-0 right-0' onClick={(e) => {
//                 e.stopPropagation();
//                 onDelete()
//             }}>
//                 <LuTrash2/>
//             </button>
//         </div>
//         <div className='px-3 py-3'>
//             <div className='flex items-center gap-3 mt-4'>
//                 <div className='text-[10px] font-medium text-black px3 py-1 border-[0.5px] border-gray-900 rounded-full'>
//                     Experience: {experience} {experience == 1 ? "year" : "years"}
//                 </div>
//                 <div className='text-[10px] font-medium text-black px-3 py-1 border-[0.5px] border-gray-900 rounded-full'>
//                     {questions} Q&A
//                 </div>
//                 <div className='text-[10px] font-medium text-black px-3 py-1 border-[0.5px] border-gray-900 rounded-full'>
//                     Last Updated: {latestUpdated    }
//                 </div>
//             </div>
//             <p className='text-[12px] text-gray-500 font-medium line-clamp-2 mt-3'>{description}</p>
//         </div>
//     </div>
//   )
// }

// export default SummaryCard


import React from "react";
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
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer 
                 backdrop-blur-lg bg-white/70 shadow-sm hover:shadow-xl 
                 hover:scale-[1.02] transition-all duration-300 group"
      onClick={onSelect}
    >
      {/* Gradient Top Section */}
      <div
        className="p-5 flex items-center relative"
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
            {role}
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 line-clamp-1">
            {topicsToFocus}
          </p>
        </div>

        {/* Floating Delete Button */}
        <button
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 
                     transition-all duration-300 bg-white/80 hover:bg-rose-500 hover:text-white 
                     p-2 rounded-full shadow-md"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
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
    </div>
  );
};

export default SummaryCard;
