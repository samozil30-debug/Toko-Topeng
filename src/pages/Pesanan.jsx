
import React, { useState } from "react";

import {
  Package,
  CalendarDays,
  Eye,
  X,
  UserRound,
  Phone,
  MapPin,
  CreditCard,
  Receipt,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";

import { Link } from "react-router-dom";
import { rupiah } from "./Produk";

// ======================================
// FILTER PESANAN
// ======================================

const kategoriStatus = [
  "Semua",
  "Menunggu Pembayaran",
  "Diproses",
  "Selesai",
  "Dibatalkan",
];

// ======================================
// FORMAT TANGGAL
// ======================================

const formatTanggal = (tanggal) => {
  if (!tanggal) return "-";

  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// ======================================
// KOMPONEN PESANAN
// ======================================

function Pesanan({ pesanan = [] }) {
  const [filter, setFilter] = useState("Semua");
  const [pesananAktif, setPesananAktif] = useState(null);

  // Filter berdasarkan status
  const pesananTersaring = pesanan.filter((item) => {
    if (filter === "Semua") return true;

    return item.status === filter;
  });

  // Warna status
  const classStatus = (status) => {
    switch (status) {
      case "Menunggu Pembayaran":
        return "status-menunggu";

      case "Diproses":
        return "status-diproses";

      case "Selesai":
        return "status-selesai";

      case "Dibatalkan":
        return "status-dibatalkan";

      default:
        return "status-menunggu";
    }
  };

  return (
    <main className="page-container orders-page">

      {pesanan.length === 0 ? (

        // PESANAN KOSONG
        <div className="orders-empty">

          <div className="orders-empty-icon">
            <Package size={35} />
          </div>

          <h3>Belum Ada Pesanan</h3>

          <p>
            Kamu belum memiliki riwayat transaksi.
            Silakan pilih topeng favoritmu terlebih dahulu.
          </p>

          <Link
            to="/produk"
            className="primary-button"
          >
            <ShoppingBag size={16} />
            Mulai Belanja
          </Link>

        </div>

      ) : (

        // DAFTAR PESANAN
        <section className="orders-container">

          <div className="orders-top">
            <h2>Riwayat Pesanan</h2>

            <p>
              {pesanan.length} transaksi tersimpan
            </p>
          </div>

          {/* FILTER STATUS */}
          <div className="order-filters">

            {kategoriStatus.map((status) => {

              const jumlah = status === "Semua"
                ? pesanan.length
                : pesanan.filter(
                    (item) => item.status === status
                  ).length;

              return (
                <button
                  key={status}
                  type="button"
                  className={`order-filter ${
                    filter === status ? "active" : ""
                  }`}
                  onClick={() => setFilter(status)}
                >
                  {status}
                  <span>{jumlah}</span>
                </button>
              );
            })}

          </div>

          {/* KARTU PESANAN */}
          <div className="order-list">

            {pesananTersaring.length === 0 ? (

              <div className="orders-empty">
                <Package size={35} />

                <h3>Pesanan Tidak Ditemukan</h3>

                <p>
                  Belum ada pesanan dengan status {filter}.
                </p>
              </div>

            ) : (

              pesananTersaring.map((item) => {

                const daftarProduk = item.produk || [];
                const produkPertama = daftarProduk[0];

                const jumlahProduk = daftarProduk.reduce(
                  (total, produk) =>
                    total + (Number(produk.jumlah) || 0),
                  0
                );

                return (
                  <article
                    className="order-card"
                    key={item.id}
                  >

                    {/* HEADER PESANAN */}
                    <div className="order-card-top">

                      <div className="order-code">
                        <Package size={17} />

                        <strong>
                          Pesanan #{item.id}
                        </strong>
                      </div>

                      <span
                        className={`order-status ${classStatus(
                          item.status
                        )}`}
                      >
                        {item.status || "Menunggu Pembayaran"}
                      </span>

                    </div>

                    {/* ISI PESANAN */}
                    <div className="order-card-content">

                      {produkPertama && (
                        <img
                          className="order-main-image"
                          src={produkPertama.gambar}
                          alt={produkPertama.nama}
                        />
                      )}

                      <div className="order-main-info">

                        <div className="order-date">
                          <CalendarDays size={14} />

                          {formatTanggal(item.tanggal)}
                        </div>

                        <h3>
                          {produkPertama?.nama || "Produk"}
                        </h3>

                        <p>
                          {daftarProduk.length > 1
                            ? `dan ${daftarProduk.length - 1} produk lainnya`
                            : `${jumlahProduk} produk`}
                        </p>

                        <strong>
                          {rupiah(item.total || 0)}
                        </strong>

                      </div>

                      <div className="order-card-action">

                        <span className="order-total-label">
                          Total Pembayaran
                        </span>

                        <strong>
                          {rupiah(item.total || 0)}
                        </strong>

                        <button
                          type="button"
                          className="order-detail-button"
                          onClick={() => setPesananAktif(item)}
                        >
                          <Eye size={15} />
                          Lihat Detail
                        </button>

                      </div>

                    </div>

                    {/* FOOTER */}
                    <div className="order-card-footer">

                      <span>
                        Penerima: {item.nama || "-"}
                      </span>

                      <span>
                        {jumlahProduk} produk
                      </span>

                    </div>

                  </article>
                );
              })

            )}

          </div>

          <Link
            to="/produk"
            className="cart-back-link"
          >
            <ArrowLeft size={15} />
            Kembali Belanja
          </Link>

        </section>

      )}

      {/* =================================
          MODAL DETAIL PESANAN
      ================================= */}

      {pesananAktif && (

        <div
          className="order-modal-overlay"
          onClick={() => setPesananAktif(null)}
        >

          <div
            className="order-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* HEADER MODAL */}
            <div className="order-modal-header">

              <div>
                <span>DETAIL TRANSAKSI</span>

                <h2>Pesanan #{pesananAktif.id}</h2>
              </div>

              <button
                type="button"
                className="order-modal-close"
                onClick={() => setPesananAktif(null)}
              >
                <X size={19} />
              </button>

            </div>

            {/* ISI MODAL */}
            <div className="order-modal-body">

              {/* INFORMASI PESANAN */}
              <div className="detail-section">

                <h3>
                  <Package size={16} />
                  Informasi Pesanan
                </h3>

                <div className="detail-code-row">

                  <div>
                    <span className="detail-label">
                      Nomor Pesanan
                    </span>

                    <strong>
                      #{pesananAktif.id}
                    </strong>
                  </div>

                  <span
                    className={`order-status ${classStatus(
                      pesananAktif.status
                    )}`}
                  >
                    {pesananAktif.status || "Menunggu Pembayaran"}
                  </span>

                </div>

                <div className="detail-date">
                  <CalendarDays size={14} />

                  {formatTanggal(pesananAktif.tanggal)}
                </div>

              </div>

              {/* PRODUK YANG DIBELI */}
              <div className="detail-section">

                <h3>
                  <ShoppingBag size={16} />
                  Produk yang Dibeli
                </h3>

                <div className="detail-product-list">

                  {(pesananAktif.produk || []).map(
                    (produk, index) => (

                      <div
                        className="detail-product"
                        key={`${produk.id}-${index}`}
                      >

                        <img
                          src={produk.gambar}
                          alt={produk.nama}
                        />

                        <div className="detail-product-info">

                          <strong>{produk.nama}</strong>

                          <span>
                            {produk.jumlah} x {rupiah(produk.harga)}
                          </span>

                        </div>

                        <strong className="detail-product-price">
                          {rupiah(
                            produk.harga * produk.jumlah
                          )}
                        </strong>

                      </div>

                    )
                  )}

                </div>

              </div>

              {/* INFORMASI PENERIMA */}
              <div className="detail-section">

                <h3>
                  <UserRound size={16} />
                  Informasi Penerima
                </h3>

                <div className="detail-information">

                  <div className="detail-info-row">
                    <UserRound size={15} />

                    <div>
                      <span>Nama Penerima</span>
                      <strong>
                        {pesananAktif.nama || "-"}
                      </strong>
                    </div>
                  </div>

                  <div className="detail-info-row">
                    <Phone size={15} />

                    <div>
                      <span>Nomor Telepon</span>
                      <strong>
                        {pesananAktif.telepon || "-"}
                      </strong>
                    </div>
                  </div>

                  <div className="detail-info-row">
                    <MapPin size={15} />

                    <div>
                      <span>Alamat Pengiriman</span>
                      <strong>
                        {pesananAktif.alamat || "-"}
                      </strong>
                    </div>
                  </div>

                </div>

              </div>

              {/* INFORMASI PEMBAYARAN */}
              <div className="detail-section">

                <h3>
                  <CreditCard size={16} />
                  Informasi Pembayaran
                </h3>

                <div className="detail-information">

                  <div className="detail-info-row">
                    <CreditCard size={15} />

                    <div>
                      <span>Metode Pembayaran</span>
                      <strong>
                        {pesananAktif.pembayaran || "-"}
                      </strong>
                    </div>
                  </div>

                  {pesananAktif.bankTujuan && (
                    <div className="detail-info-row">
                      <Receipt size={15} />

                      <div>
                        <span>Bank Tujuan</span>
                        <strong>
                          {pesananAktif.bankTujuan}
                        </strong>
                      </div>
                    </div>
                  )}

                  {pesananAktif.nomorRekening && (
                    <div className="detail-info-row">
                      <Receipt size={15} />

                      <div>
                        <span>Nomor Rekening</span>
                        <strong>
                          {pesananAktif.nomorRekening}
                        </strong>
                      </div>
                    </div>
                  )}

                </div>

                {/* BUKTI PEMBAYARAN */}
                <div className="detail-payment-proof">

                  <span className="detail-label">
                    Bukti Pembayaran
                  </span>

                  {pesananAktif.buktiPembayaran ? (

                    <a
                      href={pesananAktif.buktiPembayaran}
                      target="_blank"
                      rel="noreferrer"
                      className="detail-proof-image-link"
                    >
                      <img
                        src={pesananAktif.buktiPembayaran}
                        alt="Bukti Pembayaran"
                        className="detail-proof-image"
                      />

                      Lihat Bukti Pembayaran
                    </a>

                  ) : (

                    <p className="detail-proof-empty">
                      Belum ada bukti pembayaran.
                    </p>

                  )}

                </div>

              </div>

              {/* TOTAL */}
              <div className="detail-total-section">

                <span>Total Pembayaran</span>

                <strong>
                  {rupiah(pesananAktif.total || 0)}
                </strong>

              </div>

            </div>

            {/* FOOTER MODAL */}
            <div className="order-modal-footer">

              <button
                type="button"
                className="order-modal-back"
                onClick={() => setPesananAktif(null)}
              >
                <ArrowLeft size={15} />
                Tutup Detail
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}

export default Pesanan;
