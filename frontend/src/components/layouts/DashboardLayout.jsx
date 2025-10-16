// import React, { useContext } from 'react'
// import { UserContext } from '../../contexts/UserContext'
// import Navbar from './Navbar'

// const DashboardLayout = ( {children} ) => {
//     const { user } = useContext(UserContext)
//   return (
//     <div>
//       <Navbar />
//       { user && <div>{children}</div>}
//     </div>
//   )
// }

// export default DashboardLayout


import React, { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {user ? (
        <main className="p-4 md:p-6">{children}</main>
      ) : (
        <div className="flex items-center justify-center h-[80vh] text-gray-600">
          Please log in to access the dashboard.
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
