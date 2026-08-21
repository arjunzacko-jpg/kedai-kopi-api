import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Coffee,
  Plus,
  Minus,
  Send,
  Clock,
  MapPin,
  X,
  Receipt as ReceiptIcon,
} from "lucide-react";

const CATEGORIES = [
  "Semua",
  "Kopi Susu",
  "Kopi Hitam",
  "Non-Kopi",
  "Camilan",
];

const API_URL = "http://127.0.0.1:8000/api/products";
const WA_NUMBER = "6283120482413";

function rupiah(n) {
  return "Rp" + Number(n || 0).toLocaleString("id-ID");
}

function CafeApp() {
  const [activeCat, setActiveCat] = useState("Semua");

  const [menu, setMenu] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [cart, setCart] = useState({});

  const [note, setNote] = useState("");

  const [customer, setCustomer] = useState("");

  const [cartOpen, setCartOpen] = useState(false);

  // =========================================================
  // AMBIL DATA PRODUK DARI LARAVEL API
  // =========================================================

 useEffect(() => {
  fetch("/api/products")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Gagal mengambil produk.");
      }

      return response.json();
    })
    .then((data) => {
      setMenu(data);
      setLoading(false);
    })
    .catch((error) => {
      console.error(error);
      setError(error.message);
      setLoading(false);
    });
}, []);

  // =========================================================
  // FILTER KATEGORI
  // =========================================================

 const filtered =
  activeCat === "Semua"
    ? menu
    : menu.filter(
        (item) => item.category === activeCat
      );

  // =========================================================
  // DATA CART
  // =========================================================

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const item = menu.find(
          (menuItem) => menuItem.id === Number(id)
        );

        if (!item) {
          return null;
        }

        return {
          ...item,
          qty,
        };
      })
      .filter(Boolean);
  }, [cart, menu]);

  // =========================================================
  // TOTAL
  // =========================================================

  const total = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.qty,
    0
  );

  const itemCount = cartItems.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  // =========================================================
  // TAMBAH PRODUK
  // =========================================================

  function addItem(id) {
    const product = menu.find(
      (item) => item.id === id
    );

    if (!product) {
      return;
    }

    setCart((current) => {
      const currentQty = current[id] || 0;

      // Tidak boleh melebihi stok database
      if (currentQty >= product.stock) {
        return current;
      }

      return {
        ...current,
        [id]: currentQty + 1,
      };
    });
  }

  // =========================================================
  // KURANGI PRODUK
  // =========================================================

  function removeItem(id) {
    setCart((current) => {
      const currentQty = current[id] || 0;

      const newQty = Math.max(
        0,
        currentQty - 1
      );

      return {
        ...current,
        [id]: newQty,
      };
    });
  }

  // =========================================================
  // PESAN VIA WHATSAPP
  // =========================================================

