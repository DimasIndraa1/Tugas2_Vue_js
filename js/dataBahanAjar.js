window.dataBahanAjar = {
  upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],

  kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],

  pengirimanList: [
    { kode: "REG", nama: "Reguler (3-5 hari)", ongkir: 12000 },
    { kode: "EXP", nama: "Ekspres (1-2 hari)", ongkir: 25000 }
  ],

  paket: [
    {
      kode: "PAKET-UT-001",
      nama: "PAKET IPS Dasar",
      isi: ["EKMA4116", "EKMA4115"],
      harga: 120000
    },
    {
      kode: "PAKET-UT-002",
      nama: "PAKET IPA Dasar",
      isi: ["BIOL4201", "FISIP4001"],
      harga: 140000
    }
  ],

  stok: [
    {
      kode: "EKMA4116",
      judul: "Pengantar Manajemen",
      kategori: "MK Wajib",
      upbjj: "Jakarta",
      lokasiRak: "R1-A3",
      harga: 65000,
      qty: 28,
      safety: 20,
      catatanHTML: "<em>Edisi 2024, cetak ulang</em>"
    },
    {
      kode: "EKMA4115",
      judul: "Pengantar Akuntansi",
      kategori: "MK Wajib",
      upbjj: "Jakarta",
      lokasiRak: "R1-A4",
      harga: 60000,
      qty: 7,
      safety: 15,
      catatanHTML: "<strong>Cover baru</strong>"
    },
    {
      kode: "MKDU4110",
      judul: "Bahasa Indonesia",
      kategori: "MK Wajib",
      upbjj: "Jakarta",
      lokasiRak: "R1-B1",
      harga: 48000,
      qty: 0,
      safety: 25,
      catatanHTML: "Stok habis, <strong>prioritaskan reorder</strong>"
    },
    {
      kode: "EKMA4213",
      judul: "Manajemen Keuangan",
      kategori: "MK Pilihan",
      upbjj: "Jakarta",
      lokasiRak: "R1-C2",
      harga: 72000,
      qty: 14,
      safety: 12,
      catatanHTML: "<em>Edisi ketiga</em>"
    },
    {
      kode: "ADPU4130",
      judul: "Pengantar Ilmu Administrasi Negara",
      kategori: "MK Wajib",
      upbjj: "Jakarta",
      lokasiRak: "R1-D1",
      harga: 58000,
      qty: 9,
      safety: 10,
      catatanHTML: "Menunggu kiriman dari pusat"
    },

    {
      kode: "BIOL4201",
      judul: "Biologi Umum (Praktikum)",
      kategori: "Praktikum",
      upbjj: "Surabaya",
      lokasiRak: "R3-B2",
      harga: 80000,
      qty: 12,
      safety: 10,
      catatanHTML: "Butuh <u>pendingin</u> untuk kit basah"
    },
    {
      kode: "EKMA4210",
      judul: "Manajemen Operasional",
      kategori: "MK Wajib",
      upbjj: "Surabaya",
      lokasiRak: "R3-A1",
      harga: 69000,
      qty: 5,
      safety: 18,
      catatanHTML: "Permintaan naik pada masa registrasi"
    },
    {
      kode: "MKDU4221",
      judul: "Pendidikan Agama Islam",
      kategori: "MK Wajib",
      upbjj: "Surabaya",
      lokasiRak: "R3-C3",
      harga: 46000,
      qty: 31,
      safety: 20,
      catatanHTML: "<em>Stok aman</em>"
    },
    {
      kode: "PDGK4105",
      judul: "Strategi Pembelajaran di SD",
      kategori: "MK Pilihan",
      upbjj: "Surabaya",
      lokasiRak: "R3-D2",
      harga: 62000,
      qty: 0,
      safety: 12,
      catatanHTML: "Kosong sejak <strong>Juli</strong>"
    },
    {
      kode: "ISIP4110",
      judul: "Pengantar Sosiologi",
      kategori: "MK Pilihan",
      upbjj: "Surabaya",
      lokasiRak: "R3-E1",
      harga: 54000,
      qty: 17,
      safety: 15,
      catatanHTML: "Rak dipindah dari R2"
    },

    {
      kode: "FISIP4001",
      judul: "Dasar-Dasar Sosiologi",
      kategori: "MK Pilihan",
      upbjj: "Makassar",
      lokasiRak: "R2-C1",
      harga: 55000,
      qty: 2,
      safety: 8,
      catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder"
    },
    {
      kode: "EKMA4116",
      judul: "Pengantar Manajemen",
      kategori: "MK Wajib",
      upbjj: "Makassar",
      lokasiRak: "R2-A1",
      harga: 65000,
      qty: 22,
      safety: 15,
      catatanHTML: "<em>Edisi 2024</em>"
    },
    {
      kode: "PDGK4202",
      judul: "Pembelajaran IPA di SD",
      kategori: "Praktikum",
      upbjj: "Makassar",
      lokasiRak: "R2-B3",
      harga: 75000,
      qty: 6,
      safety: 9,
      catatanHTML: "Kit praktikum <u>terbatas</u>"
    },
    {
      kode: "MKDU4110",
      judul: "Bahasa Indonesia",
      kategori: "MK Wajib",
      upbjj: "Makassar",
      lokasiRak: "R2-D1",
      harga: 48000,
      qty: 40,
      safety: 25,
      catatanHTML: "<strong>Cetak ulang 2025</strong>"
    },
    {
      kode: "ADPU4334",
      judul: "Manajemen Sumber Daya Manusia",
      kategori: "Problem-Based",
      upbjj: "Makassar",
      lokasiRak: "R2-E2",
      harga: 68000,
      qty: 4,
      safety: 10,
      catatanHTML: "Dipakai untuk <em>tugas kasus</em>"
    },

    {
      kode: "EKMA4115",
      judul: "Pengantar Akuntansi",
      kategori: "MK Wajib",
      upbjj: "Padang",
      lokasiRak: "R4-A2",
      harga: 60000,
      qty: 19,
      safety: 15,
      catatanHTML: "<em>Cover lama</em>"
    },
    {
      kode: "BIOL4201",
      judul: "Biologi Umum (Praktikum)",
      kategori: "Praktikum",
      upbjj: "Padang",
      lokasiRak: "R4-B1",
      harga: 80000,
      qty: 0,
      safety: 6,
      catatanHTML: "Kit basah <strong>belum dikirim</strong>"
    },
    {
      kode: "ISIP4110",
      judul: "Pengantar Sosiologi",
      kategori: "MK Pilihan",
      upbjj: "Padang",
      lokasiRak: "R4-C3",
      harga: 54000,
      qty: 8,
      safety: 12,
      catatanHTML: "Menipis menjelang ujian"
    },
    {
      kode: "PDGK4105",
      judul: "Strategi Pembelajaran di SD",
      kategori: "MK Pilihan",
      upbjj: "Padang",
      lokasiRak: "R4-D2",
      harga: 62000,
      qty: 11,
      safety: 10,
      catatanHTML: "<em>Aman</em>"
    },
    {
      kode: "ADPU4130",
      judul: "Pengantar Ilmu Administrasi Negara",
      kategori: "MK Wajib",
      upbjj: "Padang",
      lokasiRak: "R4-E1",
      harga: 58000,
      qty: 3,
      safety: 14,
      catatanHTML: "Reorder <strong>segera</strong>"
    },

    {
      kode: "EKMA4210",
      judul: "Manajemen Operasional",
      kategori: "MK Wajib",
      upbjj: "Denpasar",
      lokasiRak: "R5-A1",
      harga: 69000,
      qty: 26,
      safety: 18,
      catatanHTML: "<em>Stok aman</em>"
    },
    {
      kode: "MKDU4221",
      judul: "Pendidikan Agama Islam",
      kategori: "MK Wajib",
      upbjj: "Denpasar",
      lokasiRak: "R5-B2",
      harga: 46000,
      qty: 9,
      safety: 20,
      catatanHTML: "Menunggu <u>pengiriman pusat</u>"
    },
    {
      kode: "PDGK4202",
      judul: "Pembelajaran IPA di SD",
      kategori: "Praktikum",
      upbjj: "Denpasar",
      lokasiRak: "R5-C1",
      harga: 75000,
      qty: 0,
      safety: 8,
      catatanHTML: "Habis untuk <strong>praktikum</strong>"
    },
    {
      kode: "FISIP4001",
      judul: "Dasar-Dasar Sosiologi",
      kategori: "MK Pilihan",
      upbjj: "Denpasar",
      lokasiRak: "R5-D3",
      harga: 55000,
      qty: 13,
      safety: 10,
      catatanHTML: "<em>Edisi 2023</em>"
    },
    {
      kode: "ADPU4334",
      judul: "Manajemen Sumber Daya Manusia",
      kategori: "Problem-Based",
      upbjj: "Denpasar",
      lokasiRak: "R5-E2",
      harga: 68000,
      qty: 7,
      safety: 7,
      catatanHTML: "Tepat di batas safety"
    }
  ],

  tracking: {
    "DO2025-0001": {
      nim: "123456789",
      nama: "Rina Wulandari",
      status: "Dalam Perjalanan",
      ekspedisi: "JNE",
      tanggalKirim: "2025-08-25",
      paket: "PAKET-UT-001",
      total: 132000,
      upbjj: "Jakarta",
      alamat: "Jl. Cendana No. 14, RT 03/05, Tangerang Selatan, Banten",
      perjalanan: [
        { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" },
        { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
        { waktu: "2025-08-26 08:44:01", keterangan: "Diteruskan ke Kantor Tujuan" }
      ]
    },
    "DO2025-0002": {
      nim: "041928374",
      nama: "Dimas Nurindra",
      status: "Terkirim",
      ekspedisi: "J&T Express",
      tanggalKirim: "2025-08-18",
      paket: "PAKET-UT-002",
      total: 152000,
      upbjj: "Jakarta",
      alamat: "Jl. Diponegoro No. 10, RT 02/04, Jakarta Pusat, DKI Jakarta",
      perjalanan: [
        { waktu: "2025-08-18 09:05:11", keterangan: "Penerimaan di Loket: JAKPUS" },
        { waktu: "2025-08-18 16:21:40", keterangan: "Tiba di Hub: JAKTIM" },
        { waktu: "2025-08-19 07:33:18", keterangan: "Sedang dibawa kurir" },
        { waktu: "2025-08-19 11:02:55", keterangan: "Terkirim dan diterima penerima" }
      ]
    },
    "DO2025-0003": {
      nim: "049876543",
      nama: "Siti Rahmawati",
      status: "Diproses di Gudang",
      ekspedisi: "Reguler (3-5 hari)",
      tanggalKirim: "2025-09-02",
      paket: "PAKET-UT-001",
      total: 132000,
      upbjj: "Surabaya",
      alamat: "Jl. Ahmad Yani No. 88, RT 01/02, Surabaya, Jawa Timur",
      perjalanan: [
        { waktu: "2025-09-02 08:15:00", keterangan: "Pesanan diterima sentra distribusi" },
        { waktu: "2025-09-02 13:40:22", keterangan: "Sedang dikemas di gudang UPBJJ Surabaya" }
      ]
    }
  }
};
