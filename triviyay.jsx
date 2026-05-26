import React, { useEffect, useMemo, useRef, useState } from "react";
import "./style.css";
import { playSFX, startMusic, stopMusic } from "./audio.js";

const QUESTION_COUNT = 10;

const GENRES = [
  { id: "general", label: "Random", icon: "?" },
  { id: "science", label: "Science", icon: "i" },
  { id: "history", label: "History", icon: "#" },
  { id: "culture", label: "Pop Culture", icon: "*" },
  { id: "geography", label: "Geography", icon: "@" },
  { id: "sports", label: "Sports", icon: "!" },
  { id: "tech", label: "Tech", icon: "+" },
  { id: "food", label: "Food", icon: "%" },
  { id: "indonesia", label: "Indonesia", icon: "=" },
  { id: "animals", label: "Animals", icon: "&" },
];

const DIFFICULTIES = [
  { id: "easy", label: "Santai", seconds: 18, points: 100 },
  { id: "normal", label: "Normal", seconds: 14, points: 140 },
  { id: "hard", label: "Ngebut", seconds: 10, points: 190 },
];

const COLORS = ["#5b8a6a", "#f2b83f", "#e67e52", "#8aa3e2", "#1e291f", "#faf0e3"];

const DEFAULT_MASCOTS = [
  { id: "brain", name: "Brainy", src: "/mascots/brain-buddy.svg", fallback: "B" },
  { id: "yay", name: "Yay", src: "/mascots/mascot-1.png", fallback: "Y" },
  { id: "pop", name: "Pop", src: "/mascots/mascot-2.png", fallback: "P" },
  { id: "zap", name: "Zap", src: "/mascots/mascot-3.png", fallback: "Z" },
];

