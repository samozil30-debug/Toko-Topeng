
import { useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import {
  ShoppingBag,
  ClipboardList,
  Search,
  UserRound,
  X,
} from "lucide-react";

export default function Navbar({ jumlahKeranjang = 0 }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchTerbuka, setSearchTerbuka] = useState(false);
  const [kataKunci, setKataKunci] = useState(
    searchParams.get("cari") || ""
  );

  const menuAktif = ({ isActive }) =>
    `nav-link ${isActive ? "active" : ""}`;

  const handleSearch = (e) => {
    e.preventDefault();

    navigate(
      `/produk${kataKunci.trim()
        ? `?cari=${encodeURIComponent(kataKunci.trim())}`
        : ""
      }`
    );

    setSearchTerbuka(false);
  };

  const bukaSearch = () => {
    setKataKunci(searchParams.get("cari") || "");
    setSearchTerbuka((sebelumnya) => !sebelumnya);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <NavLink to="/" className="navbar-logo">
          <span className="logo-text">QR</span>
          <div>
            <h2>TOPENG MALANG</h2>
            <small>Warisan Budaya Nusantara</small>
          </div>
        </NavLink>

        {/* Menu Navigasi */}
        <nav className="navbar-menu">
          <NavLink to="/" end className={menuAktif}>
            Beranda
          </NavLink>

          <NavLink to="/produk" className={menuAktif}>
            Produk
          </NavLink>

          <NavLink to="/keranjang" className={menuAktif}>
            <span className="nav-cart">
              <ShoppingBag size={18} />
              Keranjang

              {jumlahKeranjang > 0 && (
                <span className="cart-badge">
                  {jumlahKeranjang > 99 ? "99+" : jumlahKeranjang}
                </span>
              )}
            </span>
          </NavLink>

          <NavLink to="/pesanan" className={menuAktif}>
            <ClipboardList size={18} />
            Pesanan
          </NavLink>
        </nav>

        {/* Ikon sebelah kanan */}
        <div className="navbar-actions">

          <button
            type="button"
            className={`navbar-icon ${searchTerbuka ? "active" : ""}`}
            onClick={bukaSearch}
            title="Cari Produk"
            aria-label="Buka pencarian produk"
          >
            {searchTerbuka ? (
              <X size={21} />
            ) : (
              <Search size={21} />
            )}
          </button>

          <button
            type="button"
            className="navbar-icon"
            onClick={() => {
              if (localStorage.getItem("isLoggedIn") === "true") {
                navigate("/profil");
              } else {
                navigate("/login");
              }
            }}
            title="Profil Saya"
            aria-label="Profil Saya"
          >
            <UserRound size={21} />
          </button>
        </div>
      </div>

      {/* Kotak pencarian Navbar */}
      {searchTerbuka && (
        <form
          className="navbar-search-panel"
          onSubmit={handleSearch}
        >
          <div className="navbar-search-box">
            <Search size={19} />

            <input
              type="text"
              placeholder="Cari topeng favoritmu..."
              value={kataKunci}
              onChange={(e) => setKataKunci(e.target.value)}
              autoFocus
            />

            {kataKunci && (
              <button
                type="button"
                className="navbar-search-clear"
                onClick={() => setKataKunci("")}
                aria-label="Hapus pencarian"
              >
                <X size={17} />
              </button>
            )}

            <button type="submit" className="navbar-search-submit">
              Cari
            </button>
          </div>
        </form>
      )}
    </header>
  );
}
