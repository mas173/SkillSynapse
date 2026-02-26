import {
  LogIn,
  Menu,
  UserPlus,
  X,
  LayoutDashboard,
  BrainCircuit,
  Map,
  LogOut,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/");
  };

  const navLink = (to, label, icon, onClick) => (
    <button
      key={label}
      onClick={() => {
        setOpen(false);
        onClick ? onClick() : navigate(to);
      }}
      className="flex items-center gap-2 text-gray-300 hover:text-white px-3 py-2 rounded-xl hover:bg-white/10 transition-all duration-200 text-sm font-medium"
    >
      {icon}
      {label}
    </button>
  );

  return (
    <nav className="bg-slate-900/60 backdrop-blur-xl border-b border-white/10 fixed w-full z-50 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-1 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <img
              className="w-18 h-14 drop-shadow-[0_0_3px_rgba(255,255,255,0.9)] transition-transform duration-300 group-hover:scale-105"
              alt="logo"
              src="/logo.png"
            />
            <span className="text-xl font-bold text-gray-100 drop-shadow-[0_0_3px_rgba(255,255,255,0.9)] transition-colors">
              Skill<span className="text-gray-400">Synapse</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {navLink(
                  "/dashboard",
                  "Dashboard",
                  <LayoutDashboard size={16} />,
                )}
                {navLink("/tutor", "AI Tutor", <BrainCircuit size={16} />)}
                {navLink("/roadmap", "Roadmap", <Map size={16} />)}

                <div className="w-px h-8 bg-white/10 mx-2" />

                {/* User avatar + name */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                  {user?.photo ? (
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-white/20"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center">
                      <User size={14} className="text-gray-300" />
                    </div>
                  )}
                  <span className="text-sm text-gray-300 font-medium max-w-[100px] truncate">
                    {user?.name || "User"}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-400 hover:text-red-400 px-3 py-2 rounded-xl hover:bg-red-500/10 transition-all duration-200 text-sm font-medium cursor-pointer"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 border border-white/10 text-gray-300 px-4 py-2 cursor-pointer rounded-xl hover:bg-white/10 hover:text-white transition-all duration-200 text-sm font-medium"
                >
                  <LogIn size={16} />
                  Login
                </button>

                <button
                  onClick={() => navigate("/signup")}
                  className="flex items-center gap-2 bg-gray-200 text-slate-900 px-5 py-2 rounded-xl cursor-pointer hover:bg-white transition-all duration-200 text-sm font-semibold shadow-lg shadow-white/10"
                >
                  <UserPlus size={16} />
                  Register
                </button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="text-gray-400 hover:text-white focus:outline-none transition-colors p-2 rounded-xl hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10 overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-2">
          {isAuthenticated ? (
            <>
              {/* User info */}
              <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 border border-white/10 mb-2">
                {user?.photo ? (
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-white/20"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center">
                    <User size={16} className="text-gray-300" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-200">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>

              {navLink(
                "/dashboard",
                "Dashboard",
                <LayoutDashboard size={16} />,
              )}
              {navLink("/tutor", "AI Tutor", <BrainCircuit size={16} />)}
              {navLink("/roadmap", "Roadmap", <Map size={16} />)}

              <div className="h-px bg-white/10 my-2" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 px-3 py-2 rounded-xl hover:bg-red-500/10 transition-all duration-200 text-sm font-medium cursor-pointer"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/login");
                }}
                className="flex items-center gap-2 border border-white/10 text-gray-300 px-4 py-2.5 cursor-pointer rounded-xl hover:bg-white/10 hover:text-white transition-all duration-200 text-sm font-medium"
              >
                <LogIn size={16} />
                Login
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/signup");
                }}
                className="flex items-center gap-2 bg-gray-200 text-slate-900 px-5 py-2.5 rounded-xl cursor-pointer hover:bg-white transition-all duration-200 text-sm font-semibold"
              >
                <UserPlus size={16} />
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
