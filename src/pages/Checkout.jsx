
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CreditCard,
  Upload,
  CheckCircle2,
  ShoppingBag,
  FileImage,
} from "lucide-react";
import { rupiah } from "./Produk";

// GANTI DENGAN REKENING ASLI TOKO KAMU
const rekeningToko = {
  bank: "BCA",
  nomor: "1234567890",
  pemilik: "QR Topeng Malang",
};

export default function Checkout({ buatPesanan }) {
  const navigate = useNavigate();
  const location = useLocation();

  const produkDipilih = location.state?.produkDipilih || [];

  const [form, setForm] = useState({
    nama: "",
    telepon: "",
    alamat: "",
  });

  const [buktiPembayaran, setBuktiPembayaran] = useState(null);
  const [loading, setLoading] = useState(false);

  const totalHarga = produkDipilih.reduce(
    (total, item) => total + item.harga * item.jumlah,
    0
  );

  const jumlahBarang = produkDipilih.reduce(
    (total, item) => total + item.jumlah,
    0
  );

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formatDiizinkan = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!formatDiizinkan.includes(file.type)) {
      alert("Format file harus JPG, PNG, WEBP, atau PDF.");
      e.target.value = "";
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      alert("Ukuran bukti pembayaran maksimal 3 MB.");
      e.target.value = "";
      return;
    }

    setBuktiPembayaran(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (produkDipilih.length === 0) {
      alert("Tidak ada produk yang dipilih!");
      navigate("/keranjang");
      return;
    }

    if (!buktiPembayaran) {
      alert("Silakan upload bukti pembayaran terlebih dahulu!");
      return;
    }

    setLoading(true);

    try {
      // Mengubah file menjadi data URL agar bisa disimpan
      const fileData = await new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = () =>
          reject(new Error("Gagal membaca file bukti pembayaran."));

        reader.readAsDataURL(buktiPembayaran);
      });

      const pesananBaru = {
        id: Date.now(),
        tanggal: new Date().toLocaleDateString("id-ID"),
        produk: produkDipilih,
        total: totalHarga,
        nama: form.nama,
        telepon: form.telepon,
        alamat: form.alamat,
        pembayaran: "Transfer Bank",
        bankTujuan: rekeningToko.bank,
        nomorRekening: rekeningToko.nomor,
        buktiPembayaran: {
          namaFile: buktiPembayaran.name,
          tipeFile: buktiPembayaran.type,
          data: fileData,
        },
        status: "Menunggu Verifikasi Pembayaran",
      };

      await buatPesanan(
        pesananBaru,
        produkDipilih.map((item) => item.id)
      );

      navigate("/pesanan");
    } catch (error) {
      console.error("Gagal membuat pesanan:", error);
      alert("Gagal membuat pesanan. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  };

  if (produkDipilih.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-state checkout-empty">
          <div className="checkout-empty-icon">
            <ShoppingBag size={45} />
          </div>

          <h2>Belum Ada Produk Dipilih</h2>
          <p>
            Silakan pilih produk terlebih dahulu di keranjang.
          </p>

          <button
            className="btn-primary"
            onClick={() => navigate("/keranjang")}
          >
            Kembali ke Keranjang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">

      <form
        className="checkout-layout"
        onSubmit={handleSubmit}
      >
        {/* BAGIAN KIRI */}
        <div className="checkout-left">

          {/* INFORMASI PENGIRIMAN */}
          <section className="checkout-card">
            <div className="checkout-card-heading">
              <div className="checkout-heading-icon">
                <ShoppingBag size={20} />
              </div>

              <div>
                <h2>Informasi Pengiriman</h2>
                <p>Masukkan data penerima pesanan.</p>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="nama">
                Nama Lengkap <span>*</span>
              </label>

              <input
                id="nama"
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                autoComplete="name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="telepon">
                Nomor HP / WhatsApp <span>*</span>
              </label>

              <input
                id="telepon"
                type="tel"
                name="telepon"
                value={form.telepon}
                onChange={handleChange}
                placeholder="Contoh: 081234567890"
                autoComplete="tel"
                pattern="[0-9+ ]{9,16}"
                title="Masukkan nomor HP yang valid."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="alamat">
                Alamat Lengkap <span>*</span>
              </label>

              <textarea
                id="alamat"
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota, dan kode pos"
                rows={4}
                autoComplete="street-address"
                required
              />
            </div>
          </section>

          {/* INFORMASI PEMBAYARAN */}
          <section className="checkout-card">
            <div className="checkout-card-heading">
              <div className="checkout-heading-icon">
                <CreditCard size={20} />
              </div>

              <div>
                <h2>Pembayaran Transfer Bank</h2>
                <p>Silakan transfer ke rekening berikut.</p>
              </div>
            </div>

            <div className="bank-card">
              <div className="bank-card-top">
                <span>TRANSFER BANK</span>
                <CreditCard size={25} />
              </div>

              <div className="bank-name">
                {rekeningToko.bank}
              </div>

              <p className="bank-account-label">
                Nomor Rekening
              </p>

              <div className="bank-account-number">
                {rekeningToko.nomor}
              </div>

              <p className="bank-owner-label">
                Atas Nama
              </p>

              <strong className="bank-owner">
                {rekeningToko.pemilik}
              </strong>
            </div>

            <div className="payment-instruction">
              <CheckCircle2 size={18} />

              <p>
                Transfer sesuai dengan total pembayaran.
                Setelah itu, upload bukti transfer di bawah ini.
              </p>
            </div>

            <div className="form-group upload-group">
              <label>
                Upload Bukti Pembayaran <span>*</span>
              </label>

              <label
                htmlFor="buktiPembayaran"
                className={`upload-box ${
                  buktiPembayaran ? "upload-success" : ""
                }`}
              >
                <input
                  id="buktiPembayaran"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleUpload}
                  required
                />

                {buktiPembayaran ? (
                  <>
                    <FileImage size={30} />

                    <strong>
                      {buktiPembayaran.name}
                    </strong>

                    <span>
                      File berhasil dipilih. Klik untuk mengganti.
                    </span>
                  </>
                ) : (
                  <>
                    <div className="upload-icon">
                      <Upload size={25} />
                    </div>

                    <strong>
                      Klik untuk upload bukti transfer
                    </strong>

                    <span>
                      Format JPG, PNG, WEBP, atau PDF (maks. 3 MB)
                    </span>
                  </>
                )}
              </label>
            </div>
          </section>
        </div>

        {/* BAGIAN KANAN */}
        <aside className="checkout-summary">
          <h2>Ringkasan Pesanan</h2>

          <div className="checkout-product-list">
            {produkDipilih.map((item) => (
              <div className="checkout-product" key={item.id}>
                <img
                  src={item.gambar || item.image}
                  alt={item.nama}
                />

                <div className="checkout-product-info">
                  <h4>{item.nama}</h4>

                  <p>
                    {item.jumlah} barang × {rupiah(item.harga)}
                  </p>

                  <strong>
                    {rupiah(item.harga * item.jumlah)}
                  </strong>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-summary-details">
            <div className="summary-row">
              <span>Jumlah produk</span>
              <strong>{produkDipilih.length} produk</strong>
            </div>

            <div className="summary-row">
              <span>Total barang</span>
              <strong>{jumlahBarang} barang</strong>
            </div>

            <div className="summary-row">
              <span>Metode pembayaran</span>
              <strong>Transfer Bank</strong>
            </div>
          </div>

          <div className="summary-total">
            <span>Total Pembayaran</span>
            <strong>{rupiah(totalHarga)}</strong>
          </div>

          <button
            type="submit"
            className="btn-primary btn-checkout"
            disabled={loading}
          >
            {loading ? "Memproses Pesanan..." : "Buat Pesanan"}
          </button>

          <button
            type="button"
            className="btn-continue-shopping"
            onClick={() => navigate("/keranjang")}
            disabled={loading}
          >
            Kembali ke Keranjang
          </button>

          <p className="checkout-secure-note">
            <CheckCircle2 size={15} />
            Pastikan data dan bukti pembayaran sudah benar.
          </p>
        </aside>
      </form>
    </div>
  );
}
