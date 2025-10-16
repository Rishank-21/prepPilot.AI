// import React from 'react'

// const SpinnerLoader = () => {
//   return (
//     <div role='status'>
//       <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-blue-600 mx-auto" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <path d="M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100Z" fill="none"/>
//         <path d="M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100Z" fill="none"/>
//       </svg>
//       <span className='sr-only'>Loading...</span>
//     </div>
//   )
// }

// export default SpinnerLoader


import React from 'react';

const SpinnerLoader = () => {
  return (
    <div role="status" className="flex items-center justify-center">
      <svg
        aria-hidden="true"
        className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default SpinnerLoader;

