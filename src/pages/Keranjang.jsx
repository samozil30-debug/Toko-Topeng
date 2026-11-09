
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";

import { rupiah } from "./Produk";

function Keranjang({
  keranjang = [],
  ubahJumlah,
  hapusProduk,
}) {
  const navigate = useNavigate();

  // Produk yang dipilih untuk checkout
  const [produkDipilih, setProdukDipilih] = useState([]);

  // Perbarui pilihan ketika isi keranjang berubah
  useEffect(() => {
    setProdukDipilih((pilihanSebelumnya) =>
      pilihanSebelumnya.filter((id) =>
        keranjang.some((item) => item.id === id)
      )
    );
  }, [keranjang]);

  // Menghitung total produk terpilih
  const daftarTerpilih = useMemo(() => {
    return keranjang.filter((item) =>
      produkDipilih.includes(item.id)
    );
  }, [keranjang, produkDipilih]);

  // Menghitung total harga
  const totalHarga = daftarTerpilih.reduce(
    (total, item) =>
      total + item.harga * item.jumlah,
    0
  );

  const totalJumlah = daftarTerpilih.reduce(
    (total, item) => total + item.jumlah,
    0
  );

  // Pilih semua produk
  const handlePilihSemua = (checked) => {
    if (checked) {
      setProdukDipilih(keranjang.map((item) => item.id));
    } else {
      setProdukDipilih([]);
    }
  };

  // Pilih satu produk
  const handlePilihProduk = (id) => {
    setProdukDipilih((sebelumnya) =>
      sebelumnya.includes(id)
        ? sebelumnya.filter((itemId) => itemId !== id)
        : [...sebelumnya, id]
    );
  };

  // Lanjut ke checkout
  const handleCheckout = () => {
    if (daftarTerpilih.length === 0) {
      alert("Silakan pilih produk yang ingin dibeli!");
      return;
    }

    navigate("/checkout", {
      state: {
        produkDipilih: daftarTerpilih,
      },
    });
  };

  return (
    <main className="page-container cart-page">

      {/* KERANJANG KOSONG */}
      {keranjang.length === 0 ? (
        <div className="cart-empty">

          <div className="cart-empty-icon">
            <ShoppingBag size={35} />
          </div>

          <h3>Keranjang Masih Kosong</h3>

          <p>
            Kamu belum memiliki produk di keranjang.
            Yuk, temukan topeng favoritmu!
          </p>

          <Link
            to="/produk"
            className="primary-button"
          >
            <ShoppingCart size={16} />
            Belanja Sekarang
          </Link>

        </div>
      ) : (

        /* DAFTAR KERANJANG */
        <div className="cart-layout">

          {/* DAFTAR PRODUK */}
          <section className="cart-list">

            <div className="cart-list-header">

              <label className="cart-select-all">
                <input
                  type="checkbox"
                  checked={
                    keranjang.length > 0 &&
                    produkDipilih.length === keranjang.length
                  }
                  onChange={(e) =>
                    handlePilihSemua(e.target.checked)
                  }
                />

                Pilih Semua ({keranjang.length} produk)
              </label>

              <span>
                {produkDipilih.length} dipilih
              </span>

            </div>

            {keranjang.map((item) => (

              <div
                className="cart-item"
                key={item.id}
              >

                {/* CHECKBOX */}
                <input
                  className="cart-checkbox"
                  type="checkbox"
                  checked={produkDipilih.includes(item.id)}
                  onChange={() =>
                    handlePilihProduk(item.id)
                  }
                />

                {/* FOTO PRODUK */}
                <img
                  className="cart-product-image"
                  src={item.gambar}
                  alt={item.nama}
                />

                {/* INFORMASI PRODUK */}
                <div className="cart-product-info">

                  <h3>{item.nama}</h3>

                  <p>
                    {item.deskripsi}
                  </p>

                  <strong>
                    {rupiah(item.harga)}
                  </strong>

                  {/* JUMLAH PRODUK */}
                  <div className="cart-quantity">

                    <button
                      type="button"
                      onClick={() =>
                        ubahJumlah(item.id, -1)
                      }
                      disabled={item.jumlah <= 1}
                      aria-label="Kurangi jumlah"
                    >
                      <Minus size={13} />
                    </button>

                    <span>{item.jumlah}</span>

                    <button
                      type="button"
                      onClick={() =>
                        ubahJumlah(item.id, 1)
                      }
                      aria-label="Tambah jumlah"
                    >
                      <Plus size={13} />
                    </button>

                  </div>

                </div>

                {/* TOTAL DAN HAPUS */}
                <div className="cart-item-action">

                  <strong>
                    {rupiah(item.harga * item.jumlah)}
                  </strong>

                  <button
                    type="button"
                    className="cart-delete-button"
                    onClick={() => {
                      hapusProduk(item.id);

                      setProdukDipilih((sebelumnya) =>
                        sebelumnya.filter(
                          (id) => id !== item.id
                        )
                      );
                    }}
                  >
                    <Trash2 size={14} />
                    Hapus
                  </button>

                </div>

              </div>

            ))}

            {/* KEMBALI KE PRODUK */}
            <Link
              to="/produk"
              className="cart-back-link"
            >
              <ArrowLeft size={15} />
              Lanjut Belanja
            </Link>

          </section>

          {/* RINGKASAN BELANJA */}
          <aside className="cart-summary">

            <h3>Ringkasan Belanja</h3>

            <div className="cart-summary-row">
              <span>Jumlah produk</span>
              <strong>{totalJumlah} produk</strong>
            </div>

            <div className="cart-summary-row">
              <span>Produk dipilih</span>
              <strong>{daftarTerpilih.length}</strong>
            </div>

            <div className="cart-summary-divider" />

            <div className="cart-summary-total">
              <span>Total Pembayaran</span>

              <strong>
                {rupiah(totalHarga)}
              </strong>
            </div>

            <button
              type="button"
              className="cart-checkout-button"
              onClick={handleCheckout}
              disabled={daftarTerpilih.length === 0}
            >
              Checkout
              <ArrowRight size={16} />
            </button>

            <p className="cart-summary-note">
              Pastikan produk yang dipilih sudah sesuai
              sebelum melanjutkan pembayaran.
            </p>

          </aside>

        </div>
      )}

    </main>
  );
}

export default Keranjang;
