// import React from 'react'
// import ProfileInfoCard from '../cards/ProfileInfoCard'
// import { Link } from 'react-router-dom'
// const Navbar = () => {
//   return (
//     <div className='h-16 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-2.5 px-4 md:px-0 sticky top-0 z-30'>
//       <div className='container nx-auto flex items-center justify-between gap-5'>
//         <Link to = "/dashboard">
//             <h2 className='text-lg md:text-xl font-medium text-black leading-5'>
//                 Interview Prep AI
//             </h2>
//         </Link>
//             <ProfileInfoCard />
//       </div>
//     </div>
//   )
// }

// export default Navbar


import React from "react";
import { Link } from "react-router-dom";
import ProfileInfoCard from "../cards/ProfileInfoCard";

const Navbar = () => {
  return (
    <nav className="h-16   bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-2.5 px-4 md:px-8 sticky top-0 z-30 shadow-sm">
      <div className="container mx-auto flex items-center justify-between gap-5">
        <Link to="/dashboard">
          <h2 className="text-lg md:text-xl font-semibold text-black tracking-tight">
            PrepPilot.<span className="text-amber-600">AI</span>
          </h2>
        </Link>
        <ProfileInfoCard />
      </div>
    </nav>
  );
};

export default Navbar;