const QUESTIONS = {
  general: [
    { q: "Planet mana yang dikenal sebagai Planet Merah?", options: ["Mars", "Venus", "Jupiter", "Saturnus"], answer: 0 },
    { q: "Berapa jumlah sisi pada segitiga?", options: ["2", "3", "4", "5"], answer: 1 },
    { q: "Benua terbesar di dunia adalah...", options: ["Afrika", "Eropa", "Asia", "Australia"], answer: 2 },
    { q: "Alat untuk mengukur suhu disebut...", options: ["Barometer", "Termometer", "Kompas", "Meteran"], answer: 1 },
    { q: "Warna hasil campuran merah dan kuning adalah...", options: ["Hijau", "Ungu", "Oranye", "Biru"], answer: 2 },
    { q: "Hewan tercepat di darat adalah...", options: ["Cheetah", "Kuda", "Singa", "Rusa"], answer: 0 },
    { q: "Mata uang Jepang adalah...", options: ["Won", "Yen", "Dollar", "Peso"], answer: 1 },
    { q: "Air membeku pada suhu...", options: ["0 C", "10 C", "50 C", "100 C"], answer: 0 },
    { q: "Ibu kota Indonesia adalah...", options: ["Bandung", "Jakarta", "Surabaya", "Medan"], answer: 1 },
    { q: "Lambang negara Indonesia adalah...", options: ["Garuda", "Elang", "Harimau", "Merpati"], answer: 0 },
    { q: "Jumlah hari dalam satu minggu adalah...", options: ["5", "6", "7", "8"], answer: 2 },
    { q: "Arah matahari terbit adalah...", options: ["Barat", "Timur", "Utara", "Selatan"], answer: 1 },
    { q: "Bahasa resmi di Indonesia adalah...", options: ["Bahasa Indonesia", "Bahasa Inggris", "Bahasa Jepang", "Bahasa Latin"], answer: 0 },
    { q: "Simbol kimia emas adalah...", options: ["Ag", "Au", "Fe", "Cu"], answer: 1 },
    { q: "Jumlah bulan dalam satu tahun adalah...", options: ["10", "11", "12", "13"], answer: 2 },
    { q: "Hasil dari 9 x 3 adalah...", options: ["18", "21", "27", "30"], answer: 2 },
    { q: "Benda yang digunakan untuk melihat waktu adalah...", options: ["Jam", "Kompas", "Kamera", "Radio"], answer: 0 },
    { q: "Lawan kata dari besar adalah...", options: ["Kecil", "Panjang", "Tinggi", "Berat"], answer: 0 },
    { q: "Hari setelah Jumat adalah...", options: ["Kamis", "Sabtu", "Minggu", "Senin"], answer: 1 },
    { q: "Buah yang identik berwarna kuning dan panjang adalah...", options: ["Pisang", "Apel", "Anggur", "Semangka"], answer: 0 },
  ],
  science: [
    { q: "Gas yang paling banyak ada di atmosfer Bumi adalah...", options: ["Oksigen", "Nitrogen", "Karbon dioksida", "Helium"], answer: 1 },
    { q: "Pusat tata surya kita adalah...", options: ["Bumi", "Bulan", "Matahari", "Mars"], answer: 2 },
    { q: "Bagian tumbuhan yang menyerap air dari tanah adalah...", options: ["Daun", "Akar", "Bunga", "Buah"], answer: 1 },
    { q: "Satuan arus listrik adalah...", options: ["Volt", "Watt", "Ampere", "Ohm"], answer: 2 },
    { q: "Proses tumbuhan membuat makanan sendiri disebut...", options: ["Respirasi", "Fotosintesis", "Evaporasi", "Fermentasi"], answer: 1 },
    { q: "Organ manusia yang memompa darah adalah...", options: ["Paru-paru", "Jantung", "Ginjal", "Lambung"], answer: 1 },
    { q: "H2O adalah rumus kimia untuk...", options: ["Garam", "Air", "Oksigen", "Gula"], answer: 1 },
    { q: "Gaya yang menarik benda ke pusat Bumi disebut...", options: ["Gesek", "Magnet", "Gravitasi", "Tekanan"], answer: 2 },
    { q: "Indra manusia untuk mendengar adalah...", options: ["Mata", "Telinga", "Hidung", "Kulit"], answer: 1 },
    { q: "Benda langit yang mengelilingi planet disebut...", options: ["Satelit", "Meteor", "Komet", "Asteroid"], answer: 0 },
    { q: "Planet terbesar di tata surya adalah...", options: ["Bumi", "Jupiter", "Merkurius", "Venus"], answer: 1 },
    { q: "Sel darah merah berfungsi membawa...", options: ["Oksigen", "Pasir", "Minyak", "Cahaya"], answer: 0 },
    { q: "Alat optik untuk melihat benda sangat kecil adalah...", options: ["Mikroskop", "Teleskop", "Periskop", "Kaleidoskop"], answer: 0 },
    { q: "Perubahan cair menjadi gas disebut...", options: ["Membeku", "Menguap", "Mencair", "Mengembun"], answer: 1 },
    { q: "Sumber energi utama bagi Bumi adalah...", options: ["Matahari", "Bulan", "Bintang jatuh", "Awan"], answer: 0 },
    { q: "Tulang melindungi organ dan membentuk...", options: ["Rangka", "Darah", "Kulit", "Rambut"], answer: 0 },
    { q: "Bunyi tidak dapat merambat di ruang...", options: ["Hampa", "Air", "Udara", "Logam"], answer: 0 },
    { q: "Zat yang memiliki volume tetap tetapi bentuk berubah adalah...", options: ["Cair", "Padat", "Gas", "Plasma"], answer: 0 },
    { q: "Planet yang memiliki cincin paling terkenal adalah...", options: ["Saturnus", "Mars", "Bumi", "Merkurius"], answer: 0 },
    { q: "Bagian mata yang membantu melihat cahaya adalah...", options: ["Retina", "Gigi", "Paru", "Lidah"], answer: 0 },
  ],
  history: [
    { q: "Indonesia memproklamasikan kemerdekaan pada tahun...", options: ["1942", "1945", "1950", "1965"], answer: 1 },
    { q: "Candi Borobudur berada di provinsi...", options: ["Jawa Tengah", "Bali", "Jawa Barat", "Sumatra Barat"], answer: 0 },
    { q: "Tokoh yang dikenal sebagai Bapak Proklamator Indonesia adalah...", options: ["Soekarno", "Ki Hajar Dewantara", "Sudirman", "Hatta saja"], answer: 0 },
    { q: "Kerajaan Majapahit terkenal dari wilayah...", options: ["Jawa Timur", "Kalimantan", "Sulawesi", "Papua"], answer: 0 },
    { q: "Sumpah Pemuda terjadi pada tanggal...", options: ["17 Agustus 1945", "28 Oktober 1928", "1 Juni 1945", "10 November 1945"], answer: 1 },
    { q: "Hari Pahlawan diperingati setiap...", options: ["10 November", "21 April", "2 Mei", "1 Oktober"], answer: 0 },
    { q: "Tokoh pendidikan Indonesia adalah...", options: ["Ki Hajar Dewantara", "Cut Nyak Dien", "Pattimura", "Gajah Mada"], answer: 0 },
    { q: "Pancasila memiliki jumlah sila sebanyak...", options: ["3", "4", "5", "6"], answer: 2 },
    { q: "R.A. Kartini dikenal sebagai tokoh...", options: ["Emansipasi wanita", "Olahraga", "Musik", "Teknologi"], answer: 0 },
    { q: "Bendera Indonesia berwarna...", options: ["Merah Putih", "Biru Putih", "Hijau Kuning", "Merah Hitam"], answer: 0 },
    { q: "Hari Lahir Pancasila diperingati pada...", options: ["1 Juni", "17 Agustus", "28 Oktober", "10 November"], answer: 0 },
    { q: "Peristiwa Bandung Lautan Api terjadi di kota...", options: ["Bandung", "Surabaya", "Medan", "Denpasar"], answer: 0 },
    { q: "VOC adalah kongsi dagang dari...", options: ["Belanda", "Spanyol", "Jepang", "Portugal"], answer: 0 },
    { q: "Cut Nyak Dien adalah pahlawan dari...", options: ["Aceh", "Bali", "Papua", "Jawa Barat"], answer: 0 },
    { q: "Gajah Mada terkenal dengan sumpah...", options: ["Palapa", "Pemuda", "Prajurit", "Garuda"], answer: 0 },
    { q: "Kerajaan Sriwijaya terkenal sebagai kerajaan...", options: ["Maritim", "Gurun", "Salju", "Pegunungan"], answer: 0 },
    { q: "Naskah proklamasi diketik oleh...", options: ["Sayuti Melik", "Sudirman", "Tan Malaka", "Sutomo"], answer: 0 },
    { q: "Budi Utomo berdiri pada tahun...", options: ["1908", "1928", "1945", "1966"], answer: 0 },
    { q: "Konferensi Asia Afrika 1955 berlangsung di...", options: ["Bandung", "Jakarta", "Surabaya", "Solo"], answer: 0 },
    { q: "Patih Gajah Mada berasal dari kerajaan...", options: ["Majapahit", "Sriwijaya", "Kutai", "Tarumanegara"], answer: 0 },
  ],
  culture: [
    { q: "Dalam film, Oscar dikenal sebagai penghargaan untuk bidang...", options: ["Olahraga", "Musik", "Film", "Kuliner"], answer: 2 },
    { q: "K-pop berasal dari negara...", options: ["Jepang", "Korea Selatan", "Thailand", "China"], answer: 1 },
    { q: "Platform video pendek yang populer dengan For You Page adalah...", options: ["TikTok", "LinkedIn", "Wikipedia", "Pinterest"], answer: 0 },
    { q: "Genre musik dengan MC dan beat sering disebut...", options: ["Jazz", "Rap", "Keroncong", "Opera"], answer: 1 },
    { q: "Anime adalah istilah populer untuk animasi dari...", options: ["Jepang", "Italia", "Kanada", "Mesir"], answer: 0 },
    { q: "Karakter Mario dikenal dari perusahaan game...", options: ["Nintendo", "Sony Pictures", "Adobe", "Tesla"], answer: 0 },
    { q: "Komik Jepang biasa disebut...", options: ["Manhwa", "Manga", "Novel", "Zine"], answer: 1 },
    { q: "Aplikasi streaming musik yang identik dengan playlist adalah...", options: ["Spotify", "Excel", "Maps", "Zoom"], answer: 0 },
    { q: "Superhero Spider-Man berasal dari penerbit komik...", options: ["Marvel", "DC", "Shueisha", "Disney Channel"], answer: 0 },
    { q: "YouTube dikenal sebagai platform untuk...", options: ["Video", "Spreadsheet", "Peta offline", "Edit dokumen"], answer: 0 },
    { q: "Karakter Pikachu berasal dari franchise...", options: ["Pokemon", "Naruto", "One Piece", "Doraemon"], answer: 0 },
    { q: "Grammy Awards dikenal untuk bidang...", options: ["Musik", "Astronomi", "Memasak", "Arsitektur"], answer: 0 },
    { q: "Film animasi Toy Story dibuat oleh studio...", options: ["Pixar", "Marvel", "Nintendo", "Spotify"], answer: 0 },
    { q: "Platform yang terkenal dengan fitur Reels adalah...", options: ["Instagram", "Excel", "Wikipedia", "Gmail"], answer: 0 },
    { q: "Doraemon adalah karakter robot berbentuk...", options: ["Kucing", "Anjing", "Burung", "Ikan"], answer: 0 },
    { q: "Novel Harry Potter ditulis oleh...", options: ["J.K. Rowling", "Agatha Christie", "Tere Liye", "Andrea Hirata"], answer: 0 },
    { q: "Dalam musik, DJ adalah singkatan dari...", options: ["Disc Jockey", "Data Journal", "Dance Junior", "Digital Jam"], answer: 0 },
    { q: "Genre film dengan hantu dan rasa takut disebut...", options: ["Horor", "Komedi", "Dokumenter", "Musikal"], answer: 0 },
    { q: "Serial animasi SpongeBob tinggal di...", options: ["Bikini Bottom", "Gotham", "Hogwarts", "Asgard"], answer: 0 },
    { q: "Cosplay adalah kegiatan meniru gaya...", options: ["Karakter", "Cuaca", "Bangunan", "Olahraga"], answer: 0 },
  ],
  geography: [
    { q: "Gunung tertinggi di dunia adalah...", options: ["Everest", "Fuji", "Kilimanjaro", "Merapi"], answer: 0 },
    { q: "Sungai terpanjang di dunia sering disebut...", options: ["Nil", "Kapuas", "Thames", "Seine"], answer: 0 },
    { q: "Negara dengan bentuk kepulauan terbesar adalah...", options: ["Indonesia", "Swiss", "Mongolia", "Nepal"], answer: 0 },
    { q: "Gurun Sahara berada di benua...", options: ["Afrika", "Asia", "Eropa", "Australia"], answer: 0 },
    { q: "Samudra terluas di dunia adalah...", options: ["Pasifik", "Atlantik", "Hindia", "Arktik"], answer: 0 },
    { q: "Ibu kota Australia adalah...", options: ["Sydney", "Canberra", "Melbourne", "Perth"], answer: 1 },
    { q: "Menara Eiffel berada di kota...", options: ["Paris", "Roma", "Berlin", "Madrid"], answer: 0 },
    { q: "Negara yang terkenal dengan piramida Giza adalah...", options: ["Mesir", "Maroko", "Turki", "India"], answer: 0 },
    { q: "Pulau terbesar di Indonesia adalah...", options: ["Jawa", "Bali", "Kalimantan", "Madura"], answer: 2 },
    { q: "Kutub Selatan berada di benua...", options: ["Antartika", "Amerika", "Asia", "Eropa"], answer: 0 },
    { q: "Ibu kota Jepang adalah...", options: ["Tokyo", "Osaka", "Kyoto", "Nagoya"], answer: 0 },
    { q: "Negara Brazil berada di benua...", options: ["Amerika Selatan", "Afrika", "Asia", "Eropa"], answer: 0 },
    { q: "Pegunungan Alpen berada di benua...", options: ["Eropa", "Asia", "Afrika", "Australia"], answer: 0 },
    { q: "Selat Sunda memisahkan pulau...", options: ["Jawa dan Sumatra", "Bali dan Lombok", "Sulawesi dan Papua", "Kalimantan dan Sulawesi"], answer: 0 },
    { q: "Ibu kota Thailand adalah...", options: ["Bangkok", "Hanoi", "Manila", "Phnom Penh"], answer: 0 },
    { q: "Negara dengan Menara Pisa adalah...", options: ["Italia", "Prancis", "Jerman", "Belanda"], answer: 0 },
    { q: "Pulau Bali berada di sebelah timur pulau...", options: ["Jawa", "Sumatra", "Kalimantan", "Papua"], answer: 0 },
    { q: "Danau terbesar di dunia berdasarkan luas adalah...", options: ["Laut Kaspia", "Toba", "Victoria", "Baikal"], answer: 0 },
    { q: "Garis khayal yang membagi Bumi utara dan selatan adalah...", options: ["Khatulistiwa", "Meridian", "Lintang balik", "Garis tanggal"], answer: 0 },
    { q: "Negara Mesir berada di sekitar sungai...", options: ["Nil", "Amazon", "Gangga", "Mekong"], answer: 0 },
  ],
  sports: [
    { q: "Sepak bola dimainkan oleh berapa pemain tiap tim?", options: ["9", "10", "11", "12"], answer: 2 },
    { q: "Olahraga dengan raket dan kok disebut...", options: ["Tenis", "Badminton", "Golf", "Bisbol"], answer: 1 },
    { q: "Dalam basket, tembakan dari luar garis bernilai...", options: ["1 poin", "2 poin", "3 poin", "4 poin"], answer: 2 },
    { q: "Piala Dunia FIFA diadakan setiap...", options: ["1 tahun", "2 tahun", "4 tahun", "5 tahun"], answer: 2 },
    { q: "Olahraga renang dilakukan di...", options: ["Kolam", "Ring", "Lapangan", "Lintasan es"], answer: 0 },
    { q: "MotoGP adalah ajang balap...", options: ["Motor", "Sepeda", "Kuda", "Perahu"], answer: 0 },
    { q: "Dalam voli, bola dipukul melewati...", options: ["Net", "Gawang", "Ring", "Papan"], answer: 0 },
    { q: "Olahraga catur dimainkan di atas...", options: ["Papan", "Kolam", "Ring", "Lintasan"], answer: 0 },
    { q: "Tenis meja juga dikenal sebagai...", options: ["Ping pong", "Futsal", "Rugby", "Kriket"], answer: 0 },
    { q: "Olimpiade modern memakai simbol berapa cincin?", options: ["3", "4", "5", "6"], answer: 2 },
    { q: "Dalam sepak bola, penjaga gawang disebut...", options: ["Kiper", "Wasit", "Striker", "Bek"], answer: 0 },
    { q: "Olahraga yang memakai papan seluncur di ombak adalah...", options: ["Surfing", "Bowling", "Panahan", "Biliar"], answer: 0 },
    { q: "Dalam bulu tangkis, servis pertama memulai...", options: ["Rally", "Timeout", "Babak tambahan", "Pergantian bola"], answer: 0 },
    { q: "Olahraga memanah menggunakan...", options: ["Busur", "Raket", "Tongkat golf", "Sarung tangan tinju"], answer: 0 },
    { q: "Lapangan tenis dibagi oleh...", options: ["Net", "Gawang", "Ring", "Pagar kaca"], answer: 0 },
    { q: "Tinju dilakukan di atas area yang disebut...", options: ["Ring", "Kolam", "Lapangan rumput", "Meja"], answer: 0 },
    { q: "Dalam baseball, pemain memukul bola dengan...", options: ["Bat", "Raket", "Kaki", "Busur"], answer: 0 },
    { q: "Lari marathon berjarak sekitar...", options: ["42 km", "5 km", "10 km", "100 m"], answer: 0 },
    { q: "Olahraga dengan istilah checkmate adalah...", options: ["Catur", "Basket", "Voli", "Renang"], answer: 0 },
    { q: "Futsal adalah versi sepak bola yang dimainkan di...", options: ["Lapangan lebih kecil", "Kolam", "Lintasan es", "Arena pasir saja"], answer: 0 },
  ],
  tech: [
    { q: "CPU sering disebut sebagai bagian yang memproses...", options: ["Data", "Air", "Kertas", "Makanan"], answer: 0 },
    { q: "Perangkat untuk mengetik di komputer adalah...", options: ["Keyboard", "Monitor", "Speaker", "Router"], answer: 0 },
    { q: "Wi-Fi digunakan untuk koneksi...", options: ["Internet nirkabel", "Listrik rumah", "Air bersih", "Bahan bakar"], answer: 0 },
    { q: "File gambar biasanya bisa berformat...", options: ["JPG", "MP3", "DOCX saja", "EXE saja"], answer: 0 },
    { q: "HTML digunakan untuk membuat struktur...", options: ["Halaman web", "Masakan", "Jalan raya", "Lagu"], answer: 0 },
    { q: "Password yang kuat sebaiknya...", options: ["Mudah ditebak", "Panjang dan unik", "Nama sendiri", "123456"], answer: 1 },
    { q: "Aplikasi browser digunakan untuk...", options: ["Membuka web", "Menyapu lantai", "Memasak nasi", "Mengukur suhu"], answer: 0 },
    { q: "Cloud storage dipakai untuk menyimpan file di...", options: ["Internet", "Kulkas", "Kompor", "Buku tulis"], answer: 0 },
    { q: "QR code biasanya dipindai memakai...", options: ["Kamera", "Sendok", "Lampu", "Kipas"], answer: 0 },
    { q: "Bluetooth dipakai untuk koneksi jarak...", options: ["Dekat", "Antarbenua", "Ke bulan", "Bawah tanah saja"], answer: 0 },
    { q: "RAM berfungsi membantu komputer menyimpan data...", options: ["Sementara", "Di kertas", "Di awan saja", "Di layar"], answer: 0 },
    { q: "URL adalah alamat untuk membuka...", options: ["Halaman web", "Pintu rumah", "Jadwal TV", "Buku cetak"], answer: 0 },
    { q: "Email digunakan untuk mengirim...", options: ["Pesan digital", "Paket fisik", "Bensin", "Air"], answer: 0 },
    { q: "Touchscreen dikendalikan dengan...", options: ["Sentuhan", "Bensin", "Magnet bumi", "Kompor"], answer: 0 },
    { q: "Sistem operasi populer di komputer adalah...", options: ["Windows", "HTML", "Router", "Printer"], answer: 0 },
    { q: "Kamera depan ponsel sering dipakai untuk...", options: ["Selfie", "Mencetak uang", "Memasak", "Mengisi baterai"], answer: 0 },
    { q: "Antivirus membantu melindungi komputer dari...", options: ["Malware", "Debu meja", "Air hujan", "Suara"], answer: 0 },
    { q: "SSD adalah media untuk...", options: ["Menyimpan data", "Menampilkan suara", "Mengukur suhu", "Mengisi air"], answer: 0 },
    { q: "Kode OTP biasanya dipakai untuk...", options: ["Verifikasi", "Memasak", "Menggambar", "Mendinginkan ruangan"], answer: 0 },
    { q: "Aplikasi chat digunakan untuk...", options: ["Berkomunikasi", "Membajak sawah", "Memompa ban", "Mengecat tembok"], answer: 0 },
  ],
  food: [
    { q: "Rendang berasal dari daerah...", options: ["Sumatra Barat", "Bali", "Papua", "Maluku"], answer: 0 },
    { q: "Sushi adalah makanan khas...", options: ["Jepang", "Meksiko", "Mesir", "Brasil"], answer: 0 },
    { q: "Bahan utama tempe adalah...", options: ["Kedelai", "Jagung", "Kentang", "Tebu"], answer: 0 },
    { q: "Pizza identik dengan negara...", options: ["Italia", "Kanada", "Korea", "Mesir"], answer: 0 },
    { q: "Minuman yang dibuat dari daun teh disebut...", options: ["Teh", "Kopi", "Soda", "Susu"], answer: 0 },
    { q: "Gado-gado biasanya disajikan dengan saus...", options: ["Kacang", "Cokelat", "Keju", "Karamel"], answer: 0 },
    { q: "Makanan pokok mayoritas masyarakat Indonesia adalah...", options: ["Nasi", "Roti gandum", "Pasta", "Kentang goreng"], answer: 0 },
    { q: "Keju umumnya dibuat dari...", options: ["Susu", "Air mineral", "Tepung", "Kecap"], answer: 0 },
    { q: "Sate biasanya dimasak dengan cara...", options: ["Dibakar", "Dibekukan", "Dikukus saja", "Dijemur"], answer: 0 },
    { q: "Cabai memberi rasa...", options: ["Pedas", "Asin", "Pahit saja", "Tawar"], answer: 0 },
    { q: "Bakso biasanya berbentuk...", options: ["Bulat", "Segitiga", "Persegi panjang", "Bintang"], answer: 0 },
    { q: "Kopi dibuat dari biji...", options: ["Kopi", "Kedelai", "Jagung", "Kacang hijau"], answer: 0 },
    { q: "Nasi goreng dimasak dengan cara...", options: ["Digoreng", "Dibekukan", "Dijemur", "Direndam saja"], answer: 0 },
    { q: "Makanan khas Meksiko yang memakai tortilla adalah...", options: ["Taco", "Sushi", "Rendang", "Kimchi"], answer: 0 },
    { q: "Kimchi adalah makanan fermentasi dari...", options: ["Korea", "Italia", "Mesir", "Peru"], answer: 0 },
    { q: "Pempek berasal dari kota...", options: ["Palembang", "Bogor", "Manado", "Padang"], answer: 0 },
    { q: "Es krim biasanya disajikan dalam keadaan...", options: ["Dingin", "Panas", "Berasap api", "Kering total"], answer: 0 },
    { q: "Kecap manis memiliki rasa dominan...", options: ["Manis", "Asam", "Pahit", "Pedas"], answer: 0 },
    { q: "Roti dibuat dari bahan utama...", options: ["Tepung", "Batu", "Daun kering", "Garam saja"], answer: 0 },
    { q: "Gudeg adalah makanan khas...", options: ["Yogyakarta", "Medan", "Makassar", "Ambon"], answer: 0 },
  ],
  indonesia: [
    { q: "Semboyan Indonesia adalah...", options: ["Bhinneka Tunggal Ika", "Merdeka Belajar", "Tut Wuri", "Garuda Sakti"], answer: 0 },
    { q: "Lagu kebangsaan Indonesia adalah...", options: ["Indonesia Raya", "Bagimu Negeri", "Halo-Halo Bandung", "Gugur Bunga"], answer: 0 },
    { q: "Hari Kemerdekaan Indonesia diperingati pada...", options: ["17 Agustus", "1 Juni", "28 Oktober", "10 November"], answer: 0 },
    { q: "Pulau Jawa berada di sebelah mana dari Kalimantan?", options: ["Selatan", "Utara", "Barat", "Timur"], answer: 0 },
    { q: "Komodo banyak dikenal berasal dari provinsi...", options: ["Nusa Tenggara Timur", "Aceh", "Banten", "Jambi"], answer: 0 },
    { q: "Monas berada di kota...", options: ["Jakarta", "Bandung", "Yogyakarta", "Semarang"], answer: 0 },
    { q: "Danau Toba berada di provinsi...", options: ["Sumatra Utara", "Lampung", "Bengkulu", "Riau"], answer: 0 },
    { q: "Batik diakui sebagai warisan budaya dari...", options: ["Indonesia", "Thailand", "Jepang", "Australia"], answer: 0 },
    { q: "Angklung adalah alat musik dari...", options: ["Jawa Barat", "Bali", "Sulawesi Selatan", "Papua"], answer: 0 },
    { q: "Candi Prambanan berada dekat kota...", options: ["Yogyakarta", "Makassar", "Medan", "Kupang"], answer: 0 },
    { q: "Garuda Pancasila mencengkeram pita bertuliskan...", options: ["Bhinneka Tunggal Ika", "Indonesia Raya", "Merdeka", "Pancasila Jaya"], answer: 0 },
    { q: "Tari Saman berasal dari...", options: ["Aceh", "Bali", "Jawa Timur", "Maluku"], answer: 0 },
    { q: "Rumah Gadang adalah rumah adat dari...", options: ["Sumatra Barat", "Kalimantan Timur", "Papua", "Banten"], answer: 0 },
    { q: "Wayang kulit erat dengan budaya...", options: ["Jawa", "Skotlandia", "Kanada", "Mesir"], answer: 0 },
    { q: "Bunga nasional Indonesia salah satunya adalah...", options: ["Melati", "Tulip", "Sakura", "Lavender"], answer: 0 },
    { q: "Laut Bunaken terkenal berada di...", options: ["Sulawesi Utara", "Jawa Tengah", "Lampung", "Bali"], answer: 0 },
    { q: "Papua terkenal dengan burung...", options: ["Cenderawasih", "Penguin", "Merak Eropa", "Flamingo"], answer: 0 },
    { q: "Tugu Khatulistiwa berada di kota...", options: ["Pontianak", "Bandung", "Malang", "Padang"], answer: 0 },
    { q: "Sasando adalah alat musik dari...", options: ["Nusa Tenggara Timur", "Aceh", "Bali", "Jawa Barat"], answer: 0 },
    { q: "Upacara Ngaben dikenal dari daerah...", options: ["Bali", "Riau", "Papua", "Bengkulu"], answer: 0 },
  ],
  animals: [
    { q: "Hewan yang bisa hidup di air dan darat disebut...", options: ["Amfibi", "Mamalia", "Reptil saja", "Serangga"], answer: 0 },
    { q: "Hewan terbesar di dunia adalah...", options: ["Paus biru", "Gajah", "Jerapah", "Badak"], answer: 0 },
    { q: "Burung menggunakan apa untuk terbang?", options: ["Sayap", "Sirip", "Tanduk", "Cakar saja"], answer: 0 },
    { q: "Kucing termasuk hewan...", options: ["Mamalia", "Ikan", "Amfibi", "Serangga"], answer: 0 },
    { q: "Hewan yang dikenal suka membuat madu adalah...", options: ["Lebah", "Semut", "Lalat", "Kupu-kupu"], answer: 0 },
    { q: "Ikan bernapas menggunakan...", options: ["Insang", "Paru-paru saja", "Kulit kering", "Daun"], answer: 0 },
    { q: "Hewan dengan leher sangat panjang adalah...", options: ["Jerapah", "Kuda nil", "Kelinci", "Panda"], answer: 0 },
    { q: "Kura-kura memiliki pelindung berupa...", options: ["Cangkang", "Bulu tebal", "Tanduk", "Sisik emas"], answer: 0 },
    { q: "Hewan yang berubah dari ulat menjadi kupu-kupu mengalami...", options: ["Metamorfosis", "Fotosintesis", "Evaporasi", "Fermentasi"], answer: 0 },
    { q: "Ayam berkembang biak dengan cara...", options: ["Bertelur", "Melahirkan", "Membelah diri", "Bertunas"], answer: 0 },
    { q: "Hewan yang dikenal sebagai raja hutan adalah...", options: ["Singa", "Kambing", "Kucing", "Rusa"], answer: 0 },
    { q: "Gajah memiliki hidung panjang yang disebut...", options: ["Belalai", "Sirip", "Paruh", "Cangkang"], answer: 0 },
    { q: "Hewan yang hidup berkelompok di koloni dan kecil adalah...", options: ["Semut", "Paus", "Kuda", "Elang"], answer: 0 },
    { q: "Penguin adalah burung yang tidak bisa...", options: ["Terbang", "Berenang", "Berjalan", "Melihat"], answer: 0 },
    { q: "Ular bergerak dengan cara...", options: ["Melata", "Terbang", "Berlari dua kaki", "Berguling roda"], answer: 0 },
    { q: "Sapi menghasilkan minuman berupa...", options: ["Susu", "Teh", "Kopi", "Soda"], answer: 0 },
    { q: "Hewan yang punya kantong untuk anaknya adalah...", options: ["Kanguru", "Harimau", "Kuda", "Bebek"], answer: 0 },
    { q: "Burung hantu aktif berburu pada...", options: ["Malam", "Siang saja", "Tengah hari", "Saat hujan saja"], answer: 0 },
    { q: "Kuda laut hidup di...", options: ["Laut", "Gurun", "Puncak gunung", "Padang salju"], answer: 0 },
    { q: "Hewan pemakan tumbuhan disebut...", options: ["Herbivora", "Karnivora", "Omnivora", "Insektivora"], answer: 0 },
  ],
};

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function TriviYAYLogo() {
  const row1 = [
    { char: "T", color: "#5b8a6a", tilt: "-8deg", delay: "0s" },
    { char: "R", color: "#f2b83f", tilt: "6deg", delay: "0.05s" },
    { char: "I", color: "#e67e52", tilt: "4deg", delay: "0.1s" },
    { char: "V", color: "#8aa3e2", tilt: "-5deg", delay: "0.15s" },
    { char: "I", color: "#5b8a6a", tilt: "8deg", delay: "0.2s" },
  ];

  const row2 = [
    { char: "Y", color: "#8aa3e2", tilt: "-6deg", delay: "0.25s" },
    { char: "A", color: "#e67e52", tilt: "5deg", delay: "0.3s" },
    { char: "Y", color: "#f2b83f", tilt: "10deg", delay: "0.35s" },
  ];

  return (
    <div className="brand-logo-container" aria-label="TriviYAY Logo">
      <div className="logo-row row-top">
        {row1.map((item, idx) => (
          <span
            key={idx}
            className="logo-letter"
            style={{
              "--letter-color": item.color,
              "--letter-tilt": item.tilt,
              "--letter-delay": item.delay,
            }}
          >
            {item.char}
          </span>
        ))}
      </div>
      <div className="logo-row row-bottom">
        {row2.map((item, idx) => (
          <span
            key={idx}
            className="logo-letter"
            style={{
              "--letter-color": item.color,
              "--letter-tilt": item.tilt,
              "--letter-delay": item.delay,
            }}
          >
            {item.char}
          </span>
        ))}
      </div>
      <div className="logo-subtitle">LEARNING IS FUN</div>
    </div>
  );
}

