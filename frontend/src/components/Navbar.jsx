import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-700 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">💊 MediRemind</Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/medications" className="hover:underline">Medications</Link>
            <Link to="/reminders" className="hover:underline">Reminders</Link>
            <Link to="/history" className="hover:underline">History</Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="hover:underline font-semibold text-yellow-300">Admin</Link>
            )}
            <Link to="/profile" className="hover:underline">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link
              to="/register"
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
