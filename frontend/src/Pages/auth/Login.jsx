import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { googleLogin } from "../../services/auth/google";
import { emailLogin } from "../../services/auth/emailPass";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const setUserCookie = (user) => {
    const expires = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toUTCString();
    document.cookie = `user=${encodeURIComponent(
      JSON.stringify(user)
    )}; path=/; expires=${expires}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const data = await emailLogin(email.trim(), password);

      if (data.success && data.user) {
        setUserCookie(data.user);
        navigate("/onboarding/goal");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");

    try {
      setGoogleLoading(true);
      const data = await googleLogin();

      if (data.success && data.user) {
        setUserCookie(data.user);
        navigate("/onboarding/goal");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Google sign in failed. Please try again.";
      setError(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh)] px-4 py-12 bg-gradient-to-br from-slate-950 via-zinc-900 to-neutral-950 text-white">
      
      <div className="max-w-md mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl">
        
        <h1 className="text-2xl font-semibold text-slate-100 mb-1">
          Welcome Back
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Log in to your account to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
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
            {loading ? "Logging in..." : "Login"}
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
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
          className="w-full border cursor-pointer border-white/10 bg-white/5 hover:bg-white/10 text-gray-200 py-3 rounded-xl font-medium transition disabled:opacity-60"
        >
          {googleLoading ? "Please wait..." : "Sign in with Google"}
        </button>

        <p className="text-sm text-center mt-6 text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-gray-200 font-medium hover:text-white transition"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}