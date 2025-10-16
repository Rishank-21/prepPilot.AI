// import React, { useState  , useEffect , useRef} from 'react'
// import { LuChevronDown , LuPin , LuPinOff , LuSparkles } from 'react-icons/lu'
// import AIResponsePreview from '../../pages/interviewPrep/Components/AIResponsePreview';
// const QuestionCard = ({ question, answer, onLearnMore, isPinned, onTogglePin }) => {
//     const [isExpanded, setIsExpanded] = useState(false);
//     const [height , setHeight] = useState(0);
//     const contentRef = useRef(null);
//     useEffect(() => {
//         if(isExpanded){
//             const contentHeight = contentRef.current.scrollHeight;
//             setHeight(contentHeight + 10);
//         } else { 
//             setHeight(0)
//         }
//     }, [isExpanded]);


//     const toggleExpand = () => {
//         setIsExpanded(!isExpanded);

//     }
//   return (
//     <div className='bg-white rounded-lg mb-4 overflow-hidden py-4 px-5  shadow-xl shadow-gray-100/70 border border-gray-100/60 group'>
//       <div className='flex items-center justify-between cursor-pointer'>
//         <div className='flex items-center gap-3.5 '>
//             <span className='text-xs md:text-[15px] font-semibold text-gray-400 leading-[18px]'>
//                     Q
//             </span>
//             <h3 className='text-xs md:text-[15px] font-medium text-gray-800 mr-0 md:mr-20 ' onClick={toggleExpand}>{question}</h3>
//         </div>
//         <div className='flex items-center justify-end ml-4 relative'>
//             <div className={`flex ${isExpanded? "md:flex" : "md:hidden group-hover:flex"}`}>
//                 <button className='flex items-center gap-2 text-xs text-indigo-800 font-medium bg-indigo-50 px-3 py-1 mr-2 rounded text-nowrap border border-indigo-50 hover:border-indigo-200 cursor-pointer' onClick={onTogglePin}>
//                     {isPinned ? <LuPinOff className='text-xs' /> : <LuPin className='text-xs'/>}
//                 </button>
//                 <button className='flex items-center gap-2 text-xs text-cyan-800 font-medium bg-cyan-50 px-3 py-1 mr-2 rounded text-nowrap border border-cyan-50 hover:border-cyan-200 cursor-pointer' onClick={() => {
//                     setIsExpanded(true)
//                     onLearnMore()
//                 }}>
//                     <LuSparkles/>
//                     <span className='hidden md:block'>Learn More</span>
//                 </button>
//             </div>
//             <button className='text-gray-400 hover:text-gray-500 cursor-pointer' onClick={toggleExpand}>
//                 <LuChevronDown
//                 size={20}
//                 className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}/>
//             </button>
//         </div>
//       </div>
//       <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{maxHeight : `${height}px`}}>
//         <div ref={contentRef} className='mt-4 text-gray-700 bg-gray-50 px-5 py-3 rounded-lg'>
//                 <AIResponsePreview content = {answer}/>
//         </div>

//       </div>
//     </div>
//   )
// }

// export default QuestionCard


import React, { useState, useEffect, useRef } from "react";
import { LuChevronDown, LuPin, LuPinOff, LuSparkles } from "react-icons/lu";
import AIResponsePreview from "../../pages/interviewPrep/Components/AIResponsePreview";

const QuestionCard = ({ question, answer, onLearnMore, isPinned, onTogglePin }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      setHeight(contentRef.current.scrollHeight + 10);
    } else {
      setHeight(0);
    }
  }, [isExpanded]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="bg-white rounded-2xl mb-4 overflow-hidden py-4 px-3 sm:px-4 md:px-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Question */}
        <div className="flex items-start md:items-center gap-3 flex-1">
          <span className="text-sm font-semibold text-gray-400">Q</span>
          <h3
            className="text-sm sm:text-base font-medium text-gray-800 leading-snug cursor-pointer"
            onClick={toggleExpand}
          >
            {question}
          </h3>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className={`flex flex-wrap gap-2 ${isExpanded ? "flex" : "hidden md:flex group-hover:flex"}`}>
            {/* Pin Button */}
            <button
              className="flex items-center gap-1 text-xs sm:text-sm text-indigo-800 font-medium bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:border-indigo-200 transition cursor-pointer"
              onClick={onTogglePin}
            >
              {isPinned ? <LuPinOff size={14} /> : <LuPin size={14} />}
              <span className="hidden sm:inline ">{isPinned ? "Unpin" : "Pin"}</span>
            </button>

            {/* Learn More */}
            <button
              className="flex items-center gap-1 text-xs sm:text-sm text-cyan-800 font-medium bg-cyan-50 px-3 py-1.5 rounded-lg border border-cyan-100 hover:border-cyan-200 transition cursor-pointer"
              onClick={() => {
                setIsExpanded(true);
                onLearnMore();
              }}
            >
              <LuSparkles size={14} />
              <span className="hidden sm:inline">Learn More</span>
            </button>
          </div>

          {/* Expand / Collapse */}
          <button
            className="text-gray-400 hover:text-gray-600 transition"
            onClick={toggleExpand}
          >
            <LuChevronDown
              size={20}
              className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Answer Section */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: `${height}px` }}
      >
        <div ref={contentRef} className="mt-4 text-gray-700 bg-gray-50 px-3 sm:px-5 py-3 rounded-lg">
          <AIResponsePreview content={answer} />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
