
import React from "react";
import { useNavigate } from "react-router-dom";
import { UserRound, LogOut } from "lucide-react";

export default function Profil() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("currentUser") || "{}"
  );

  const keluar = () => {
    if (window.confirm("Apakah kamu yakin ingin keluar?")) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("currentUser");
      navigate("/");
    }
  };

  return (
    <main className="page-container">
      <div className="page-heading">
        <span>AKUN PENGGUNA</span>
        <h1>Profil Saya</h1>
        <p>Informasi akun pengguna.</p>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          <UserRound size={45} />
        </div>

        <h2>{user.nama || "Pengguna"}</h2>
        <p>{user.email}</p>

        <div className="profile-details">
          <div>
            <span>Nama Lengkap</span>
            <strong>{user.nama}</strong>
          </div>

          <div>
            <span>Username</span>
            <strong>{user.username}</strong>
          </div>

          <div>
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>
        </div>

        <button className="logout-button" onClick={keluar}>
          <LogOut size={17} />
          Keluar dari Akun
        </button>
      </div>
    </main>
  );
}