function Mascot({ mascot, className = "", color }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`mascot ${className}`} style={{ "--accent": color }}>
      {!failed ? (
        <img src={mascot.src} alt={mascot.name} onError={() => setFailed(true)} />
      ) : (
        <span>{mascot.fallback}</span>
      )}
    </div>
  );
}

export default function Triviyay() {
  const [screen, setScreen] = useState("home");
  const [genre, setGenre] = useState("general");
  const [difficulty, setDifficulty] = useState("normal");
  const [mascotId, setMascotId] = useState("brain");
  const [color, setColor] = useState(COLORS[0]);
  const [round, setRound] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(14);
  const [picked, setPicked] = useState(null);
  const [locked, setLocked] = useState(false);
  const [popup, setPopup] = useState(null);
  const timerRef = useRef(null);

  // Audio Preferences States
  const [soundOn, setSoundOn] = useState(() => {
    const val = localStorage.getItem("triviyay-sfx");
    return val !== null ? val === "true" : true;
  });
  const [musicOn, setMusicOn] = useState(() => {
    const val = localStorage.getItem("triviyay-music");
    return val !== null ? val === "true" : false;
  });

  const [soundVolume, setSoundVolume] = useState(() => {
    const val = localStorage.getItem("triviyay-sfx-volume");
    return val !== null ? Number(val) : 80;
  });
  const [musicVolume, setMusicVolume] = useState(() => {
    const val = localStorage.getItem("triviyay-music-volume");
    return val !== null ? Number(val) : 50;
  });

  const handleSoundVolumeChange = (e) => {
    const val = Number(e.target.value);
    setSoundVolume(val);
    localStorage.setItem("triviyay-sfx-volume", String(val));
  };

  const handleMusicVolumeChange = (e) => {
    const val = Number(e.target.value);
    setMusicVolume(val);
    localStorage.setItem("triviyay-music-volume", String(val));
  };

  const difficultyMeta = DIFFICULTIES.find((item) => item.id === difficulty) ?? DIFFICULTIES[1];
  const mascot = DEFAULT_MASCOTS.find((item) => item.id === mascotId) ?? DEFAULT_MASCOTS[0];
  const selectedGenre = GENRES.find((item) => item.id === genre) ?? GENRES[0];
  const current = round[index];
  const progress = round.length ? ((index + 1) / round.length) * 100 : 0;

  const bestScore = useMemo(() => Number(localStorage.getItem("triviyay-best") || 0), [screen]);

  // Audio toggle helper
  const toggleSound = () => {
    const nextVal = !soundOn;
    setSoundOn(nextVal);
    localStorage.setItem("triviyay-sfx", String(nextVal));
    if (nextVal) {
      playSFX("click", true);
    }
  };

  const toggleMusic = () => {
    const nextVal = !musicOn;
    setMusicOn(nextVal);
    localStorage.setItem("triviyay-music", String(nextVal));
  };

  // Click handler wrapper to play click sound
  const clickPlay = (fn) => (e) => {
    playSFX("click", soundOn);
    if (fn) fn(e);
  };

  // Auto control BGM based on active game state, popup, and preference
  useEffect(() => {
    if (screen === "game" && !popup && musicOn) {
      startMusic(true);
    } else {
      stopMusic();
    }
    return () => {
      stopMusic();
    };
  }, [screen, popup, musicOn]);

  const stopTimer = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
  };

  const startGame = () => {
    playSFX("start", soundOn);
    
    // Ambil 10 soal acak dari genre pilihan
    const selectedQuestions = shuffle(QUESTIONS[genre]).slice(0, QUESTION_COUNT);
    
    // Acak posisi pilihan jawaban untuk masing-masing soal, lalu hitung ulang index jawaban yang benar
    const nextQuestions = selectedQuestions.map((item) => {
      const correctOptionText = item.options[item.answer];
      const shuffledOptions = shuffle(item.options);
      const newAnswerIndex = shuffledOptions.indexOf(correctOptionText);
      
      return {
        ...item,
        options: shuffledOptions,
        answer: newAnswerIndex,
      };
    });

    setRound(nextQuestions);
    setIndex(0);
    setScore(0);
    setPicked(null);
    setLocked(false);
    setPopup(null);
    setTimeLeft(difficultyMeta.seconds);
    setScreen("game");
  };

  const openPopup = (type) => {
    stopTimer();
    setPopup(type);
  };

  const resumeGame = () => {
    setPopup(null);
  };

  const goHome = () => {
    stopTimer();
    setPopup(null);
    setScreen("home");
  };

  const finishAnswer = (choice) => {
    if (!current || locked) return;

    stopTimer();
    setPicked(choice);
    setLocked(true);

    const correct = choice === current.answer;
    if (correct) {
      playSFX("correct", soundOn);
      const speedBonus = Math.round((timeLeft / difficultyMeta.seconds) * 45);
      setScore((value) => value + difficultyMeta.points + speedBonus);
    } else {
      playSFX("wrong", soundOn);
    }

    window.setTimeout(() => {
      if (index + 1 >= round.length) {
        playSFX("complete", soundOn);
        const finalScore = correct ? score + difficultyMeta.points + Math.round((timeLeft / difficultyMeta.seconds) * 45) : score;
        const savedBest = Number(localStorage.getItem("triviyay-best") || 0);
        localStorage.setItem("triviyay-best", String(Math.max(savedBest, finalScore)));
        setScreen("result");
        return;
      }

      setIndex((value) => value + 1);
      setPicked(null);
      setLocked(false);
      setTimeLeft(difficultyMeta.seconds);
    }, 1050);
  };

  useEffect(() => {
    if (screen !== "game" || locked || popup) return undefined;

    stopTimer();
    timerRef.current = window.setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timerRef.current);
          window.setTimeout(() => finishAnswer(-1), 0);
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return stopTimer;
  }, [screen, index, locked, difficulty, popup]);

  return (
    <main className="app-shell">
      <section className="phone-frame">
        {screen === "home" && (
          <div className="screen home-screen">
            <header className="brand-block">
              <Mascot mascot={mascot} color={color} className="hero-mascot" />
              <TriviYAYLogo />
            </header>

            <div className="quick-stats">
              <div>
                <span>Best</span>
                <strong>{bestScore}</strong>
              </div>
              <div>
                <span>Mode</span>
                <strong>Solo</strong>
              </div>
            </div>

            <div className="stack">
              <button className="primary-btn" onClick={clickPlay(() => setScreen("setup"))}>
                <span className="btn-icon">▶</span>
                Main
              </button>
              <button className="ghost-btn" onClick={clickPlay(() => setScreen("customize"))}>
                <span className="btn-icon">✦</span>
                Custom Maskot
              </button>
              <button className="ghost-btn" onClick={clickPlay(() => setScreen("settings"))}>
                <span className="btn-icon">⚙️</span>
                Pengaturan Suara
              </button>
            </div>
          </div>
        )}

        {screen === "setup" && (
          <div className="screen">
            <button className="back-btn" onClick={clickPlay(() => setScreen("home"))}>‹ Back</button>
            <div className="setup-heading">
              <p className="eyebrow">Solo quiz</p>
              <h2>Setup Game</h2>
              <p className="setup-copy">Pilih genre dan difficulty yang kamu mau.</p>
            </div>

            <p className="section-label">Genre</p>
            <div className="option-grid">
              {GENRES.map((item) => (
                <button
                  key={item.id}
                  className={`option-card ${genre === item.id ? "active" : ""}`}
                  onClick={clickPlay(() => setGenre(item.id))}
                >
                  <span>{item.icon}</span>
                  <strong>{item.label}</strong>
                </button>
              ))}
            </div>

            <p className="section-label">Difficulty</p>
            <div className="difficulty-list">
              {DIFFICULTIES.map((item) => (
                <button
                  key={item.id}
                  className={`difficulty-row ${difficulty === item.id ? "active" : ""}`}
                  onClick={clickPlay(() => setDifficulty(item.id))}
                >
                  <strong>{item.label}</strong>
                  <span>{item.seconds}s per soal</span>
                </button>
              ))}
            </div>

            <button className="primary-btn bottom-action" onClick={startGame}>
              <span className="btn-icon">▶</span>
              Mulai Kuis
            </button>
          </div>
        )}

        {screen === "customize" && (
          <div className="screen">
            <button className="back-btn" onClick={clickPlay(() => setScreen("home"))}>‹ Back</button>
            <h2>Custom Maskot</h2>

            <div className="preview-panel">
              <Mascot mascot={mascot} color={color} className="preview-mascot" />
              <strong>{mascot.name}</strong>
            </div>

            <p className="section-label">Pilih Slot</p>
            <div className="mascot-grid">
              {DEFAULT_MASCOTS.map((item) => (
                <button
                  key={item.id}
                  className={`mascot-choice ${mascotId === item.id ? "active" : ""}`}
                  onClick={clickPlay(() => setMascotId(item.id))}
                >
                  <Mascot mascot={item} color={color} />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>

            <p className="section-label">Warna Player</p>
            <div className="color-row">
              {COLORS.map((item) => (
                <button
                  key={item}
                  className={color === item ? "color-dot active" : "color-dot"}
                  style={{ background: item }}
                  aria-label={`Pilih warna ${item}`}
                  onClick={clickPlay(() => setColor(item))}
                />
              ))}
            </div>
          </div>
        )}

        {screen === "settings" && (
          <div className="screen settings-screen">
            <button className="back-btn" onClick={clickPlay(() => setScreen("home"))}>‹ Back</button>
            
            <div className="setup-heading">
              <p className="eyebrow">Pengaturan</p>
              <h2>Suara & Musik</h2>
              <p className="setup-copy">Sesuaikan volume efek suara dan musik retro dalam game.</p>
            </div>

            <div className="settings-options">
              <div className="settings-row-container">
                <div className={`settings-row ${soundOn ? "has-volume" : ""}`}>
                  <div className="settings-label">
                    <strong>Efek Suara (SFX)</strong>
                    <span>Ketukan tombol, jawaban benar/salah, & selebrasi</span>
                  </div>
                  <button 
                    className={`toggle-btn ${soundOn ? "active" : ""}`}
                    aria-label="Toggle Efek Suara"
                    onClick={clickPlay(toggleSound)}
                  >
                    <div className="toggle-slider">
                      <span className="toggle-text">{soundOn ? "ON" : "OFF"}</span>
                    </div>
                  </button>
                </div>
                {soundOn && (
                  <div className="volume-slider-box">
                    <span>🔊 Volume SFX: {soundVolume}%</span>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={soundVolume} 
                      onChange={handleSoundVolumeChange}
                      className="volume-input"
                      aria-label="Volume Efek Suara"
                    />
                  </div>
                )}
              </div>

              <div className="settings-row-container">
                <div className={`settings-row ${musicOn ? "has-volume" : ""}`}>
                  <div className="settings-label">
                    <strong>Musik Latar (BGM)</strong>
                    <span>Melodi chiptune retro lembut saat kuis dimulai</span>
                  </div>
                  <button 
                    className={`toggle-btn ${musicOn ? "active" : ""}`}
                    aria-label="Toggle Musik Latar"
                    onClick={clickPlay(toggleMusic)}
                  >
                    <div className="toggle-slider">
                      <span className="toggle-text">{musicOn ? "ON" : "OFF"}</span>
                    </div>
                  </button>
                </div>
                {musicOn && (
                  <div className="volume-slider-box">
                    <span>🎵 Volume Musik: {musicVolume}%</span>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={musicVolume} 
                      onChange={handleMusicVolumeChange}
                      className="volume-input"
                      aria-label="Volume Musik Latar"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="preview-panel sound-preview">
              <p className="eyebrow" style={{ color: "#35543f", marginBottom: "8px" }}>Tes Efek Suara</p>
              <div className="sound-test-grid">
                <button className="ghost-btn sound-test-btn" onClick={clickPlay(() => playSFX("correct", soundOn))}>
                  🎉 Benar
                </button>
                <button className="ghost-btn sound-test-btn" onClick={clickPlay(() => playSFX("wrong", soundOn))}>
                  💥 Salah
                </button>
              </div>
            </div>
          </div>
        )}

        {screen === "game" && current && (
          <div className="screen game-screen">
            <header className="game-topbar">
              <Mascot mascot={mascot} color={color} />
              <div>
                <span>Score</span>
                <strong>{score}</strong>
              </div>
              <div>
                <span>Time</span>
                <strong>{timeLeft}s</strong>
              </div>
              <button className="pause-btn" onClick={clickPlay(() => openPopup("pause"))} disabled={locked}>
                Pause
              </button>
            </header>

            <div className="progress-track">
              <div style={{ width: `${progress}%` }} />
            </div>

            <div className="question-prompt">
              <Mascot mascot={mascot} color={color} className="question-mascot" />
              <div className="speech-bubble">
                <p className="question-count">Soal {index + 1} dari {round.length}</p>
                <h2 className="question-text">{current.q}</h2>
              </div>
            </div>

            <div className="answer-list">
              {current.options.map((option, optionIndex) => {
                const isCorrect = optionIndex === current.answer;
                const isWrongPick = picked === optionIndex && !isCorrect;
                const stateClass = locked && isCorrect ? "correct" : locked && isWrongPick ? "wrong" : "";

                return (
                  <button
                    key={option}
                    className={`answer-btn ${stateClass}`}
                    disabled={locked}
                    onClick={() => finishAnswer(optionIndex)}
                  >
                    <span>{String.fromCharCode(65 + optionIndex)}</span>
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {screen === "result" && (
          <div className="screen result-screen">
            <Mascot mascot={mascot} color={color} className="hero-mascot" />
            <p className="eyebrow">Game selesai</p>
            <h1>{score >= bestScore ? "New Best!" : "Nice Try!"}</h1>
            <div className="final-score">{score}</div>
            <p className="subtitle">Best score sekarang: {Math.max(bestScore, score)}</p>

            <div className="stack">
              <button className="primary-btn" onClick={startGame}>
                <span className="btn-icon">↻</span>
                Main Lagi
              </button>
              <button className="ghost-btn" onClick={clickPlay(() => setScreen("home"))}>
                <span className="btn-icon">⌂</span>
                Home
              </button>
            </div>
          </div>
        )}

        {popup && (
          <div className="popup-backdrop" role="dialog" aria-modal="true">
            <div className="popup-card">
              {popup === "pause" && (
                <>
                  <p className="eyebrow">Paused</p>
                  <h2>Istirahat dulu?</h2>
                  <p className="popup-copy">Timer berhenti sementara. Progress lu masih aman.</p>
                  <div className="stack">
                    <button className="primary-btn" onClick={clickPlay(resumeGame)}>Lanjut</button>
                    <button className="ghost-btn" onClick={clickPlay(() => setPopup("retry"))}>Retry</button>
                    <button className="ghost-btn" onClick={clickPlay(() => setPopup("home"))}>Home</button>
                  </div>
                </>
              )}

              {popup === "retry" && (
                <>
                  <p className="eyebrow">Konfirmasi</p>
                  <h2>Ulang ronde?</h2>
                  <p className="popup-copy">Skor ronde ini bakal direset, lalu ambil 10 soal acak baru dari genre yang sama.</p>
                  <div className="stack">
                    <button className="primary-btn" onClick={startGame}>Ya, Retry</button>
                    <button className="ghost-btn" onClick={clickPlay(() => setPopup("pause"))}>Batal</button>
                  </div>
                </>
              )}

              {popup === "home" && (
                <>
                  <p className="eyebrow">Konfirmasi</p>
                  <h2>Balik home?</h2>
                  <p className="popup-copy">Progress ronde ini bakal ditinggal.</p>
                  <div className="stack">
                    <button className="primary-btn" onClick={clickPlay(goHome)}>Ya, Home</button>
                    <button className="ghost-btn" onClick={clickPlay(() => setPopup("pause"))}>Batal</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
