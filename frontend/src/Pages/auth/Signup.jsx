import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { googleLogin } from "../../services/auth/google";
import { emailSignup } from "../../services/auth/emailPass";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in name, email, and password.");
      return;
    }

    try {
      setLoading(true);
      await emailSignup(name.trim(), email.trim(), password);
      navigate("/onboarding");
    } catch (err) {
      setError(err?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");

    try {
      setGoogleLoading(true);
      await googleLogin();
      navigate("/onboarding");
    } catch (err) {
      setError(err?.message || "Google sign in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh)] px-4 py-12 bg-gradient-to-br from-slate-950 via-zinc-900 to-neutral-950 text-white">
      
      <div className="max-w-md mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl">
        
        <h1 className="text-2xl font-semibold text-slate-100 mb-1">
          Create Account
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Sign up with your details to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 bg-black/30 border border-white/10 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-black/30 border border-white/10 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-black/30 border border-white/10 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition"
          />

          {error && (
            <p className="text-sm text-red-400 bg-red-900/20 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-gray-200 text-slate-900 hover:bg-gray-300 cursor-pointer disabled:opacity-60 py-3 rounded-xl font-medium transition"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            or
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading || googleLoading}
          className="w-full border cursor-pointer border-white/10  bg-white/5 hover:bg-white/10 text-gray-200 py-3 rounded-xl font-medium transition disabled:opacity-60"
        >
          {googleLoading ? "Please wait..." : "Sign in with Google"}
        </button>

        <p className="text-sm text-center mt-6 text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-gray-200 font-medium hover:text-white transition"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}