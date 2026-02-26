import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { googleLogin } from "../../services/auth/google";
import { emailLogin } from "../../services/auth/emailPass";
import useAuthStore from "../../store/useAuthStore";
import { Brain } from "lucide-react";

// Inline Google "G" logo SVG
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" className="shrink-0">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

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
        setUser(data.user);
        // Smart redirect: skip onboarding if already completed
        navigate(data.user.isOnboarded ? "/dashboard" : "/onboarding/goal");
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
        setUser(data.user);
        navigate(data.user.isOnboarded ? "/dashboard" : "/onboarding/goal");
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
    <div className="min-h-[calc(100vh)] px-4 py-12 bg-gradient-to-br from-slate-950 via-zinc-900 to-neutral-950 text-white flex items-center justify-center">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl animate-fade-in">
        {/* Header with icon */}
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/10 border border-white/10">
            <Brain className="w-5 h-5 text-gray-200" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-100">
            Welcome Back
          </h1>
        </div>
        <p className="text-sm text-gray-400 mb-6 ml-[52px]">
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
            <p className="text-sm text-red-400 bg-red-900/20 border border-red-500/20 rounded-lg px-3 py-2 animate-fade-in">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-gray-200 text-slate-900 hover:bg-gray-300 cursor-pointer disabled:opacity-60 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-white/10 active:scale-[0.98]"
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
          className="w-full flex items-center justify-center gap-3 border cursor-pointer border-white/10 bg-white/5 hover:bg-white/10 text-gray-200 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-60 hover:border-white/20 active:scale-[0.98]"
        >
          <GoogleIcon />
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
