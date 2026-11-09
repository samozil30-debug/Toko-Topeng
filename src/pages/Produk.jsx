
import React from "react";

import {
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {
  ShoppingCart,
  ShoppingBag,
  ArrowLeft,
  Search,
} from "lucide-react";

// ======================================
// DAFTAR PRODUK
// ======================================

export const daftarProduk = [
  {
    id: 1,
    nama: "Topeng Panji",
    harga: 150000,
    gambar:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=700",
    deskripsi:
      "Topeng karakter Panji yang melambangkan kelembutan, ketulusan, dan kebijaksanaan.",
  },
  {
    id: 2,
    nama: "Topeng Klana",
    harga: 175000,
    gambar:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=700",
    deskripsi:
      "Topeng karakter Klana dengan karakter kuat dalam kisah tradisional.",
  },
  {
    id: 3,
    nama: "Topeng Sekartaji",
    harga: 160000,
    gambar:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=700",
    deskripsi:
      "Topeng karakter Sekartaji yang menjadi bagian dari budaya Malangan.",
  },
  {
    id: 4,
    nama: "Topeng Gunungsari",
    harga: 180000,
    gambar:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=700",
    deskripsi:
      "Kerajinan topeng tradisional dengan detail ukiran yang menarik.",
  },
  {
    id: 5,
    nama: "Topeng Bapang",
    harga: 200000,
    gambar:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=700",
    deskripsi:
      "Topeng Bapang dengan karakter khas pertunjukan tari topeng.",
  },
  {
    id: 6,
    nama: "Topeng Panji Premium",
    harga: 250000,
    gambar:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=700",
    deskripsi:
      "Koleksi topeng premium untuk dekorasi dan koleksi pribadi.",
  },
  {
    id: 7,
    nama: "Topeng Ragil Kuning",
    harga: 190000,
    gambar:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=700",
    deskripsi:
      "Kerajinan topeng dengan karakter Ragil Kuning.",
  },
  {
    id: 8,
    nama: "Topeng Malangan Hias",
    harga: 220000,
    gambar:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=700",
    deskripsi:
      "Topeng khas Malang untuk koleksi seni dan dekorasi.",
  },
];

// ======================================
// FORMAT HARGA RUPIAH
// ======================================

export const rupiah = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);

// ======================================
// HALAMAN SEMUA PRODUK
// ======================================

export default function Produk({ tambahKeranjang }) {
  const [searchParams] = useSearchParams();

  const cari = searchParams.get("cari") || "";

  const hasil = daftarProduk.filter((item) =>
    item.nama
      .toLowerCase()
      .includes(cari.toLowerCase().trim())
  );

  return (
    <main className="page-container products-page">

      {/* HASIL PENCARIAN */}
      {cari && (
        <div className="product-search-result">
          <p>
            Hasil pencarian untuk:{" "}
            <strong>"{cari}"</strong>
          </p>

          <span>
            {hasil.length} produk ditemukan
          </span>
        </div>
      )}

      {/* DAFTAR PRODUK */}
      {hasil.length > 0 && (
        <div className="product-grid">
          {hasil.map((item) => (
            <div
              className="product-card"
              key={item.id}
            >

              {/* FOTO PRODUK */}
              <Link
                to={`/detail/${item.id}`}
                className="product-photo"
              >
                <img
                  src={item.gambar}
                  alt={item.nama}
                />
              </Link>

              {/* INFORMASI PRODUK */}
              <div className="product-info">

                <Link
                  to={`/detail/${item.id}`}
                  className="product-name-link"
                >
                  <h3>{item.nama}</h3>
                </Link>

                <p>{item.deskripsi}</p>

                <div className="product-bottom">
                  <strong>
                    {rupiah(item.harga)}
                  </strong>

                  <button
                    type="button"
                    onClick={() => tambahKeranjang(item)}
                  >
                    <ShoppingCart size={15} />
                    Tambah
                  </button>
                </div>

                <Link
                  className="detail-link"
                  to={`/detail/${item.id}`}
                >
                  Lihat Detail
                </Link>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* PRODUK TIDAK DITEMUKAN */}
      {hasil.length === 0 && (
        <div className="empty-state">
          <Search size={42} />

          <h3>Produk Tidak Ditemukan</h3>

          <p>
            Maaf, kami tidak menemukan produk dengan
            nama "{cari}".
          </p>

          <Link
            to="/produk"
            className="primary-button"
          >
            Lihat Semua Produk
          </Link>
        </div>
      )}
    </main>
  );
}

// ======================================
// HALAMAN DETAIL PRODUK
// ======================================

export function DetailProduk({
  tambahKeranjang,
  beliSekarang,
}) {
  const { id } = useParams();

  const produk = daftarProduk.find(
    (item) => item.id === Number(id)
  );

  // JIKA PRODUK TIDAK DITEMUKAN
  if (!produk) {
    return (
      <main className="page-container">
        <div className="empty-state">
          <h2>Produk Tidak Ditemukan</h2>

          <Link
            to="/produk"
            className="primary-button"
          >
            Kembali ke Produk
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container detail-page">

      {/* TOMBOL KEMBALI */}
      <Link
        to="/produk"
        className="back-link"
      >
        <ArrowLeft size={17} />
        Kembali ke Produk
      </Link>

      {/* DETAIL PRODUK */}
      <div className="detail-product">

        <div className="detail-product-image">
          <img
            src={produk.gambar}
            alt={produk.nama}
          />
        </div>

        <div className="detail-product-info">

          <span className="eyebrow">
            KOLEKSI TOPENG MALANGAN
          </span>

          <h1>{produk.nama}</h1>

          <h2>{rupiah(produk.harga)}</h2>

          <p>{produk.deskripsi}</p>

          <div className="detail-actions">

            {/* TAMBAH KERANJANG */}
            <button
              type="button"
              className="primary-button"
              onClick={() => tambahKeranjang(produk)}
            >
              <ShoppingCart size={18} />
              Tambah ke Keranjang
            </button>

            {/* BELI SEKARANG */}
            <button
              type="button"
              className="buy-now-button"
              onClick={() => beliSekarang(produk)}
            >
              <ShoppingBag size={18} />
              Beli Sekarang
            </button>

          </div>
        </div>
      </div>
    </main>
  );
}
