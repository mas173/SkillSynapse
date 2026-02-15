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

  // Helper: store user info in a cookie (non-httpOnly, 7 days)
  const setUserCookie = (user) => {
    const expires = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toUTCString();
    document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; expires=${expires}`;
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
        navigate("/onboarding");
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
        navigate("/onboarding");
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
    <div className="min-h-[calc(100vh-64px)] px-4 py-10 bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-md mx-auto bg-white border border-indigo-100 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Welcome Back
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Log in to your account to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3 rounded-lg font-medium transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            or
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
          className="w-full border border-gray-300 hover:border-gray-400 bg-white text-gray-700 py-3 rounded-lg font-medium transition disabled:opacity-60"
        >
          {googleLoading ? "Please wait..." : "Sign in with Google"}
        </button>

        <p className="text-sm text-center mt-5 text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
