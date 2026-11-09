
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Mengambil data pengguna yang sudah terdaftar
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Login menggunakan username atau email
    const user = users.find((item) => {
      return (
        (item.username?.toLowerCase() === identifier.trim().toLowerCase() ||
          item.email?.toLowerCase() === identifier.trim().toLowerCase()) &&
        item.password === password
      );
    });

    if (!user) {
      setError("Username/email atau password salah!");
      return;
    }

    // Menyimpan status login
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(user));

    // Mengembalikan pengguna ke halaman yang dituju sebelumnya
    const redirect = sessionStorage.getItem("redirectAfterLogin");

    sessionStorage.removeItem("redirectAfterLogin");

    navigate(redirect || "/", { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Selamat Datang Kembali</h2>
        <p>Silakan masuk ke akun QR Topeng Malang Anda.</p>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username atau Email</label>
            <input
              type="text"
              placeholder="Masukkan username atau email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p style={{ color: "red", fontSize: "14px" }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>

        <p className="auth-switch">
          Belum mempunyai akun?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ cursor: "pointer", color: "#8b5e3c" }}
          >
            Daftar sekarang
          </span>
        </p>
      </div>
    </div>
  );
}
