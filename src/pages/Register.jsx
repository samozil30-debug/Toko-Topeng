
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserRoundPlus } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = React.useState({
    nama: "",
    username: "",
    email: "",
    password: "",
    konfirmasi: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.konfirmasi) {
      alert("Konfirmasi password tidak sama!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const sudahAda = users.some(
      (user) =>
        user.email === form.email ||
        user.username === form.username
    );

    if (sudahAda) {
      alert("Email atau username sudah digunakan.");
      return;
    }

    const userBaru = {
      nama: form.nama,
      username: form.username,
      email: form.email,
      password: form.password
    };

    localStorage.setItem(
      "users",
      JSON.stringify([...users, userBaru])
    );

    alert("Pendaftaran berhasil! Silakan login.");
    navigate("/login");
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">
          <UserRoundPlus size={28} />
        </div>

        <h1>Daftar Akun</h1>
        <p>Buat akun untuk menikmati semua fitur kami.</p>

        <form onSubmit={handleSubmit}>
          <input
            name="nama"
            placeholder="Nama Lengkap"
            value={form.nama}
            onChange={handleChange}
            required
          />

          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="konfirmasi"
            placeholder="Konfirmasi Password"
            value={form.konfirmasi}
            onChange={handleChange}
            required
          />

          <button type="submit" className="auth-submit">
            Daftar Sekarang
          </button>
        </form>

        <p className="auth-footer">
          Sudah punya akun? <Link to="/login">Masuk di sini</Link>
        </p>
      </div>
    </main>
  );
}
