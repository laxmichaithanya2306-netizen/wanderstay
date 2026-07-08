import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../api/auth";

function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
      <Link to="/" className="text-2xl font-bold text-rose-500">
        wanderstay
      </Link>

      <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
        <Link to="/" className="hover:text-rose-500 transition">Home</Link>
        <Link to="/create" className="hover:text-rose-500 transition">Create</Link>

        {loggedIn && (
          <>
            <Link to="/dashboard" className="hover:text-rose-500 transition">Dashboard</Link>
            <button
              onClick={handleLogout}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-50 transition"
            >
              Logout
            </button>
          </>
        )}

        {!loggedIn && (
          <>
            <Link to="/login" className="hover:text-rose-500 transition">Login</Link>
            <Link
              to="/register"
              className="bg-rose-500 text-white px-4 py-2 rounded-full hover:bg-rose-600 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;