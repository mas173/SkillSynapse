import {
  Mail,
  FileText,
  Github,
  Code2,
} from "lucide-react";
import logo from '/logo.png';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-400 border-t bottom-0 border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row justify-between gap-12">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-1 text-white mb-4 ">
              <img src={logo} className="filter w-15 h-12 drop-shadow-[0_0_3px_rgba(255,255,255,0.9)]" alt="Logo" />
              <span className="text-lg font-semibold tracking-wide">
                Skill<span className="text-gray-500">Synapse</span>
              </span>
            </div>

            <p className="max-w-sm text-sm leading-relaxed">
              Bridging the gap between potential and mastery with explainable AI.
              Empowering the next generation of learners, one neural connection at a time.
            </p>
          </div>

          {/* LINKS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-sm">

            {/* PRODUCT */}
            <div>
              <p className="text-gray-300 font-semibold mb-3">Product</p>
              <ul className="space-y-2">
                <li className="hover:text-white cursor-pointer">How It Works</li>
                <li className="hover:text-white cursor-pointer">Features</li>
              </ul>
            </div>

            {/* DEVELOPERS */}
            <div>
              <p className="text-gray-300 font-semibold mb-3">Developers</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 hover:text-white cursor-pointer">
                  <Code2 size={16} /> API Docs
                </li>
                <li className="hover:text-white cursor-pointer">
                  <a href="https://github.com/Ankita15k/SkillSynapse.git" target="blank" className="flex items-center gap-2 "><Github size={16} /> GitHub</a>
                </li>
              </ul>
            </div>

            {/* SUPPORT */}
            <div>
              <p className="text-gray-300 font-semibold mb-3">Support</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 hover:text-white cursor-pointer">
                  <Mail size={16} /> Contact
                </li>
                <li className="flex items-center gap-2 hover:text-white cursor-pointer">
                  <FileText size={16} /> Documentation
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-slate-700 mt-12 pt-6 flex flex-col md:flex-row gap-3 justify-center items-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} SkillSynapse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
