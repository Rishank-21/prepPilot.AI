import { useContext } from 'react';
import { UserContext } from '../../contexts/userContext';
import { getInitials } from '../../utils/helper';
import { useNavigate } from 'react-router-dom';

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUser();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="flex items-center">
      {user.user?.profileImageUrl ? (
        <img src={user.user.profileImageUrl} alt="" className="mr-3 size-10 rounded-full object-cover" />
      ) : (
        <span aria-hidden="true" className="mr-3 grid size-10 place-items-center rounded-full bg-emerald-100 font-bold text-emerald-900">
          {getInitials(user.user?.fullName || "")}
        </span>
      )}
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