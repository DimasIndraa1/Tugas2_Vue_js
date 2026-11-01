const { createApp } = Vue;

createApp({
  data() {
    const source = (typeof window !== "undefined" && window.dataBahanAjar) || {};
    const fallback = {
      upbjjList: [],
      kategoriList: [],
      stok: []
    };
    const data = {
      upbjjList: source.upbjjList || fallback.upbjjList,
      kategoriList: source.kategoriList || fallback.kategoriList,
      stok: source.stok || fallback.stok
    };

    return {
      title: "Stok Bahan Ajar UT Daerah",
      subtitle: "Pantau jumlah stok, batas safety, dan kebutuhan re-order di seluruh UPBJJ.",

      upbjjList: [...data.upbjjList],
      kategoriList: [...data.kategoriList],
      stokList: data.stok.map((item) => ({ ...item })),

      selectedUpbjj: "",
      selectedKategori: "",
      onlyReorder: false,
      statusFilter: "",
      searchQuery: "",
      sortBy: "judul",
      sortOrder: "asc",

      newBahanAjar: {
        kode: "",
        judul: "",
        kategori: "",
        upbjj: "",
        lokasiRak: "",
        harga: null,
        qty: null,
        safety: null,
        catatanHTML: ""
      },
      formErrors: {},

      isEditModalOpen: false,
      editingItemIndex: -1,
      editForm: {
        kode: "",
        judul: "",
        kategori: "",
        upbjj: "",
        lokasiRak: "",
        harga: 0,
        qty: 0,
        safety: 0,
        catatanHTML: ""
      },
      editErrors: {},

      toastMessage: "",
      toastType: "info",
      toastTimer: null,
      lastFocusedElement: null
    };
  },

  computed: {
    // Vue caches this until selectedUpbjj or stokList changes.
    availableCategories() {
      if (!this.selectedUpbjj) {
        return [];
      }
      const seen = new Set(
        this.stokList
          .filter((item) => item.upbjj === this.selectedUpbjj)
          .map((item) => item.kategori)
      );
      return [...seen];
    },

    // Filtering and sorting run once per dependency change, not on every render.
    filteredAndSortedStok() {
      const query = this.searchQuery.trim().toLowerCase();

      const result = this.stokList.filter((item) => {
        if (this.selectedUpbjj && item.upbjj !== this.selectedUpbjj) {
          return false;
        }
        if (this.selectedKategori && item.kategori !== this.selectedKategori) {
          return false;
        }
        if (this.onlyReorder) {
          const qty = Number(item.qty) || 0;
          const safety = Number(item.safety) || 0;
          if (qty !== 0 && qty >= safety) {
            return false;
          }
        }
        if (this.statusFilter) {
          const status = this.computeStockStatus(item.qty, item.safety);
          if (status.label !== this.statusFilter) {
            return false;
          }
        }
        if (query) {
          const matchKode = String(item.kode).toLowerCase().includes(query);
          const matchJudul = String(item.judul).toLowerCase().includes(query);
          if (!matchKode && !matchJudul) {
            return false;
          }
        }
        return true;
      });

      const direction = this.sortOrder === "asc" ? 1 : -1;
      result.sort((a, b) => {
        if (this.sortBy === "judul") {
          return a.judul.localeCompare(b.judul, "id") * direction;
        }
        if (this.sortBy === "qty") {
          return (Number(a.qty) - Number(b.qty)) * direction;
        }
        if (this.sortBy === "harga") {
          return (Number(a.harga) - Number(b.harga)) * direction;
        }
        return 0;
      });

      return result;
    },

    summaryMetrics() {
      const uniqueKode = new Set(this.stokList.map((item) => item.kode));
      let totalQty = 0;
      let needReorder = 0;
      let outOfStock = 0;
      let totalAssetValue = 0;

      this.stokList.forEach((item) => {
        const qty = Number(item.qty) || 0;
        const safety = Number(item.safety) || 0;
        const harga = Number(item.harga) || 0;

        totalQty += qty;
        totalAssetValue += qty * harga;

        if (qty === 0) {
          outOfStock += 1;
          needReorder += 1;
        } else if (qty < safety) {
          needReorder += 1;
        }
      });

      return {
        totalJudul: uniqueKode.size,
        totalQty,
        needReorder,
        outOfStock,
        totalAssetValue
      };
    },

    statusCounts() {
      const counts = { aman: 0, menipis: 0, kosong: 0 };
      this.stokList.forEach((item) => {
        const status = this.computeStockStatus(item.qty, item.safety);
        counts[status.key] += 1;
      });
      return counts;
    },

    reorderAlertCount() {
      return this.stokList.filter((item) => {
        const qty = Number(item.qty) || 0;
        const safety = Number(item.safety) || 0;
        return qty === 0 || qty < safety;
      }).length;
    },

    editModalPreviewStatus() {
      return this.computeStockStatus(this.editForm.qty, this.editForm.safety);
    }
  },

  watch: {
    selectedUpbjj(value) {
      if (!value) {
        this.selectedKategori = "";
        return;
      }
      if (this.selectedKategori && !this.availableCategories.includes(this.selectedKategori)) {
        this.selectedKategori = "";
      }
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

    computeStockStatus(qty, safety) {
      const stock = Number(qty) || 0;
      const minimum = Number(safety) || 0;

      if (stock === 0) {
        return {
          key: "kosong",
          label: "Kosong",
          icon: "\u00d7",
          cssClass: "status-kosong",
          desc: "Stok habis (0 unit), segera lakukan pemesanan ulang."
        };
      }
      if (stock < minimum) {
        return {
          key: "menipis",
          label: "Menipis",
          icon: "!",
          cssClass: "status-menipis",
          desc: `Stok ${stock} unit di bawah safety ${minimum} unit.`
        };
      }
      return {
        key: "aman",
        label: "Aman",
        icon: "\u2713",
        cssClass: "status-aman",
        desc: `Stok ${stock} unit memenuhi safety ${minimum} unit.`
      };
    },

    sanitizeNote(html) {
      if (!html) {
        return "";
      }

      const allowed = new Set(["EM", "STRONG", "U", "I", "B", "BR", "SPAN"]);
      const dropWithContent = new Set([
        "SCRIPT",
        "STYLE",
        "IFRAME",
        "OBJECT",
        "EMBED",
        "SVG",
        "MATH",
        "TEMPLATE",
        "NOSCRIPT",
        "LINK",
        "META"
      ]);
      const template = document.createElement("template");
      template.innerHTML = String(html);

      const comments = [];
      const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_COMMENT);
      while (walker.nextNode()) {
        comments.push(walker.currentNode);
      }
      comments.forEach((node) => node.remove());

      const cleanPass = () => {
        let changed = false;
        template.content.querySelectorAll("*").forEach((element) => {
          if (!allowed.has(element.tagName)) {
            if (dropWithContent.has(element.tagName)) {
              element.remove();
            } else {
              element.replaceWith(...Array.from(element.childNodes));
            }
            changed = true;
            return;
          }
          Array.from(element.attributes).forEach((attribute) => {
            element.removeAttribute(attribute.name);
          });
        });
        return changed;
      };

      let pass = 0;
      while (cleanPass() && pass < 10) {
        pass += 1;
      }

      return template.innerHTML;
    },

    setStatusFilter(status) {
      if (this.statusFilter === status) {
        this.statusFilter = "";
      } else {
        this.statusFilter = status;
        this.onlyReorder = false;
      }
    },

    toggleReorder() {
      this.onlyReorder = !this.onlyReorder;
      if (this.onlyReorder) {
        this.statusFilter = "";
      }
    },

    resetFilters() {
      this.selectedUpbjj = "";
      this.selectedKategori = "";
      this.onlyReorder = false;
      this.statusFilter = "";
      this.searchQuery = "";
      this.sortBy = "judul";
      this.sortOrder = "asc";
      this.showToast("Filter dan pengurutan dikembalikan ke awal.", "info");
    },

    openEditModal(item) {
      const index = this.stokList.findIndex(
        (row) => row.kode === item.kode && row.upbjj === item.upbjj
      );
      if (index === -1) {
        return;
      }

      this.lastFocusedElement = document.activeElement;
      this.editingItemIndex = index;
      this.editForm = {
        kode: item.kode,
        judul: item.judul,
        kategori: item.kategori,
        upbjj: item.upbjj,
        lokasiRak: item.lokasiRak,
        harga: Number(item.harga) || 0,
        qty: Number(item.qty) || 0,
        safety: Number(item.safety) || 0,
        catatanHTML: item.catatanHTML || ""
      };
      this.editErrors = {};
      this.isEditModalOpen = true;
      document.body.style.overflow = "hidden";

      this.$nextTick(() => {
        const field = document.getElementById("edit-qty");
        if (field) {
          field.focus();
          field.select();
        }
      });
    },

    closeEditModal() {
      this.isEditModalOpen = false;
      this.editingItemIndex = -1;
      this.editErrors = {};
      document.body.style.overflow = "";

      const target = this.lastFocusedElement;
      this.lastFocusedElement = null;
      this.$nextTick(() => {
        if (target && typeof target.focus === "function") {
          target.focus();
        }
      });
    },

    adjustEditQty(delta) {
      const current = Number(this.editForm.qty) || 0;
      this.editForm.qty = Math.max(0, current + delta);
    },

    saveStockEdit() {
      const errors = {};
      const editQty = this.editForm.qty;
      const editSafety = this.editForm.safety;

      if (
        editQty === "" ||
        editQty === null ||
        editQty === undefined ||
        !Number.isInteger(Number(editQty)) ||
        Number(editQty) < 0
      ) {
        errors.qty = "Jumlah stok harus bilangan bulat 0 atau lebih.";
      }
      if (
        editSafety === "" ||
        editSafety === null ||
        editSafety === undefined ||
        !Number.isInteger(Number(editSafety)) ||
        Number(editSafety) < 0
      ) {
        errors.safety = "Safety stock harus bilangan bulat 0 atau lebih.";
      }
      if (!this.editForm.lokasiRak || !this.editForm.lokasiRak.trim()) {
        errors.lokasiRak = "Lokasi rak wajib diisi.";
      }

      this.editErrors = errors;
      if (Object.keys(errors).length > 0 || this.editingItemIndex === -1) {
        return;
      }

      const current = this.stokList[this.editingItemIndex];
      const updated = {
        ...current,
        qty: Number(this.editForm.qty),
        safety: Number(this.editForm.safety),
        lokasiRak: this.editForm.lokasiRak.trim().toUpperCase(),
        catatanHTML: this.sanitizeNote(this.editForm.catatanHTML.trim())
      };

      this.stokList.splice(this.editingItemIndex, 1, updated);
      this.showToast(`Stok ${updated.kode} di ${updated.upbjj} berhasil diperbarui.`, "success");
      this.closeEditModal();
    },

    validateNewBahanAjar() {
      const errors = {};
      const form = this.newBahanAjar;
      const kode = form.kode.trim().toUpperCase();

      if (!kode) {
        errors.kode = "Kode mata kuliah wajib diisi.";
      } else if (!/^[A-Z0-9]{4,12}$/.test(kode)) {
        errors.kode = "Gunakan 4 sampai 12 huruf atau angka, tanpa spasi.";
      } else if (
        this.stokList.some(
          (item) => String(item.kode).toUpperCase() === kode && item.upbjj === form.upbjj
        )
      ) {
        errors.kode = "Kode ini sudah terdaftar untuk UT-Daerah tersebut.";
      }

      if (!form.judul.trim()) {
        errors.judul = "Nama mata kuliah wajib diisi.";
      } else if (form.judul.trim().length < 3) {
        errors.judul = "Nama mata kuliah minimal 3 karakter.";
      }

      if (!form.kategori) {
        errors.kategori = "Pilih kategori mata kuliah.";
      }
      if (!form.upbjj) {
        errors.upbjj = "Pilih UT-Daerah.";
      }
      if (!form.lokasiRak.trim()) {
        errors.lokasiRak = "Lokasi rak wajib diisi, misalnya R1-A3.";
      }

      if (
        form.harga === "" ||
        form.harga === null ||
        form.harga === undefined ||
        !Number.isInteger(Number(form.harga)) ||
        Number(form.harga) < 1000
      ) {
        errors.harga = "Harga minimal Rp 1.000 dan berupa bilangan bulat.";
      }
      if (
        form.qty === "" ||
        form.qty === null ||
        form.qty === undefined ||
        !Number.isInteger(Number(form.qty)) ||
        Number(form.qty) < 0
      ) {
        errors.qty = "Jumlah stok harus bilangan bulat 0 atau lebih.";
      }
      if (
        form.safety === "" ||
        form.safety === null ||
        form.safety === undefined ||
        !Number.isInteger(Number(form.safety)) ||
        Number(form.safety) < 0
      ) {
        errors.safety = "Safety stock harus bilangan bulat 0 atau lebih.";
      }
      if (form.catatanHTML.length > 200) {
        errors.catatanHTML = "Catatan maksimal 200 karakter.";
      }

      this.formErrors = errors;
      return Object.keys(errors).length === 0;
    },

    submitNewBahanAjar() {
      if (!this.validateNewBahanAjar()) {
        this.showToast("Periksa kembali kolom yang ditandai merah.", "danger");
        return;
      }

      const form = this.newBahanAjar;
      const newItem = {
        kode: form.kode.trim().toUpperCase(),
        judul: form.judul.trim(),
        kategori: form.kategori,
        upbjj: form.upbjj,
        lokasiRak: form.lokasiRak.trim().toUpperCase(),
        harga: Number(form.harga),
        qty: Number(form.qty),
        safety: Number(form.safety),
        catatanHTML: this.sanitizeNote(form.catatanHTML.trim())
      };

      this.stokList.unshift(newItem);
      this.showToast(
        `${newItem.kode} ${newItem.judul} ditambahkan ke inventaris ${newItem.upbjj}.`,
        "success"
      );
      this.resetNewBahanAjarForm();
    },

    resetNewBahanAjarForm() {
      this.newBahanAjar = {
        kode: "",
        judul: "",
        kategori: "",
        upbjj: "",
        lokasiRak: "",
        harga: null,
        qty: null,
        safety: null,
        catatanHTML: ""
      };
      this.formErrors = {};
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
    },

    scrollToForm() {
      const section = document.getElementById("form-tambah-section");
      if (!section) {
        return;
      }
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      section.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
    }
  },

  mounted() {
    this.onKeydown = (event) => {
      if (event.key === "Escape" && this.isEditModalOpen) {
        this.closeEditModal();
      }
    };
    window.addEventListener("keydown", this.onKeydown);
  },

  beforeUnmount() {
    window.removeEventListener("keydown", this.onKeydown);
    window.clearTimeout(this.toastTimer);
    document.body.style.overflow = "";
  }
}).mount("#app");
