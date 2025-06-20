# 💬 Gemini Chatbot API

Proyek ini adalah implementasi chatbot menggunakan **Gemini API** yang dibangun dengan **HTML**, **CSS**, **Vanilla JavaScript**, dan backend **Node.js (Express.js)**. Proyek ini memungkinkan pengguna untuk berinteraksi dengan model AI melalui antarmuka web yang sederhana.

---

## 🚀 Fitur

* Chatbot interaktif berbasis Gemini API
* Frontend minimalis dengan HTML, CSS, dan JavaScript murni
* Backend menggunakan Express untuk menangani permintaan API
* Konfigurasi API key menggunakan `.env`
* Mudah dijalankan secara lokal

---

## 🧰 Teknologi yang Digunakan

* Frontend: HTML, CSS, Vanilla JavaScript
* Backend: Node.js, Express.js
* Lainnya: dotenv, Gemini API

---

## 📦 Instalasi

1. **Clone repositori ini:**

```bash
git clone https://github.com/annisaayu/gemini-chatbot-api.git
cd gemini-chatbot
```

2. **Buat file `.env` dan tambahkan API key Gemini anda:**

```env
GEMINI_API_KEY=masukkan_api_key_anda_di_sini
```

3. **Install dependensi:**

```bash
npm install
```

4. **Jalankan server:**

```bash
node index.js
```

5. **Buka di browser:**

Buka `http://localhost:3000` untuk menggunakan chatbot.

---

## 🔌 Endpoint API

* **POST** `/api/chat`
  Digunakan untuk mengirim prompt dari frontend dan menerima respon dari Gemini API.

**Contoh request body:**

```json
{
  "message": "Halo, apa kabar?"
}
```

**Contoh response:**

```json
{
  "response": "Hai! Aku baik, bagaimana denganmu?"
}
```

---

## 📁 Struktur Proyek

```bash
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── index.js
├── .env
├── package.json
└── README.md
```

---

## ⚠️ Catatan

* Pastikan API Key Gemini anda valid dan tidak dibagikan secara publik.
* Untuk keperluan produksi, pertimbangkan menggunakan framework frontend dan sistem deployment yang lebih aman.

---

