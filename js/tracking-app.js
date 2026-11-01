const { createApp } = Vue;

createApp({
  data() {
    const source = (typeof window !== "undefined" && window.dataBahanAjar) || {};

    return {
      title: "Tracking Delivery Order",
      subtitle: "Lacak posisi pengiriman bahan ajar berdasarkan nomor DO atau NIM mahasiswa.",

      upbjjList: [...(source.upbjjList || [])],
      paketList: [...(source.paket || [])],
      pengirimanList: [...(source.pengirimanList || [])],
      trackingData: JSON.parse(JSON.stringify(source.tracking || {})),

      searchDoNumber: "",
      activeTrackingResult: null,
      searchNotFound: false,

      newOrder: {
        nim: "",
        nama: "",
        paketKode: "",
        ekspedisiKode: "",
        alamat: "",
        upbjj: (source.upbjjList && source.upbjjList[0]) || ""
      },
      orderErrors: {},

      toastMessage: "",
      toastType: "info",
      toastTimer: null
    };
  },

  computed: {
    allOrdersList() {
      return Object.keys(this.trackingData)
        .sort()
        .map((nomorDO) => ({
          nomorDO,
          ...this.trackingData[nomorDO]
        }));
    },

    selectedPaketDetail() {
      if (!this.newOrder.paketKode) {
        return null;
      }
      return this.paketList.find((paket) => paket.kode === this.newOrder.paketKode) || null;
    },

    selectedOngkir() {
      const layanan = this.pengirimanList.find(
        (item) => item.kode === this.newOrder.ekspedisiKode
      );
      return layanan ? Number(layanan.ongkir) || 0 : 0;
    },

    computedTotalOrder() {
      const hargaPaket = this.selectedPaketDetail ? this.selectedPaketDetail.harga : 0;
      return hargaPaket + this.selectedOngkir;
    }
  },

  methods: {
    formatRupiah(value) {
      const number = Number(value);
      if (!Number.isFinite(number)) {
        return "Rp 0";
      }
      return "Rp " + number.toLocaleString("id-ID");
    },

    statusClass(status) {
      if (status === "Terkirim") {
        return "status-aman";
      }
      if (status === "Dibatalkan") {
        return "status-kosong";
      }
      return "status-menipis";
    },

    searchTracking(customCode) {
      const query = String(customCode || this.searchDoNumber || "").trim().toUpperCase();
      this.searchNotFound = false;

      if (!query) {
        this.activeTrackingResult = null;
        return;
      }

      if (this.trackingData[query]) {
        this.activeTrackingResult = { nomorDO: query, ...this.trackingData[query] };
        this.searchDoNumber = query;
        return;
      }

      const foundKey = Object.keys(this.trackingData).find(
        (key) => String(this.trackingData[key].nim) === query
      );

      if (foundKey) {
        this.activeTrackingResult = { nomorDO: foundKey, ...this.trackingData[foundKey] };
        this.searchDoNumber = foundKey;
        return;
      }

      this.activeTrackingResult = null;
      this.searchNotFound = true;
    },

    selectQuickDO(nomorDO) {
      this.searchDoNumber = nomorDO;
      this.searchTracking(nomorDO);
    },

    validateOrderForm() {
      const errors = {};
      const order = this.newOrder;

      if (!/^\d{8,12}$/.test(order.nim.trim())) {
        errors.nim = "NIM harus 8 sampai 12 digit angka.";
      }
      if (order.nama.trim().length < 3) {
        errors.nama = "Nama lengkap minimal 3 karakter.";
      }
      if (!order.paketKode) {
        errors.paketKode = "Pilih paket bahan ajar.";
      }
      if (!order.ekspedisiKode) {
        errors.ekspedisiKode = "Pilih jenis ekspedisi.";
      }
      if (!order.upbjj) {
        errors.upbjj = "Pilih sentra distribusi.";
      }
      if (order.alamat.trim().length < 10) {
        errors.alamat = "Alamat tujuan minimal 10 karakter.";
      }

      this.orderErrors = errors;
      return Object.keys(errors).length === 0;
    },

    submitNewOrder() {
      if (!this.validateOrderForm()) {
        this.showToast("Lengkapi kolom pemesanan yang ditandai merah.", "danger");
        return;
      }

      const numbers = Object.keys(this.trackingData).map((key) => {
        const suffix = Number(String(key).split("-")[1]);
        return Number.isFinite(suffix) ? suffix : 0;
      });
      const nextNumber = Math.max(0, ...numbers) + 1;
      const now = new Date();
      const newDONumber = `DO${now.getFullYear()}-${String(nextNumber).padStart(4, "0")}`;

      const pad = (value) => String(value).padStart(2, "0");
      const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
      const timeStr = now.toTimeString().split(" ")[0];
      const ekspedisi = this.pengirimanList.find(
        (item) => item.kode === this.newOrder.ekspedisiKode
      );

      this.trackingData[newDONumber] = {
        nim: this.newOrder.nim.trim(),
        nama: this.newOrder.nama.trim(),
        status: "Diproses di Gudang",
        ekspedisi: ekspedisi ? ekspedisi.nama : this.newOrder.ekspedisiKode,
        tanggalKirim: dateStr,
        paket: this.newOrder.paketKode,
        total: this.computedTotalOrder,
        upbjj: this.newOrder.upbjj,
        alamat: this.newOrder.alamat.trim(),
        perjalanan: [
          {
            waktu: `${dateStr} ${timeStr}`,
            keterangan: `Pesanan dibuat di sentra distribusi UPBJJ ${this.newOrder.upbjj}.`
          }
        ]
      };

      this.showToast(`Delivery order ${newDONumber} berhasil dibuat.`, "success");
      this.searchDoNumber = newDONumber;
      this.searchTracking(newDONumber);
      this.resetOrderForm();
    },

    resetOrderForm() {
      this.newOrder = {
        nim: "",
        nama: "",
        paketKode: "",
        ekspedisiKode: "",
        alamat: "",
        upbjj: this.upbjjList[0] || ""
      };
      this.orderErrors = {};
    },

    showToast(message, type = "info") {
      this.toastMessage = message;
      this.toastType = type;
      window.clearTimeout(this.toastTimer);
      this.toastTimer = window.setTimeout(() => {
        if (this.toastMessage === message) {
          this.toastMessage = "";
        }
      }, 5000);
    }
  },

  mounted() {
    const firstDO = Object.keys(this.trackingData).sort()[0];
    if (firstDO) {
      this.searchDoNumber = firstDO;
      this.searchTracking(firstDO);
    }
  },

  beforeUnmount() {
    window.clearTimeout(this.toastTimer);
  }
}).mount("#app");
