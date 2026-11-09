
import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

import {
  daftarProduk,
  rupiah,
} from "./Produk";

export default function Dashboard() {
  return (
    <main>
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="eyebrow">
            WARISAN BUDAYA NUSANTARA
          </span>

          <h1>
            Koleksi Topeng
            <br />
            <span>Malangan</span>
          </h1>

          <p>
            Kenali keindahan seni dan budaya melalui berbagai
            koleksi topeng tradisional khas Malang.
          </p>

          <Link
            to="/produk"
            className="primary-button"
          >
            Jelajahi Produk
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="hero-visual">
          <div className="hero-decoration"></div>

          <img
            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900"
            alt="Koleksi topeng"
          />
        </div>
      </section>

      {/* BENEFIT SECTION */}
      <section className="benefit-section">
        <div>
          <span>🎭</span>
          <h3>Budaya Asli Malang</h3>
          <p>Melestarikan warisan budaya.</p>
        </div>

        <div>
          <span>✦</span>
          <h3>Karya Berkualitas</h3>
          <p>Detail kerajinan penuh seni.</p>
        </div>

        <div>
          <span>📦</span>
          <h3>Pengiriman Aman</h3>
          <p>Produk dikemas dengan baik.</p>
        </div>
      </section>

      {/* PRODUK UNGGULAN */}
      <section className="featured-section">
        <div className="section-title">
          <div>
            <span>KOLEKSI PILIHAN</span>
            <h2>Produk Unggulan</h2>
            <p>
              Berbagai koleksi topeng khas Malangan.
            </p>
          </div>

          <Link
            to="/produk"
            className="view-all"
          >
            Semua Produk
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="product-grid">
          {daftarProduk.slice(0, 4).map((item) => (
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

                  <Link
                    to={`/detail/${item.id}`}
                    aria-label={`Lihat detail ${item.nama}`}
                  >
                    <ShoppingBag size={17} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about-section">
        <span>TENTANG KAMI</span>

        <h2>
          Melestarikan Budaya Melalui Karya
        </h2>

        <p>
          QR Topeng Malang merupakan media informasi dan
          penjualan kerajinan topeng tradisional khas Malang.
          Kami ingin memperkenalkan keindahan seni topeng
          kepada masyarakat luas.
        </p>
      </section>
    </main>
  );
}
