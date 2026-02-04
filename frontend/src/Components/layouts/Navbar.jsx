import { LogIn, Menu, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-gray-500/20 backdrop-blur shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16"> 
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img className="text-gray-600 w-18 h-14 drop-shadow-[0_0_3px_rgba(255,255,255,0.9)]" alt="logo" src="/logo.png"/>
            <span className="text-xl font-bold text-gray-950 drop-shadow-[0_0_3px_rgba(255,255,255,0.9)]">
            Skill<span className="text-gray-800">Synapse</span>
            </span>
          </div>

          <div className="hidden md:flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 border border-gray-300 text-gray-300 px-4 py-2 cursor-pointer rounded-lg hover:bg-gray-700 hover:text-white transition"
            >
              <LogIn size={18} />
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="flex items-center gap-2 bg-gray-700 border border-gray-300 text-white px-5 py-2 rounded-lg cursor-pointer hover:bg-transparent hover:text-gray-300 transition"
            >
              <UserPlus />
              Register
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="text-gray-500 focus:outline-none"
              aria-label="Toggle menu"
            >
              {open ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>       
      </div>
      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-stone-800 backdrop-blur shadow-sm overflow-hidden transition-all duration-300 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 border border-gray-300 text-gray-300 px-4 py-2 cursor-pointer rounded-lg hover:bg-gray-700 hover:text-white transition"
            >
              <LogIn size={18} />
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="flex items-center gap-2 bg-gray-700 border border-gray-300 text-white px-5 py-2 rounded-lg cursor-pointer hover:bg-transparent hover:text-gray-300 transition"
            >
              <UserPlus />
              Register
            </button>
        </div>
      </div>
    </nav>
  );
}