async function sendOrder() {
  if (cartItems.length === 0) {
    alert("Keranjang masih kosong.");
    return;
  }

  if (!customer.trim()) {
    alert("Silakan isi nama pemesan.");
    return;
  }

  try {
    const response = await fetch("/api/transactions", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },

      body: JSON.stringify({
        customer_name: customer.trim(),

        note: note.trim() || null,

        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.qty,
        })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Gagal membuat pesanan."
      );
    }

    alert(
      `Pesanan berhasil dibuat!\nNomor transaksi: #${data.transaction.id}`
    );

    // Buat pesan WhatsApp
    const lines = [
      "*Pesanan baru - KOPDAR KEUN BARUDAX*",
      "",
    ];

    cartItems.forEach((item) => {
      lines.push(
        `${item.qty}x ${item.name} = ${rupiah(
          item.price * item.qty
        )}`
      );
    });

    lines.push("");
    lines.push(`Total: ${rupiah(total)}`);
    lines.push(`Atas nama: ${customer.trim()}`);

    if (note.trim()) {
      lines.push(`Catatan: ${note.trim()}`);
    }

    const text = encodeURIComponent(
      lines.join("\n")
    );

    window.open(
      `https://wa.me/${WA_NUMBER}?text=${text}`,
      "_blank"
    );

    // Kosongkan keranjang
    setCart({});
    setCustomer("");
    setNote("");
    setCartOpen(false);

  } catch (error) {
    console.error("ERROR:", error);

    alert(
      "Pesanan gagal disimpan.\n\n" +
      error.message
    );
  }
}

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="loading-screen">
        <Coffee
          size={40}
          color="#C89B3C"
        />

        <h2>Memuat menu...</h2>

        <p>
          Mengambil data dari database.
        </p>

        <style>{`
          .loading-screen {
            min-height: 100vh;
            background: #241811;
            color: #F5EFE6;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: 'DM Sans', sans-serif;
          }

          .loading-screen h2 {
            margin: 15px 0 5px;
          }

          .loading-screen p {
            color: rgba(245,239,230,0.6);
          }
        `}</style>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="error-screen">
        <Coffee
          size={40}
          color="#C89B3C"
        />

        <h2>Gagal memuat menu</h2>

        <p>{error}</p>

        <p className="error-help">
          Pastikan Laravel sedang berjalan
          dengan:
        </p>

        <code>
          php artisan serve
        </code>

        <button
          onClick={() =>
            window.location.reload()
          }
        >
          Coba Lagi
        </button>

        <style>{`
          .error-screen {
            min-height: 100vh;
            background: #241811;
            color: #F5EFE6;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: 'DM Sans', sans-serif;
            padding: 20px;
            text-align: center;
          }

          .error-screen h2 {
            margin-bottom: 8px;
          }

          .error-screen p {
            color: rgba(245,239,230,0.7);
          }

          .error-help {
            margin-bottom: 5px;
          }

          .error-screen code {
            background: #17100b;
            padding: 10px 15px;
            border-radius: 5px;
            color: #C89B3C;
            margin-bottom: 20px;
          }

          .error-screen button {
            background: #C89B3C;
            border: none;
            padding: 10px 18px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
          }
        `}</style>
      </div>
    );
  }

  // =========================================================
  // TAMPILAN UTAMA
  // =========================================================

  return (
    <div className="app-root">

      <style>{`

        @import url(
          'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap'
        );

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          padding: 0;
        }

        button,
        input {
          font-family: inherit;
        }

        .app-root {

          --bg-dark: #241811;

          --bg-darker: #17100b;

          --paper: #EDE4D3;

          --gold: #C89B3C;

          --rust: #8B3A2B;

          --rust-bright: #A8452F;

          --cream: #F5EFE6;

          --ink: #241510;

          font-family:
            'DM Sans',
            sans-serif;

          background:
            var(--bg-dark);

          color:
            var(--cream);

          min-height:
            100vh;
        }

        .display {

          font-family:
            'Bebas Neue',
            sans-serif;

          letter-spacing:
            0.04em;
        }

        .mono {

          font-family:
            'Space Mono',
            monospace;
        }

        .dotted-leader {

          flex: 1;

          border-bottom:
            1.5px dotted
            rgba(36,21,16,0.35);

          margin:
            0 6px 5px;

          min-width:
            12px;
        }

        .receipt-tear::before,
        .receipt-tear::after {

          content: "";

          display: block;

          height: 12px;

          background-image:
            radial-gradient(
              circle at 6px 6px,
              var(--bg-dark) 6px,
              transparent 7px
            );

          background-size:
            12px 12px;

          background-repeat:
            repeat-x;
        }

        .receipt-tear::before {

          margin-bottom:
            -1px;
        }

        .receipt-tear::after {

          transform:
            scaleY(-1);

          margin-top:
            -1px;
        }

        .cat-tab {

          font-family:
            'DM Sans',
            sans-serif;

          font-weight:
            500;

          padding:
            8px 16px;

          border-radius:
            999px;

          border:
            1.5px solid
            rgba(245,239,230,0.25);

          background:
            transparent;

          color:
            var(--cream);

          cursor:
            pointer;

          white-space:
            nowrap;

          font-size:
            14px;

          transition:
            all 0.15s ease;
        }

        .cat-tab:hover {

          border-color:
            var(--gold);
        }

        .cat-tab.active {

          background:
            var(--gold);

          border-color:
            var(--gold);

          color:
            var(--ink);
        }

        .menu-card {

          background:
            var(--paper);

          border-radius:
            4px;

          padding:
            16px 18px;

          position:
            relative;

          box-shadow:
            2px 3px 0
            rgba(0,0,0,0.25);

          min-height:
            145px;
        }

        .menu-card::after {

          content: "";

          position:
            absolute;

          left:
            10px;

          right:
            10px;

          bottom:
            6px;

          border-bottom:
            1px dashed
            rgba(36,21,16,0.2);
        }

        .qty-btn {

          width:
            26px;

          height:
            26px;

          border-radius:
            50%;

          border:
            1.5px solid
            var(--ink);

          background:
            transparent;

          color:
            var(--ink);

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          cursor:
            pointer;

          transition:
            0.15s;
        }

        .qty-btn:hover {

          background:
            var(--ink);

          color:
            var(--paper);
        }

        .cta-btn {

          background:
            var(--rust);

          color:
            var(--cream);

          font-weight:
            700;

          border:
            none;

          border-radius:
            4px;

          padding:
            12px 20px;

          cursor:
            pointer;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          gap:
            8px;

          transition:
            background 0.15s ease;
        }

        .cta-btn:hover {

          background:
            var(--rust-bright);
        }

        .cta-btn:disabled {

          opacity:
            0.4;

          cursor:
            not-allowed;
        }

        .receipt-input {

          width:
            100%;

          background:
            transparent;

          border:
            none;

          border-bottom:
            1.5px dotted
            rgba(36,21,16,0.35);

          font-family:
            'Space Mono',
            monospace;

          font-size:
            13px;

          color:
            var(--ink);

          padding:
            4px 2px;

          outline:
            none;
        }

        .receipt-input::placeholder {

          color:
            rgba(36,21,16,0.45);
        }

        .cart-drawer {

          position:
            fixed;

          left:
            0;

          right:
            0;

          bottom:
            0;

          transform:
            translateY(100%);

          transition:
            transform 0.28s ease;

          z-index:
            40;

          max-height:
            85vh;

          overflow-y:
            auto;
        }

        .cart-drawer.open {

          transform:
            translateY(0);
        }

        @media (min-width: 900px) {

          .cart-drawer {

            position:
              static;

            transform:
              none;

            max-height:
              none;

            overflow:
              visible;

            background:
              transparent !important;
          }

          .main-grid {

            grid-template-columns:
              1fr 380px !important;

            align-items:
              start;
          }

          .mobile-close {

            display:
              none;
          }
        }

        @media (max-width: 899px) {

          .cart-drawer:not(.open) {

            display:
              none;
          }
        }

      `}</style>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "var(--bg-darker)",
          borderBottom:
            "1px solid rgba(245,239,230,0.1)",
        }}
      >

        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >

            <Coffee
              size={24}
              color="var(--gold)"
            />

            <span
              className="display"
              style={{
                fontSize: 26,
                lineHeight: 1,
              }}
            >
              KOPDAR KEUN BARUDAX
            </span>

          </div>

          <button
            onClick={() =>
              setCartOpen(true)
            }
            style={{
              background:
                "var(--gold)",

              border:
                "none",

              borderRadius:
                999,

              padding:
                "8px 14px",

              display:
                "flex",

              alignItems:
                "center",

              gap:
                8,

              cursor:
                "pointer",

              color:
                "var(--ink)",

              fontWeight:
                700,
            }}
          >

            <ReceiptIcon size={16} />

            <span
              className="mono"
              style={{
                fontSize: 13,
              }}
            >
              {itemCount} · {rupiah(total)}
            </span>

          </button>

        </div>

      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        style={{
          padding:
            "56px 20px 40px",

          textAlign:
            "center",

          borderBottom:
            "1px solid rgba(245,239,230,0.08)",
        }}
      >

        <p
          className="mono"
          style={{
            color:
              "var(--gold)",

            fontSize:
              13,

            letterSpacing:
              "0.15em",

            marginBottom:
              10,
          }}
        >
          PARANTOS NGOPI TI OROK
        </p>

        <h1
          className="display"
          style={{
            fontSize:
              "clamp(40px, 8vw, 76px)",

            margin:
              "0 0 14px",

            lineHeight:
              0.95,
          }}
        >
          NGOPI NYALSE
          <br />
          HARGA TEU HESE
        </h1>

        <p
          style={{
            maxWidth:
              480,

            margin:
              "0 auto",

            color:
              "rgba(245,239,230,0.75)",

            fontSize:
              15,

            lineHeight:
              1.6,
          }}
        >
          Racikan kopi nusantara dari biji
          pilihan petani lokal. Pesan
          langsung dari sini, kami siapkan,
          tinggal ambil atau kami antar.
        </p>

      </section>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div
        style={{
          maxWidth:
            1100,

          margin:
            "0 auto",

          padding:
            "32px 20px 120px",
        }}
      >

        <div
          className="main-grid"
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "1fr",

            gap:
              32,
          }}
        >

          {/* =================================================
              MENU AREA
          ================================================= */}

          <div>

            <div
              style={{
                display:
                  "flex",

                gap:
                  8,

                overflowX:
                  "auto",

                paddingBottom:
                  8,

                marginBottom:
                  20,
              }}
            >

              {CATEGORIES.map(
                (category) => (

                  <button
                    key={category}
                    className={
                      `cat-tab ${
                        activeCat === category
                          ? "active"
                          : ""
                      }`
                    }
                    onClick={() =>
                      setActiveCat(
                        category
                      )
                    }
                  >
                    {category}
                  </button>

                )
              )}

            </div>

            <div
              style={{
                display:
                  "grid",

                gridTemplateColumns:
                  "repeat(auto-fill, minmax(240px, 1fr))",

                gap:
                  14,
              }}
            >

              {filtered.length === 0 ? (

                <div
                  style={{
                    color:
                      "rgba(245,239,230,0.6)",

                    padding:
                      20,
                  }}
                >
                  Tidak ada menu
                  pada kategori ini.
                </div>

              ) : (

                filtered.map(
                  (item) => {

                    const qty =
                      cart[item.id] || 0;

                    const stockHabis =
                      Number(item.stock) <= 0;

                    const stokMaksimal =
                      qty >=
                      Number(item.stock);

                    return (

                      <div
                        key={item.id}
                        className="menu-card"
                      >

                        <p
                          style={{
                            color:
                              "var(--ink)",

                            fontWeight:
                              700,

                            fontSize:
                              15,

                            margin:
                              "0 0 4px",
                          }}
                        >
                          {item.name}
                        </p>

                        <p
                          style={{
                            color:
                              "rgba(36,21,16,0.65)",

                            fontSize:
                              12.5,

                            margin:
                              "0 0 8px",

                            lineHeight:
                              1.4,

                            minHeight:
                              32,
                          }}
                        >
                          {item.description}
                        </p>

                        <p
                          className="mono"
                          style={{
                            color:
                              "rgba(36,21,16,0.55)",

                            fontSize:
                              10.5,

                            margin:
                              "0 0 12px",
                          }}
                        >
                          Stok:{" "}
                          {item.stock}
                        </p>

                        <div
                          style={{
                            display:
                              "flex",

                            alignItems:
                              "center",

                            justifyContent:
                              "space-between",
                          }}
                        >

                          <span
                            className="mono"
                            style={{
                              color:
                                "var(--rust)",

                              fontWeight:
                                700,

                              fontSize:
                                14,
                            }}
                          >
                            {rupiah(
                              item.price
                            )}
                          </span>

                          {stockHabis ? (

                            <span
                              style={{
                                color:
                                  "var(--rust)",

                                fontWeight:
                                  700,

                                fontSize:
                                  12,
                              }}
                            >
                              HABIS
                            </span>

                          ) : qty === 0 ? (

                            <button
                              className="qty-btn"
                              style={{
                                width:
                                  "auto",

                                borderRadius:
                                  4,

                                padding:
                                  "5px 12px",

                                fontSize:
                                  13,

                                fontWeight:
                                  700,
                              }}
                              onClick={() =>
                                addItem(
                                  item.id
                                )
                              }
                            >
                              + Tambah
                            </button>

                          ) : (

                            <div
                              style={{
                                display:
                                  "flex",

                                alignItems:
                                  "center",

                                gap:
                                  8,
                              }}
                            >

                              <button
                                className="qty-btn"
                                onClick={() =>
                                  removeItem(
                                    item.id
                                  )
                                }
                                aria-label="Kurangi"
                              >
                                <Minus
                                  size={14}
                                />
                              </button>

                              <span
                                className="mono"
                                style={{
                                  color:
                                    "var(--ink)",

                                  fontWeight:
                                    700,

                                  minWidth:
                                    14,

                                  textAlign:
                                    "center",
                                }}
                              >
                                {qty}
                              </span>

                              <button
                                className="qty-btn"
                                onClick={() =>
                                  addItem(
                                    item.id
                                  )
                                }
                                disabled={
                                  stokMaksimal
                                }
                                aria-label="Tambah"
                                style={{
                                  opacity:
                                    stokMaksimal
                                      ? 0.4
                                      : 1,
                                }}
                              >
                                <Plus
                                  size={14}
                                />
                              </button>

                            </div>

                          )}

                        </div>

                      </div>

                    );
                  }
                )

              )}

            </div>

          </div>

          {/* =================================================
              CART
          ================================================= */}

          <div
            className={
              `cart-drawer ${
                cartOpen ? "open" : ""
              }`
            }
            style={{
              background:
                "rgba(0,0,0,0.5)",
            }}
          >

            <div
              style={{
                maxWidth:
                  1100,

                margin:
                  "0 auto",

                padding:
                  "0 20px 40px",

                display:
                  "flex",

                justifyContent:
                  "flex-end",
              }}
            >

              <div
                style={{
                  width:
                    "100%",

                  maxWidth:
                    380,
                }}
              >

                <div
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",

                    padding:
                      "16px 4px",
                  }}
                >

                  <span
                    className="display"
                    style={{
                      fontSize:
                        22,

                      color:
                        "var(--cream)",
                    }}
                  >
                    PESANAN ANDA
                  </span>

                  <button
                    onClick={() =>
                      setCartOpen(false)
                    }
                    className="mobile-close"
                    style={{
                      background:
                        "transparent",

                      border:
                        "none",

                      color:
                        "var(--cream)",

                      cursor:
                        "pointer",
                    }}
                    aria-label="Tutup"
                  >
                    <X size={22} />
                  </button>

                </div>

                <div className="receipt-tear" />

                <div
                  style={{
                    background:
                      "var(--paper)",

                    padding:
                      "18px 20px",
                  }}
                >

                  <div
                    style={{
                      textAlign:
                        "center",

                      marginBottom:
                        14,
                    }}
                  >

                    <p
                      className="display"
                      style={{
                        color:
                          "var(--ink)",

                        fontSize:
                          20,

                        margin:
                          0,
                      }}
                    >
                      KEDAI KOPI SEROJA
                    </p>

                    <p
                      className="mono"
                      style={{
                        color:
                          "rgba(36,21,16,0.6)",

                        fontSize:
                          11,

                        margin:
                          "2px 0 0",
                      }}
                    >
                      Jl. Melati No. 12,
                      Tangerang
                    </p>

                  </div>

                  {cartItems.length === 0 ? (

                    <p
                      className="mono"
                      style={{
                        color:
                          "rgba(36,21,16,0.55)",

                        fontSize:
                          13,

                        textAlign:
                          "center",

                        padding:
                          "20px 0",
                      }}
                    >
                      Keranjang masih
                      kosong.
                      <br />
                      Yuk pilih menu
                      dulu.
                    </p>

                  ) : (

                    <div
                      style={{
                        marginBottom:
                          12,
                      }}
                    >

                      {cartItems.map(
                        (item) => (

                          <div
                            key={item.id}
                            style={{
                              marginBottom:
                                10,
                            }}
                          >

                            <div
                              style={{
                                display:
                                  "flex",

                                alignItems:
                                  "baseline",
                              }}
                            >

                              <span
                                className="mono"
                                style={{
                                  color:
                                    "var(--ink)",

                                  fontSize:
                                    12.5,
                                }}
                              >
                                {item.qty}x{" "}
                                {item.name}
                              </span>

                              <span className="dotted-leader" />

                              <span
                                className="mono"
                                style={{
                                  color:
                                    "var(--ink)",

                                  fontSize:
                                    12.5,
                                }}
                              >
                                {rupiah(
                                  Number(
                                    item.price
                                  ) *
                                    item.qty
                                )}
                              </span>

                            </div>

                            <div
                              style={{
                                display:
                                  "flex",

                                alignItems:
                                  "center",

                                gap:
                                  6,

                                marginTop:
                                  4,
                              }}
                            >

                              <button
                                className="qty-btn"
                                style={{
                                  width:
                                    20,

                                  height:
                                    20,
                                }}
                                onClick={() =>
                                  removeItem(
                                    item.id
                                  )
                                }
                              >
                                <Minus
                                  size={11}
                                />
                              </button>

                              <button
                                className="qty-btn"
                                style={{
                                  width:
                                    20,

                                  height:
                                    20,
                                }}
                                onClick={() =>
                                  addItem(
                                    item.id
                                  )
                                }
                                disabled={
                                  item.qty >=
                                  Number(
                                    item.stock
                                  )
                                }
                              >
                                <Plus
                                  size={11}
                                />
                              </button>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  )}

                  <div
                    style={{
                      borderTop:
                        "1.5px dashed rgba(36,21,16,0.3)",

                      paddingTop:
                        10,

                      marginBottom:
                        14,
                    }}
                  >

                    <div
                      style={{
                        display:
                          "flex",

                        alignItems:
                          "baseline",
                      }}
                    >

                      <span
                        className="mono"
                        style={{
                          color:
                            "var(--ink)",

                          fontWeight:
                            700,

                          fontSize:
                            14,
                        }}
                      >
                        TOTAL
                      </span>

                      <span className="dotted-leader" />

                      <span
                        className="mono"
                        style={{
                          color:
                            "var(--rust)",

                          fontWeight:
                            700,

                          fontSize:
                            15,
                        }}
                      >
                        {rupiah(total)}
                      </span>

                    </div>

                  </div>

                  <input
                    className="receipt-input"
                    placeholder="Nama pemesan"
                    value={
                      customer
                    }
                    onChange={(event) =>
                      setCustomer(
                        event.target.value
                      )
                    }
                    style={{
                      marginBottom:
                        8,
                    }}
                  />

                  <input
                    className="receipt-input"
                    placeholder="Catatan (opsional): tanpa gula, dsb"
                    value={
                      note
                    }
                    onChange={(event) =>
                      setNote(
                        event.target.value
                      )
                    }
                  />

                </div>

                <div className="receipt-tear" />

                <button
                  className="cta-btn"
                  style={{
                    width:
                      "100%",

                    marginTop:
                      16,
                  }}
                  onClick={
                    sendOrder
                  }
                  disabled={
                    cartItems.length ===
                    0
                  }
                >
                  <Send size={16} />
                  Pesan via WhatsApp
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        style={{
          borderTop:
            "1px solid rgba(245,239,230,0.1)",

          padding:
            "28px 20px",
        }}
      >

        <div
          style={{
            maxWidth:
              1100,

            margin:
              "0 auto",

            display:
              "flex",

            flexWrap:
              "wrap",

            gap:
              20,

            justifyContent:
              "space-between",

            alignItems:
              "flex-start",
          }}
        >

          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                8,

              color:
                "rgba(245,239,230,0.7)",

              fontSize:
                13,
            }}
          >

            <MapPin size={15} />

            Jl. Melati No. 12,
            Tangerang, Banten

          </div>

          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                8,

              color:
                "rgba(245,239,230,0.7)",

              fontSize:
                13,
            }}
          >

            <Clock size={15} />

            Setiap hari,
            08.00 - 22.00

          </div>

        </div>

        <p
          className="mono"
          style={{
            textAlign:
              "center",

            color:
              "rgba(245,239,230,0.35)",

            fontSize:
              11,

            marginTop:
              20,
          }}
        >
          Kedai Kopi Seroja · UMKM
          Binaan Lokal · Data menu
          berasal dari database.
        </p>

      </footer>

    </div>
  );
}

// =========================================================
// REACT ROOT
// =========================================================

const rootElement =
  document.getElementById("app");

if (rootElement) {
  createRoot(rootElement).render(
    <CafeApp />
  );
}
