
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useState } from "react";

// Import komponen
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Produk, { DetailProduk } from "./pages/Produk";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Keranjang from "./pages/Keranjang";
import Checkout from "./pages/Checkout";
import Pesanan from "./pages/Pesanan";
import Profil from "./pages/Profil";

// ===============================
// PROTECTED ROUTE
// ===============================
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const location = useLocation();

  if (!isLoggedIn) {
    sessionStorage.setItem(
      "redirectAfterLogin",
      location.pathname
    );

    return <Navigate to="/login" replace />;
  }

  return children;
}

// ===============================
// APP CONTENT
// ===============================
function AppContent() {
  const navigate = useNavigate();

  // STATE KERANJANG
  const [keranjang, setKeranjang] = useState(() => {
    return JSON.parse(localStorage.getItem("keranjang")) || [];
  });

  // STATE PESANAN
  const [pesanan, setPesanan] = useState(() => {
    return JSON.parse(localStorage.getItem("pesanan")) || [];
  });

  // SIMPAN KERANJANG
  const simpanKeranjang = (data) => {
    setKeranjang(data);
    localStorage.setItem("keranjang", JSON.stringify(data));
  };

  // TAMBAH KE KERANJANG
  const tambahKeranjang = (produk) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      alert("Silakan login terlebih dahulu!");

      sessionStorage.setItem(
        "redirectAfterLogin",
        "/keranjang"
      );

      navigate("/login");
      return;
    }

    const produkAda = keranjang.find(
      (item) => item.id === produk.id
    );

    let keranjangBaru;

    if (produkAda) {
      keranjangBaru = keranjang.map((item) =>
        item.id === produk.id
          ? { ...item, jumlah: item.jumlah + 1 }
          : item
      );
    } else {
      keranjangBaru = [
        ...keranjang,
        {
          ...produk,
          jumlah: 1,
        },
      ];
    }

    simpanKeranjang(keranjangBaru);

    alert(`${produk.nama} berhasil ditambahkan ke keranjang!`);
  };

  // BELI SEKARANG
  const beliSekarang = (produk) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      alert("Silakan login terlebih dahulu!");

      sessionStorage.setItem(
        "redirectAfterLogin",
        "/"
      );

      navigate("/login");
      return;
    }

    navigate("/checkout", {
      state: {
        produkDipilih: [
          {
            ...produk,
            jumlah: 1,
          },
        ],
        modePembelian: "langsung",
      },
    });
  };

  // UBAH JUMLAH PRODUK
  const ubahJumlah = (id, perubahan) => {
    const keranjangBaru = keranjang
      .map((item) =>
        item.id === id
          ? {
              ...item,
              jumlah: item.jumlah + perubahan,
            }
          : item
      )
      .filter((item) => item.jumlah > 0);

    simpanKeranjang(keranjangBaru);
  };

  // HAPUS PRODUK
  const hapusProduk = (id) => {
    const keranjangBaru = keranjang.filter(
      (item) => item.id !== id
    );

    simpanKeranjang(keranjangBaru);
  };

  // BUAT PESANAN
  const buatPesanan = (data, idProdukDibeli = []) => {
    const pesananBaru = {
      id: Date.now(),
      ...data,
      tanggal: data.tanggal || new Date().toISOString(),
    };

    const pesananTerbaru = [
      pesananBaru,
      ...pesanan,
    ];

    setPesanan(pesananTerbaru);

    localStorage.setItem(
      "pesanan",
      JSON.stringify(pesananTerbaru)
    );

    // Hapus produk yang dibeli dari keranjang
    if (idProdukDibeli.length > 0) {
      const keranjangTersisa = keranjang.filter(
        (item) => !idProdukDibeli.includes(item.id)
      );

      simpanKeranjang(keranjangTersisa);
    }

    return pesananBaru;
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ROUTES
  return (
    <>
      <Navbar
        jumlahKeranjang={keranjang.reduce(
          (total, item) => total + item.jumlah,
          0
        )}
        handleLogout={handleLogout}
      />

      <Routes>
        {/* DASHBOARD */}
        <Route
          path="/"
          element={<Dashboard />}
        />

        {/* SEMUA PRODUK */}
        <Route
          path="/produk"
          element={
            <Produk
              tambahKeranjang={tambahKeranjang}
            />
          }
        />

        {/* DETAIL PRODUK */}
        <Route
          path="/detail/:id"
          element={
            <DetailProduk
              tambahKeranjang={tambahKeranjang}
              beliSekarang={beliSekarang}
            />
          }
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* KERANJANG */}
        <Route
          path="/keranjang"
          element={
            <ProtectedRoute>
              <Keranjang
                keranjang={keranjang}
                ubahJumlah={ubahJumlah}
                hapusProduk={hapusProduk}
              />
            </ProtectedRoute>
          }
        />

        {/* CHECKOUT */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout
                keranjang={keranjang}
                buatPesanan={buatPesanan}
              />
            </ProtectedRoute>
          }
        />

        {/* PESANAN */}
        <Route
          path="/pesanan"
          element={
            <ProtectedRoute>
              <Pesanan pesanan={pesanan} />
            </ProtectedRoute>
          }
        />

        {/* PROFIL */}
        <Route
          path="/profil"
          element={
            <ProtectedRoute>
              <Profil />
            </ProtectedRoute>
          }
        />

        {/* HALAMAN TIDAK DITEMUKAN */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </>
  );
}

// ===============================
// MAIN APP
// ===============================
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
