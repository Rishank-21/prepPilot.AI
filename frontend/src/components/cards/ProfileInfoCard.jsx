// import React, { useContext } from 'react'
// import { UserContext } from '../../contexts/UserContext'
// import { useNavigate } from 'react-router-dom'

// const ProfileInfoCard = () => {
//     const { user, clearUser } = useContext(UserContext)
//     const navigate = useNavigate()

//     const handleLogout = () => {
//         localStorage.clear()
//         clearUser()
//         navigate("/")
//     }
//   return (
//     user && (
//     <div className='flex items-center'>
//         <img src={user.profileImageUrl} alt="profile"  className='w-11 h-11 bg-gray-300 rounded-full mr-3'/>
//         <div className=''>
//             <div className='text-[15px] text-black font-bold leading-3'>
//                 {user.fullName || ""}
//             </div>
//             <button className=' text-amber-600 text-sm font-semibold cursor-pointer' onClick={handleLogout}>Logout</button>
//         </div>
//     </div>
//   ) )
// }

// export default ProfileInfoCard


import React, { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="flex items-center">
      <img
        src={user.user?.profileImageUrl || 'https://placehold.co/64x64?text=👤'}
        alt="profile"
        className="w-13 h-13 bg-gray-300 rounded-full mr-3 object-cover"
      />
      <div>
        <div className="text-[15px] text-black font-bold leading-3">
          {user.user?.fullName || ''}
        </div>
        <button className="text-amber-600 text-sm font-semibold cursor-pointer" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfoCard;