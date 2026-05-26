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
    { q: "Jika fungsi f(x) = 2x^2 - 3x + 1, nilai f(-2) adalah...", options: ["15", "11", "7", "-1"], answer: 0 },
    { q: "Dalam logika, negasi dari pernyataan 'semua siswa lulus' adalah...", options: ["Ada siswa yang tidak lulus", "Semua siswa tidak lulus", "Tidak ada siswa yang lulus", "Sebagian besar siswa lulus"], answer: 0 },
    { q: "Paragraf deduktif biasanya memiliki ide pokok di bagian...", options: ["Awal paragraf", "Akhir paragraf", "Tengah paragraf", "Awal dan akhir saja"], answer: 0 },
    { q: "Jika peluang hujan 0,35, maka peluang tidak hujan adalah...", options: ["0,65", "0,35", "1,35", "0,30"], answer: 0 },
    { q: "Dalam sistem SI, satuan energi adalah...", options: ["Joule", "Newton", "Watt", "Pascal"], answer: 0 },
    { q: "Kata 'analisis' dalam karya ilmiah paling dekat artinya dengan...", options: ["Penguraian masalah", "Pengulangan data", "Penghapusan bukti", "Penyusunan daftar pustaka"], answer: 0 },
    { q: "Bilangan 2, 3, 5, 7, dan 11 termasuk jenis bilangan...", options: ["Prima", "Komposit", "Irasional", "Negatif"], answer: 0 },
    { q: "Dalam debat, argumen yang baik harus didukung oleh...", options: ["Data atau alasan logis", "Suara paling keras", "Pendapat pribadi saja", "Serangan ke lawan"], answer: 0 },
    { q: "Jika inflasi terjadi, dampak langsung yang umum adalah...", options: ["Daya beli uang menurun", "Harga selalu turun", "Produksi berhenti total", "Pajak otomatis hilang"], answer: 0 },
    { q: "Peta dengan skala 1:250.000 berarti 1 cm pada peta mewakili...", options: ["2,5 km", "250 m", "25 km", "250 km"], answer: 0 },
    { q: "Dalam metode ilmiah, hipotesis adalah...", options: ["Dugaan sementara yang diuji", "Kesimpulan akhir mutlak", "Alat pengukur data", "Daftar pustaka penelitian"], answer: 0 },
    { q: "Sebuah teks eksposisi bertujuan utama untuk...", options: ["Menjelaskan gagasan dengan argumen", "Menceritakan kisah fiksi", "Membuat dialog drama", "Memberi instruksi langkah kerja"], answer: 0 },
    { q: "Jika x + 2y = 10 dan x = 4, nilai y adalah...", options: ["3", "4", "5", "6"], answer: 0 },
    { q: "Dalam ekonomi, kebutuhan primer adalah kebutuhan yang...", options: ["Paling dasar untuk hidup", "Bersifat mewah", "Muncul setelah tabungan", "Hanya untuk hiburan"], answer: 0 },
    { q: "Istilah 'variabel bebas' dalam eksperimen berarti variabel yang...", options: ["Dimanipulasi peneliti", "Selalu tetap", "Menjadi hasil pengukuran", "Tidak pernah dicatat"], answer: 0 },
    { q: "Kalimat efektif biasanya memiliki ciri...", options: ["Jelas, hemat, dan logis", "Panjang dan berulang", "Banyak istilah asing", "Tanpa subjek"], answer: 0 },
    { q: "Simpangan baku dalam statistika digunakan untuk mengukur...", options: ["Sebaran data dari rata-rata", "Jumlah seluruh data", "Nilai terkecil saja", "Frekuensi kategori"], answer: 0 },
    { q: "Jika suatu benda bergerak lurus beraturan, kecepatannya...", options: ["Tetap", "Selalu nol", "Makin besar terus", "Makin kecil terus"], answer: 0 },
    { q: "Karya tulis ilmiah harus menghindari plagiarisme dengan cara...", options: ["Mencantumkan sumber rujukan", "Mengubah font tulisan", "Memperpendek paragraf", "Menghapus data pendukung"], answer: 0 },
    { q: "Dalam demokrasi, prinsip kedaulatan rakyat berarti kekuasaan tertinggi berada pada...", options: ["Rakyat", "Partai tunggal", "Militer", "Pemilik modal"], answer: 0 },
  ],
  science: [
    { q: "Pada reaksi fotosintesis, molekul yang menjadi sumber oksigen bebas adalah...", options: ["Air", "Karbon dioksida", "Glukosa", "Klorofil"], answer: 0 },
    { q: "Jika resultan gaya pada benda bernilai nol, benda tersebut akan...", options: ["Tetap diam atau bergerak lurus beraturan", "Selalu berhenti mendadak", "Selalu dipercepat", "Berubah massa"], answer: 0 },
    { q: "Ion Ca2+ terbentuk ketika atom kalsium...", options: ["Melepas dua elektron", "Menerima dua elektron", "Melepas dua proton", "Menerima dua neutron"], answer: 0 },
    { q: "Enzim bekerja paling efektif pada kondisi tertentu karena bentuk sisi aktifnya dipengaruhi oleh...", options: ["Suhu dan pH", "Warna cahaya saja", "Tekanan udara saja", "Jumlah kromosom"], answer: 0 },
    { q: "Dalam pewarisan sifat, alel resesif akan tampak pada fenotipe jika genotipenya...", options: ["Homozigot resesif", "Heterozigot dominan", "Homozigot dominan", "Selalu terpaut X"], answer: 0 },
    { q: "Larutan dengan pH 3 bersifat...", options: ["Asam kuat dibanding pH 6", "Basa kuat", "Netral", "Tidak memiliki ion H+"], answer: 0 },
    { q: "Hukum kekekalan massa menyatakan bahwa dalam reaksi kimia tertutup...", options: ["Massa total sebelum dan sesudah reaksi sama", "Massa produk selalu lebih besar", "Atom dapat lenyap", "Energi tidak berubah sama sekali"], answer: 0 },
    { q: "Bagian sel yang menjadi tempat utama respirasi aerob adalah...", options: ["Mitokondria", "Ribosom", "Lisosom", "Vakuola"], answer: 0 },
    { q: "Gelombang elektromagnetik berbeda dari gelombang bunyi karena...", options: ["Dapat merambat di ruang hampa", "Selalu membutuhkan medium", "Tidak membawa energi", "Hanya berupa gelombang longitudinal"], answer: 0 },
    { q: "Jika tekanan gas tetap dan suhu dinaikkan, volume gas ideal cenderung...", options: ["Membesar", "Mengecil", "Tetap nol", "Tidak terkait suhu"], answer: 0 },
    { q: "Pada tabel periodik, unsur dalam satu golongan umumnya memiliki kesamaan...", options: ["Jumlah elektron valensi", "Nomor massa", "Jumlah neutron", "Warna padatan"], answer: 0 },
    { q: "Peristiwa osmosis adalah perpindahan air melalui membran semipermeabel dari larutan...", options: ["Lebih encer ke lebih pekat", "Lebih pekat ke lebih encer", "Netral ke asam saja", "Bersuhu tinggi ke rendah saja"], answer: 0 },
    { q: "Energi kinetik benda bermassa m dan berkecepatan v dirumuskan sebagai...", options: ["1/2 mv^2", "mv", "mgh", "F/s"], answer: 0 },
    { q: "Pada DNA, pasangan basa nitrogen yang benar adalah...", options: ["A-T dan G-C", "A-G dan T-C", "A-C dan G-T", "A-U dan G-C"], answer: 0 },
    { q: "Katalis dalam reaksi kimia berfungsi untuk...", options: ["Menurunkan energi aktivasi", "Mengubah hasil akhir stoikiometri", "Habis seluruhnya bereaksi", "Menaikkan massa atom"], answer: 0 },
    { q: "Lapisan atmosfer tempat sebagian besar cuaca terjadi adalah...", options: ["Troposfer", "Stratosfer", "Mesosfer", "Termosfer"], answer: 0 },
    { q: "Arus listrik 2 A mengalir selama 5 s. Muatan yang berpindah adalah...", options: ["10 C", "2,5 C", "7 C", "0,4 C"], answer: 0 },
    { q: "Sifat koligatif larutan bergantung terutama pada...", options: ["Jumlah partikel zat terlarut", "Jenis warna zat", "Bentuk wadah", "Kecepatan pengadukan saja"], answer: 0 },
    { q: "Pada sistem pernapasan manusia, pertukaran gas terjadi terutama di...", options: ["Alveolus", "Trakea", "Laring", "Bronkus utama"], answer: 0 },
    { q: "Evolusi melalui seleksi alam terjadi ketika individu dengan sifat adaptif...", options: ["Lebih mampu bertahan dan bereproduksi", "Pasti berubah menjadi spesies baru seketika", "Tidak mewariskan sifat", "Selalu memiliki tubuh terbesar"], answer: 0 },
  ],
  history: [
    { q: "Politik Etis Belanda pada awal abad ke-20 meliputi tiga program utama, yaitu...", options: ["Irigasi, edukasi, emigrasi", "Tanam paksa, rodi, monopoli", "Blokade, sensus, sensor", "Militerisasi, urbanisasi, privatisasi"], answer: 0 },
    { q: "Faktor utama lahirnya nasionalisme Indonesia pada awal abad ke-20 adalah...", options: ["Munculnya kaum terpelajar", "Hilangnya semua kerajaan lokal", "Berakhirnya kolonialisme Asia", "Larangan organisasi modern"], answer: 0 },
    { q: "Perjanjian Renville merugikan Indonesia karena...", options: ["Wilayah RI makin menyempit", "Belanda mengakui seluruh Nusantara", "Ibu kota pindah ke Jakarta", "Jepang kembali berkuasa"], answer: 0 },
    { q: "Sistem tanam paksa pada masa Van den Bosch bertujuan utama untuk...", options: ["Mengisi kas Belanda", "Membentuk parlemen lokal", "Meningkatkan pendidikan rakyat", "Menghapus pajak tanah"], answer: 0 },
    { q: "Konferensi Meja Bundar tahun 1949 menghasilkan keputusan penting berupa...", options: ["Pengakuan kedaulatan Indonesia", "Pembentukan BPUPKI", "Pembatalan Proklamasi", "Masuknya Jepang ke Indonesia"], answer: 0 },
    { q: "Ciri utama Demokrasi Terpimpin di Indonesia adalah...", options: ["Kekuasaan presiden sangat dominan", "Kabinet parlementer stabil", "Partai politik dihapus total", "Pemilu berlangsung tiap tahun"], answer: 0 },
    { q: "Revolusi Industri pertama ditandai oleh penggunaan utama...", options: ["Mesin uap", "Komputer digital", "Energi nuklir", "Internet"], answer: 0 },
    { q: "Penyebab langsung Perang Dunia I adalah...", options: ["Pembunuhan Franz Ferdinand", "Serangan Pearl Harbor", "Krisis misil Kuba", "Jatuhnya Tembok Berlin"], answer: 0 },
    { q: "Latar belakang utama Perang Dingin adalah persaingan ideologi antara...", options: ["Kapitalisme dan komunisme", "Feodalisme dan merkantilisme", "Nasionalisme dan imperialisme Romawi", "Liberalisme dan absolutisme abad pertengahan"], answer: 0 },
    { q: "Dekrit Presiden 5 Juli 1959 berisi antara lain...", options: ["Kembali ke UUD 1945", "Pembentukan RIS", "Penghapusan jabatan presiden", "Pembubaran PPKI"], answer: 0 },
    { q: "Organisasi Sarekat Islam awalnya berkembang dari organisasi pedagang bernama...", options: ["Sarekat Dagang Islam", "Indische Partij", "Budi Utomo", "Perhimpunan Indonesia"], answer: 0 },
    { q: "Tujuan utama pembentukan BPUPKI adalah...", options: ["Menyelidiki persiapan kemerdekaan Indonesia", "Mengatur tanam paksa", "Menyusun perjanjian Renville", "Membentuk negara federal Belanda"], answer: 0 },
    { q: "Faktor yang mempercepat Proklamasi 17 Agustus 1945 adalah...", options: ["Kekalahan Jepang dalam Perang Dunia II", "Kemenangan Belanda di Pasifik", "Dibubarkannya VOC", "Perjanjian Linggarjati"], answer: 0 },
    { q: "VOC memperoleh hak oktroi yang berarti...", options: ["Hak istimewa seperti mencetak uang dan berperang", "Kewajiban memberi pendidikan gratis", "Larangan memonopoli dagang", "Hak memilih parlemen Indonesia"], answer: 0 },
    { q: "Gerakan Non-Blok lahir sebagai respons terhadap...", options: ["Polarisasi Blok Barat dan Blok Timur", "Perang Napoleon", "Perdagangan rempah abad ke-16", "Runtuhnya Majapahit"], answer: 0 },
    { q: "Reformasi 1998 di Indonesia terutama dipicu oleh...", options: ["Krisis ekonomi dan tuntutan demokratisasi", "Kemenangan Indonesia di KMB", "Pembentukan ASEAN", "Sukses tanam paksa"], answer: 0 },
    { q: "Peristiwa G30S 1965 berdampak besar pada perubahan politik karena...", options: ["Melemahkan posisi Orde Lama", "Mengembalikan RIS", "Menghapus Pancasila", "Memulai kolonialisme Portugis"], answer: 0 },
    { q: "Masa Pax Romana dalam sejarah Romawi merujuk pada...", options: ["Periode relatif damai dan stabil", "Masa runtuhnya Kekaisaran Romawi Barat", "Perang saudara terus-menerus", "Penaklukan Mongol atas Roma"], answer: 0 },
    { q: "Penyebaran Islam di Nusantara banyak berlangsung melalui jalur...", options: ["Perdagangan dan dakwah", "Invasi Mongol", "Kolonisasi Viking", "Revolusi industri"], answer: 0 },
    { q: "Perang Diponegoro dikenal juga sebagai Perang Jawa yang berlangsung pada tahun...", options: ["1825-1830", "1908-1912", "1945-1949", "1602-1619"], answer: 0 },
  ],
  culture: [
    { q: "Dalam teori budaya populer, 'hegemoni' merujuk pada dominasi yang bekerja terutama melalui...", options: ["Persetujuan sosial dan nilai yang dianggap wajar", "Kekuatan fisik saja", "Larangan membaca media", "Penghapusan seluruh tradisi"], answer: 0 },
    { q: "Film dengan alur tidak kronologis berarti ceritanya disusun dengan...", options: ["Urutan waktu yang dilompat-lompat", "Satu lokasi tetap", "Tokoh tanpa konflik", "Dialog tanpa gambar"], answer: 0 },
    { q: "Dalam musik, sinkopasi adalah penekanan ritme pada...", options: ["Ketukan lemah atau tak terduga", "Nada paling rendah saja", "Akhir setiap lagu", "Lirik yang diulang"], answer: 0 },
    { q: "Anime 'shonen' umumnya menargetkan demografi...", options: ["Remaja laki-laki", "Balita", "Lansia", "Pembaca akademik"], answer: 0 },
    { q: "Istilah 'canon' dalam fandom berarti...", options: ["Informasi resmi dalam cerita", "Teori penggemar yang populer", "Parodi bebas", "Kesalahan produksi"], answer: 0 },
    { q: "Satire dalam karya budaya digunakan untuk...", options: ["Mengkritik lewat humor atau ironi", "Menghapus konflik", "Meniru tanpa komentar", "Menjelaskan resep teknis"], answer: 0 },
    { q: "Gerakan seni Renaissance menekankan kembali pada...", options: ["Humanisme dan warisan klasik", "Abstraksi digital", "Seni gua prasejarah saja", "Penolakan anatomi"], answer: 0 },
    { q: "Dalam sinema, mise-en-scene mencakup...", options: ["Tata visual dalam frame", "Jumlah penonton bioskop", "Harga tiket", "Durasi promosi"], answer: 0 },
    { q: "Fenomena 'viral' di media sosial biasanya terjadi karena...", options: ["Distribusi cepat melalui jaringan pengguna", "Konten disimpan offline", "Tidak ada interaksi pengguna", "Algoritma selalu dimatikan"], answer: 0 },
    { q: "Dalam sastra, intertekstualitas berarti...", options: ["Hubungan makna antara satu teks dan teks lain", "Teks tanpa pengaruh apa pun", "Teks yang hanya berupa angka", "Kesalahan ejaan dalam paragraf"], answer: 0 },
    { q: "Musik blues banyak memengaruhi perkembangan genre...", options: ["Jazz dan rock", "Keroncong abad pertengahan", "Gregorian chant saja", "Gamelan klasik Bali"], answer: 0 },
    { q: "Dalam game, istilah 'ludonarrative dissonance' berarti...", options: ["Ketegangan antara gameplay dan cerita", "Kesalahan kartu grafis", "Mode multiplayer lokal", "Musik yang terlalu keras"], answer: 0 },
    { q: "Pop art dikenal memakai citra dari...", options: ["Konsumsi massal dan iklan", "Naskah kuno saja", "Rumus kimia", "Peta topografi"], answer: 0 },
    { q: "Dalam drama, monolog adalah...", options: ["Tuturan panjang oleh satu tokoh", "Dialog empat tokoh", "Adegan tanpa suara", "Instruksi panggung saja"], answer: 0 },
    { q: "Subkultur berbeda dari budaya dominan karena...", options: ["Memiliki nilai dan gaya khas kelompok tertentu", "Selalu menolak bahasa", "Tidak pernah memakai simbol", "Hanya ada dalam museum"], answer: 0 },
    { q: "Adaptasi film dari novel sering mengubah detail cerita karena...", options: ["Perbedaan medium dan durasi", "Novel tidak punya alur", "Film tidak butuh visual", "Sensor selalu melarang tokoh utama"], answer: 0 },
    { q: "Dalam fotografi, rule of thirds berkaitan dengan...", options: ["Komposisi visual", "Kecepatan internet", "Jenis mikrofon", "Nada musik"], answer: 0 },
    { q: "Kritik budaya terhadap 'cancel culture' biasanya membahas ketegangan antara...", options: ["Akuntabilitas publik dan hukuman sosial berlebihan", "Cuaca dan musik", "Tradisi dan geologi", "Resep dan arsitektur"], answer: 0 },
    { q: "Dalam komik, panel berfungsi untuk...", options: ["Membagi urutan ruang dan waktu cerita", "Mengatur volume suara", "Menentukan harga cetak", "Menghapus narasi"], answer: 0 },
    { q: "Istilah 'remix culture' menunjukkan praktik budaya berupa...", options: ["Mengolah ulang karya lama menjadi bentuk baru", "Melarang referensi", "Menghapus arsip digital", "Membaca teks secara literal saja"], answer: 0 },
  ],
  geography: [
    { q: "Fenomena angin muson di Asia Selatan terutama dipengaruhi oleh...", options: ["Perbedaan tekanan darat dan laut musiman", "Rotasi Bulan", "Arus magma", "Gerhana Matahari"], answer: 0 },
    { q: "Zona subduksi terbentuk ketika...", options: ["Lempeng samudra menunjam ke bawah lempeng lain", "Dua lempeng menjauh tanpa magma", "Atmosfer kehilangan ozon", "Sungai membentuk delta"], answer: 0 },
    { q: "Piramida penduduk ekspansif menunjukkan...", options: ["Angka kelahiran tinggi dan penduduk muda besar", "Penduduk tua dominan", "Migrasi nol", "Kematian bayi tidak ada"], answer: 0 },
    { q: "Dalam interpretasi citra, rona yang lebih gelap pada perairan dalam biasanya menunjukkan...", options: ["Kedalaman lebih besar", "Suhu selalu lebih tinggi", "Vegetasi rapat", "Permukiman padat"], answer: 0 },
    { q: "Garis Wallace memisahkan wilayah fauna...", options: ["Asiatis dan peralihan", "Neartik dan paleartik", "Ethiopian dan neotropik", "Arktik dan antarktik"], answer: 0 },
    { q: "Urbanisasi berlebihan tanpa lapangan kerja cukup dapat menimbulkan...", options: ["Permukiman kumuh", "Curah hujan turun nol", "Tanah menjadi vulkanik", "Abrasi berhenti"], answer: 0 },
    { q: "Siklus batuan menjelaskan bahwa batuan dapat berubah jenis akibat...", options: ["Pelapukan, tekanan, panas, dan pembekuan magma", "Fotosintesis dan respirasi", "Inflasi dan deflasi", "Migrasi penduduk saja"], answer: 0 },
    { q: "El Nino di Indonesia umumnya berkaitan dengan...", options: ["Kondisi lebih kering di banyak wilayah", "Hujan ekstrem merata sepanjang tahun", "Salju tropis", "Gelombang pasang akibat Bulan penuh saja"], answer: 0 },
    { q: "Proyeksi Mercator kurang cocok untuk membandingkan luas wilayah karena...", options: ["Memperbesar wilayah dekat kutub", "Tidak menampilkan garis bujur", "Hanya berlaku untuk Asia", "Menghapus garis pantai"], answer: 0 },
    { q: "Delta sungai terbentuk terutama karena...", options: ["Pengendapan sedimen di muara", "Erupsi gunung api", "Gempa tektonik", "Penguapan danau"], answer: 0 },
    { q: "Klasifikasi iklim Koppen menggunakan dasar utama...", options: ["Suhu dan curah hujan", "Jumlah penduduk", "Jenis batuan", "Ketinggian gedung"], answer: 0 },
    { q: "Wilayah karst umumnya terbentuk pada batuan...", options: ["Kapur atau gamping", "Granit murni", "Basalt segar", "Batu bara"], answer: 0 },
    { q: "Faktor utama penyebab arus laut permukaan adalah...", options: ["Angin global dan efek Coriolis", "Aktivitas fotosintesis", "Rotasi inti Bumi saja", "Migrasi ikan"], answer: 0 },
    { q: "Mitigasi bencana tsunami yang efektif di pesisir meliputi...", options: ["Sistem peringatan dini dan jalur evakuasi", "Menutup semua sungai", "Menghapus vegetasi pantai", "Membangun permukiman di zona merah"], answer: 0 },
    { q: "Konsep aglomerasi industri berarti...", options: ["Konsentrasi kegiatan industri di satu wilayah", "Penyebaran acak tanpa pola", "Larangan industri dekat pasar", "Pertanian berpindah"], answer: 0 },
    { q: "Letak astronomis Indonesia menyebabkan Indonesia memiliki...", options: ["Iklim tropis", "Empat musim salju", "Siang 24 jam sepanjang tahun", "Gurun kutub"], answer: 0 },
    { q: "Erosi lateral sungai paling berperan dalam pembentukan...", options: ["Meander", "Kaldera", "Gumuk pasir", "Terumbu karang"], answer: 0 },
    { q: "Daya dukung lingkungan adalah...", options: ["Kemampuan lingkungan menopang kehidupan", "Jumlah jalan raya", "Luas wilayah administrasi", "Harga lahan kota"], answer: 0 },
    { q: "Data raster dalam SIG tersusun atas...", options: ["Grid piksel", "Titik, garis, dan poligon saja", "Tabel suara", "Urutan narasi"], answer: 0 },
    { q: "Intrusi air laut ke akuifer pantai sering dipicu oleh...", options: ["Pengambilan air tanah berlebihan", "Peningkatan ozon", "Gempa di pegunungan saja", "Hujan meteor"], answer: 0 },
  ],
  sports: [
    { q: "Dalam sepak bola, jebakan offside gagal jika penyerang menerima bola dari...", options: ["Lemparan ke dalam", "Umpan terobosan biasa", "Tendangan bebas tidak langsung", "Operan rekan di area lawan"], answer: 0 },
    { q: "Pada bola basket, pelanggaran travelling terjadi ketika pemain...", options: ["Melangkah tanpa dribble sesuai aturan", "Menembak dari garis bebas", "Melakukan bounce pass", "Mengambil rebound defensif"], answer: 0 },
    { q: "Dalam bulu tangkis nomor tunggal, area servis saat skor server genap berada di...", options: ["Kotak servis kanan", "Kotak servis kiri", "Belakang garis ganda", "Seluruh lapangan"], answer: 0 },
    { q: "Dalam bola voli, sistem rally point berarti...", options: ["Setiap reli menghasilkan poin", "Hanya server mendapat poin", "Poin hanya saat smash", "Poin dihitung tiap dua reli"], answer: 0 },
    { q: "VO2 max dalam olahraga mengukur...", options: ["Kapasitas maksimal penggunaan oksigen", "Kekuatan genggaman", "Kadar gula darah setelah makan", "Jumlah langkah per menit"], answer: 0 },
    { q: "Dalam atletik, start jongkok digunakan terutama pada nomor...", options: ["Sprint", "Marathon", "Jalan cepat", "Lompat tinggi"], answer: 0 },
    { q: "Prinsip overload dalam latihan berarti...", options: ["Beban latihan ditingkatkan bertahap", "Latihan selalu dihentikan", "Hanya latihan teknik ringan", "Makan lebih banyak sebelum tidur"], answer: 0 },
    { q: "Dalam tenis, tie-break umumnya dimainkan untuk menentukan pemenang set ketika skor game...", options: ["6-6", "3-3", "5-0", "7-1"], answer: 0 },
    { q: "Pada renang gaya bebas, teknik pernapasan paling efisien biasanya dilakukan dengan...", options: ["Memutar kepala ke samping", "Mengangkat kepala terus-menerus", "Menahan napas sepanjang lomba", "Bernapas di dalam air"], answer: 0 },
    { q: "Dalam catur, rokade tidak boleh dilakukan jika...", options: ["Raja sedang skak", "Benteng belum bergerak", "Raja dan benteng satu warna", "Belum ada bidak yang dimakan"], answer: 0 },
    { q: "Dalam sepak bola, formasi 4-3-3 menunjukkan jumlah pemain pada lini...", options: ["Belakang, tengah, depan", "Depan, tengah, belakang", "Kiper, belakang, tengah", "Sayap, striker, kiper"], answer: 0 },
    { q: "Dalam pencak silat pertandingan, nilai lebih tinggi diberikan untuk...", options: ["Jatuhan sah", "Langkah mundur", "Salam pembuka", "Keluar gelanggang sendiri"], answer: 0 },
    { q: "Laktat menumpuk saat latihan intensitas tinggi karena tubuh lebih banyak memakai sistem energi...", options: ["Anaerob glikolisis", "Aerob penuh", "Fosfagen pasif", "Pencernaan lemak saja"], answer: 0 },
    { q: "Dalam baseball, force out terjadi ketika...", options: ["Pelari wajib maju dan base disentuh sebelum ia sampai", "Bola keluar stadion", "Pitcher diganti", "Pemukul mendapat walk"], answer: 0 },
    { q: "Pada olahraga panahan, stabilitas tembakan paling dipengaruhi oleh...", options: ["Postur, anchor point, dan follow through", "Warna busur", "Jumlah penonton", "Ukuran papan skor"], answer: 0 },
    { q: "Dalam rugby, try bernilai ketika pemain...", options: ["Meletakkan bola di area in-goal lawan", "Menendang bola ke luar", "Mengganti pemain", "Melakukan scrum tanpa bola"], answer: 0 },
    { q: "Dalam kebugaran, latihan interval efektif meningkatkan...", options: ["Daya tahan kardiovaskular", "Panjang tulang", "Warna otot", "Jumlah sendi"], answer: 0 },
    { q: "Pada tenis meja, servis sah harus membuat bola...", options: ["Memantul di meja sendiri lalu meja lawan", "Langsung ke meja lawan tanpa pantul", "Dipukul dari bawah meja", "Disembunyikan dari penerima"], answer: 0 },
    { q: "Dalam sepak bola modern, pressing tinggi bertujuan untuk...", options: ["Merebut bola dekat area lawan", "Bertahan di kotak penalti sendiri", "Memperlambat tempo tanpa tekanan", "Menghindari duel sama sekali"], answer: 0 },
    { q: "Periodisasi latihan digunakan untuk...", options: ["Mengatur puncak performa pada waktu tertentu", "Menghapus pemanasan", "Melatih satu otot saja sepanjang tahun", "Mengganti teknik dengan keberuntungan"], answer: 0 },
  ],
  tech: [
    { q: "Dalam jaringan, DNS berfungsi untuk...", options: ["Menerjemahkan nama domain menjadi alamat IP", "Mengenkripsi file lokal", "Menghapus cache CPU", "Mengatur brightness layar"], answer: 0 },
    { q: "Algoritma binary search hanya efisien jika data...", options: ["Sudah terurut", "Selalu berupa gambar", "Tidak punya indeks", "Berisi angka negatif saja"], answer: 0 },
    { q: "Kompleksitas waktu O(n log n) sering ditemukan pada algoritma...", options: ["Merge sort", "Linear search", "Bubble sort terburuk", "Akses array indeks langsung"], answer: 0 },
    { q: "Dalam basis data relasional, primary key digunakan untuk...", options: ["Mengidentifikasi baris secara unik", "Menyimpan gambar saja", "Menghapus tabel otomatis", "Mengatur warna antarmuka"], answer: 0 },
    { q: "Prinsip enkripsi asimetris memakai...", options: ["Kunci publik dan kunci privat", "Satu password bersama saja", "Alamat MAC", "Nomor port DNS"], answer: 0 },
    { q: "HTTP status code 404 berarti...", options: ["Resource tidak ditemukan", "Server berhasil memproses", "Akses dilarang karena autentikasi", "Redirect permanen"], answer: 0 },
    { q: "Dalam pemrograman, recursion terjadi ketika fungsi...", options: ["Memanggil dirinya sendiri", "Tidak pernah mengembalikan nilai", "Hanya berisi komentar", "Dijalankan oleh GPU saja"], answer: 0 },
    { q: "Normalisasi database bertujuan utama untuk...", options: ["Mengurangi redundansi dan anomali data", "Memperbesar ukuran file", "Menghapus semua relasi", "Mengganti SQL dengan gambar"], answer: 0 },
    { q: "Protokol TCP berbeda dari UDP karena TCP...", options: ["Menjamin urutan dan reliabilitas pengiriman", "Tidak memakai port", "Selalu lebih cepat tanpa kontrol", "Hanya untuk jaringan lokal"], answer: 0 },
    { q: "Dalam keamanan siber, phishing adalah...", options: ["Penipuan untuk mencuri kredensial", "Mempercepat koneksi internet", "Backup otomatis", "Kompresi video"], answer: 0 },
    { q: "Cache digunakan dalam sistem komputer untuk...", options: ["Mempercepat akses data yang sering dipakai", "Menghapus sistem operasi", "Mendinginkan prosesor", "Mengubah biner menjadi desimal"], answer: 0 },
    { q: "API memungkinkan aplikasi untuk...", options: ["Berkomunikasi memakai antarmuka yang disepakati", "Mengganti seluruh perangkat keras", "Berjalan tanpa kode", "Mencegah semua bug"], answer: 0 },
    { q: "Dalam machine learning, overfitting terjadi ketika model...", options: ["Terlalu cocok pada data latih dan buruk pada data baru", "Tidak pernah belajar pola", "Selalu memakai data kosong", "Hanya memakai satu fitur benar"], answer: 0 },
    { q: "Versi kontrol seperti Git membantu developer untuk...", options: ["Melacak perubahan kode", "Mendesain casing komputer", "Menghapus internet", "Mengganti compiler otomatis"], answer: 0 },
    { q: "Arsitektur client-server berarti...", options: ["Client meminta layanan dan server merespons", "Semua perangkat harus offline", "Database berada di keyboard", "Server hanya menampilkan gambar"], answer: 0 },
    { q: "Dalam logika komputer, gerbang AND menghasilkan 1 jika...", options: ["Semua input bernilai 1", "Salah satu input 1", "Semua input 0", "Input berbeda"], answer: 0 },
    { q: "SQL injection terjadi saat penyerang...", options: ["Menyisipkan perintah SQL berbahaya lewat input", "Memasang RAM baru", "Mengganti kabel HDMI", "Memperbarui driver resmi"], answer: 0 },
    { q: "Virtualisasi memungkinkan satu mesin fisik untuk...", options: ["Menjalankan beberapa mesin virtual", "Menghapus kebutuhan memori", "Menaikkan tegangan listrik rumah", "Mengubah monitor menjadi CPU"], answer: 0 },
    { q: "Representasi biner dari desimal 13 adalah...", options: ["1101", "1011", "1110", "1001"], answer: 0 },
    { q: "Responsive design pada web bertujuan agar tampilan...", options: ["Menyesuaikan berbagai ukuran layar", "Selalu hitam putih", "Tidak bisa digulir", "Hanya berjalan di desktop"], answer: 0 },
  ],
  food: [
    { q: "Fermentasi tempe terutama dibantu oleh kapang dari genus...", options: ["Rhizopus", "Saccharomyces", "Lactobacillus", "Penicillium"], answer: 0 },
    { q: "Reaksi Maillard pada makanan terjadi antara gula pereduksi dan...", options: ["Asam amino", "Air murni", "Vitamin C saja", "Garam dapur"], answer: 0 },
    { q: "Pasteurisasi bertujuan untuk...", options: ["Mengurangi mikroba patogen tanpa sterilisasi total", "Membekukan produk", "Menambah kadar protein", "Mengubah semua lemak menjadi gula"], answer: 0 },
    { q: "Emulsi pada mayones stabil karena adanya emulsifier dari...", options: ["Kuning telur", "Es batu", "Gula pasir", "Tepung beras"], answer: 0 },
    { q: "Gluten terbentuk dari interaksi protein utama pada tepung terigu, yaitu...", options: ["Gliadin dan glutenin", "Kasein dan whey", "Albumin dan keratin", "Kolagen dan elastin"], answer: 0 },
    { q: "Proses karamelisasi berbeda dari Maillard karena karamelisasi terutama melibatkan...", options: ["Pemanasan gula", "Fermentasi protein", "Oksidasi lemak dingin", "Penggumpalan pati mentah"], answer: 0 },
    { q: "Umami umumnya diasosiasikan dengan senyawa...", options: ["Glutamat", "Sukrosa", "Kafein", "Asam askorbat"], answer: 0 },
    { q: "Teknik sous vide memasak bahan dengan cara...", options: ["Vakum pada suhu terkontrol dalam air", "Dibakar langsung di api besar", "Dijemur tanpa panas", "Digoreng kering tanpa minyak"], answer: 0 },
    { q: "Pati mengalami gelatinisasi ketika...", options: ["Granula pati menyerap air panas dan mengembang", "Protein berubah menjadi lemak", "Gula berubah menjadi alkohol", "Air membeku di bawah nol"], answer: 0 },
    { q: "Rancidity pada minyak umumnya disebabkan oleh...", options: ["Oksidasi lemak", "Pembentukan gluten", "Penguapan mineral", "Fermentasi garam"], answer: 0 },
    { q: "Kimchi dan yoghurt sama-sama melibatkan fermentasi oleh...", options: ["Bakteri asam laktat", "Ragi roti saja", "Kapang tempe saja", "Virus bakteriofag"], answer: 0 },
    { q: "Indeks glikemik makanan menunjukkan...", options: ["Seberapa cepat makanan menaikkan gula darah", "Jumlah vitamin larut lemak", "Kadar air dalam sayur", "Tingkat kepedasan cabai"], answer: 0 },
    { q: "Denaturasi protein saat telur dimasak menyebabkan protein...", options: ["Berubah struktur dan menggumpal", "Berubah menjadi karbohidrat", "Menghilang dari makanan", "Menjadi vitamin"], answer: 0 },
    { q: "Metode confit tradisional memasak bahan dengan...", options: ["Lemak pada suhu rendah", "Uap tekanan tinggi", "Asap dingin tanpa panas", "Air garam beku"], answer: 0 },
    { q: "HACCP dalam keamanan pangan berfokus pada...", options: ["Analisis bahaya dan titik kendali kritis", "Dekorasi meja makan", "Penilaian rasa subjektif", "Pemasaran restoran"], answer: 0 },
    { q: "Mise en place dalam dunia kuliner berarti...", options: ["Menyiapkan bahan dan alat sebelum memasak", "Memasak dengan api paling besar", "Mencuci piring setelah makan", "Mengganti resep setiap menit"], answer: 0 },
    { q: "Fermentasi alkohol oleh ragi menghasilkan...", options: ["Etanol dan karbon dioksida", "Garam dan oksigen", "Protein dan nitrogen", "Pati dan lemak"], answer: 0 },
    { q: "Tekstur renyah pada gorengan paling cepat hilang jika terkena...", options: ["Uap air", "Cahaya redup", "Bunyi keras", "Magnet"], answer: 0 },
    { q: "Marinasi dengan bahan asam dapat memengaruhi daging karena...", options: ["Membantu denaturasi protein permukaan", "Mengubah mineral menjadi gula", "Membuat daging steril total", "Menambah tulang baru"], answer: 0 },
    { q: "Dalam gizi, asam amino esensial adalah asam amino yang...", options: ["Tidak cukup diproduksi tubuh dan perlu dari makanan", "Tidak dibutuhkan tubuh", "Hanya ada pada air mineral", "Selalu berbahaya"], answer: 0 },
  ],
  indonesia: [
    { q: "Pasal 33 UUD 1945 terutama mengatur tentang...", options: ["Perekonomian nasional dan kesejahteraan sosial", "Batas usia presiden", "Wilayah provinsi", "Bahasa daerah"], answer: 0 },
    { q: "Makna Bhinneka Tunggal Ika dalam kehidupan berbangsa adalah...", options: ["Persatuan dalam keberagaman", "Keseragaman budaya mutlak", "Dominasi satu suku", "Pemisahan wilayah adat"], answer: 0 },
    { q: "Sila kedua Pancasila menekankan nilai...", options: ["Kemanusiaan yang adil dan beradab", "Ketuhanan saja tanpa sosial", "Musyawarah ekonomi", "Keadilan geografis"], answer: 0 },
    { q: "Indonesia disebut negara kepulauan karena...", options: ["Terdiri dari banyak pulau yang dihubungkan laut", "Hanya memiliki satu pulau besar", "Tidak memiliki wilayah laut", "Seluruh wilayahnya gurun"], answer: 0 },
    { q: "Letak Indonesia di antara dua benua dan dua samudra disebut letak...", options: ["Geografis", "Astronomis", "Geologis", "Geomorfologis"], answer: 0 },
    { q: "Sistem pemerintahan Indonesia menurut UUD 1945 adalah...", options: ["Presidensial", "Monarki absolut", "Parlementer murni", "Teokrasi"], answer: 0 },
    { q: "Otonomi daerah bertujuan untuk...", options: ["Memberi kewenangan daerah mengatur urusan tertentu", "Menghapus pemerintah pusat", "Membubarkan DPRD", "Menyeragamkan semua kebijakan lokal"], answer: 0 },
    { q: "Ciri negara hukum adalah...", options: ["Kekuasaan dibatasi oleh hukum", "Pejabat bebas dari hukum", "Hukum hanya untuk warga biasa", "Pengadilan tidak diperlukan"], answer: 0 },
    { q: "Lembaga yang berwenang menguji undang-undang terhadap UUD 1945 adalah...", options: ["Mahkamah Konstitusi", "Komisi Yudisial", "DPRD", "BPK"], answer: 0 },
    { q: "Fungsi utama DPR dalam sistem ketatanegaraan Indonesia meliputi...", options: ["Legislasi, anggaran, pengawasan", "Yudisial, moneter, militer", "Eksekusi putusan, audit, diplomasi", "Sensor, produksi, distribusi"], answer: 0 },
    { q: "Dampak positif bonus demografi dapat tercapai jika...", options: ["Kualitas pendidikan dan lapangan kerja memadai", "Pengangguran dibiarkan naik", "Kesehatan publik diabaikan", "Produktivitas tenaga kerja turun"], answer: 0 },
    { q: "Kebijakan politik luar negeri Indonesia dikenal dengan prinsip...", options: ["Bebas aktif", "Isolasionis pasif", "Blok tunggal", "Ekspansionis"], answer: 0 },
    { q: "ASEAN didirikan melalui Deklarasi Bangkok pada tahun...", options: ["1967", "1945", "1955", "1998"], answer: 0 },
    { q: "Sumber hukum dasar tertulis tertinggi di Indonesia adalah...", options: ["UUD 1945", "Peraturan desa", "Keputusan RT", "Surat edaran sekolah"], answer: 0 },
    { q: "Wilayah Indonesia rawan gempa karena berada pada pertemuan...", options: ["Beberapa lempeng tektonik besar", "Dua arus sungai utama", "Satu zona gurun tropis", "Sabuk es antarktika"], answer: 0 },
    { q: "Upaya menjaga integrasi nasional di tengah keberagaman adalah...", options: ["Menghargai perbedaan dan menaati konstitusi", "Menyebarkan stereotip", "Menolak dialog", "Mengutamakan suku sendiri selalu"], answer: 0 },
    { q: "Pemilu di Indonesia merupakan wujud dari prinsip...", options: ["Kedaulatan rakyat", "Kekuasaan turun-temurun", "Kolonialisme", "Monopoli partai tunggal"], answer: 0 },
    { q: "Kebebasan berpendapat dalam demokrasi tetap harus disertai...", options: ["Tanggung jawab dan penghormatan hukum", "Hak memfitnah siapa saja", "Larangan kritik", "Kekerasan politik"], answer: 0 },
    { q: "Deklarasi Djuanda 1957 penting karena...", options: ["Menegaskan konsep negara kepulauan Indonesia", "Membentuk VOC", "Menghapus semua provinsi", "Mengganti dasar negara"], answer: 0 },
    { q: "Ketahanan nasional mencakup kemampuan bangsa untuk...", options: ["Menghadapi ancaman, tantangan, hambatan, dan gangguan", "Menghindari semua kerja sama", "Menutup pendidikan", "Menghapus budaya lokal"], answer: 0 },
  ],
  animals: [
    { q: "Ciri utama hewan vertebrata adalah memiliki...", options: ["Tulang belakang", "Eksoskeleton kitin", "Dinding sel", "Klorofil"], answer: 0 },
    { q: "Sistem peredaran darah tertutup berarti darah...", options: ["Selalu mengalir di dalam pembuluh", "Bercampur langsung dengan rongga tubuh", "Tidak melewati jantung", "Mengalir hanya saat bernapas"], answer: 0 },
    { q: "Metamorfosis sempurna ditandai urutan tahap...", options: ["Telur, larva, pupa, imago", "Telur, nimfa, imago", "Larva, imago, telur", "Pupa, telur, nimfa"], answer: 0 },
    { q: "Mamalia monotremata berbeda karena...", options: ["Bertelur tetapi menyusui anaknya", "Tidak memiliki paru-paru", "Berdarah dingin sepenuhnya", "Tidak memiliki tulang belakang"], answer: 0 },
    { q: "Adaptasi paruh burung finch yang berbeda-beda menunjukkan pengaruh...", options: ["Seleksi alam terhadap sumber makanan", "Perubahan musim harian", "Tidak adanya variasi genetik", "Kebutuhan semua burung makan hal sama"], answer: 0 },
    { q: "Hewan poikiloterm mengatur suhu tubuh terutama dengan...", options: ["Mengandalkan suhu lingkungan", "Membakar lemak cokelat terus-menerus", "Berkeringat seperti manusia", "Menjaga suhu selalu konstan"], answer: 0 },
    { q: "Pada serangga, trakea berfungsi untuk...", options: ["Pertukaran gas langsung ke jaringan", "Memompa darah merah", "Mencerna selulosa", "Membentuk tulang belakang"], answer: 0 },
    { q: "Ruminansia dapat mencerna selulosa karena bantuan...", options: ["Mikroorganisme di rumen", "Klorofil di lambung", "Insang tambahan", "Enzim dari paru-paru"], answer: 0 },
    { q: "Mimikri Batesian terjadi ketika spesies tidak berbahaya...", options: ["Menyerupai spesies berbahaya", "Berubah menjadi predator puncak", "Hidup tanpa reproduksi", "Menghasilkan klorofil"], answer: 0 },
    { q: "Kunci dikotomi dalam klasifikasi hewan menggunakan...", options: ["Pasangan ciri yang berlawanan", "Urutan alfabet nama latin", "Ukuran kandang", "Warna latar foto"], answer: 0 },
    { q: "Hewan dalam filum Arthropoda memiliki ciri...", options: ["Tubuh beruas dan kaki berbuku-buku", "Tubuh lunak tanpa organ", "Selalu bertulang rawan", "Tidak mengalami pertumbuhan"], answer: 0 },
    { q: "Simbiosis mutualisme antara lebah dan bunga terjadi karena...", options: ["Lebah mendapat nektar dan bunga terbantu penyerbukan", "Lebah merusak bunga tanpa manfaat", "Bunga memakan lebah", "Keduanya tidak terpengaruh"], answer: 0 },
    { q: "Pada ikan, gurat sisi berfungsi untuk...", options: ["Mendeteksi getaran dan gerakan air", "Mengunyah makanan", "Menghasilkan telur", "Mengatur warna sisik"], answer: 0 },
    { q: "Burung memiliki kantong udara yang membantu...", options: ["Efisiensi pernapasan saat terbang", "Mencerna batu", "Mengubah bulu menjadi sisik", "Menyimpan darah"], answer: 0 },
    { q: "Hibernasi merupakan adaptasi untuk...", options: ["Menghemat energi saat kondisi lingkungan ekstrem", "Mempercepat pembelahan sel tanpa batas", "Menghindari reproduksi selamanya", "Mengubah makanan menjadi cahaya"], answer: 0 },
    { q: "Koral membentuk hubungan mutualisme dengan alga zooxanthellae karena alga...", options: ["Menyediakan hasil fotosintesis", "Menghasilkan tulang belakang", "Memburu plankton besar", "Mengubah air laut menjadi tawar"], answer: 0 },
    { q: "Pada rantai makanan, predator puncak biasanya memiliki...", options: ["Sedikit pemangsa alami", "Energi paling besar dari semua tingkat", "Peran sebagai produsen", "Kemampuan fotosintesis"], answer: 0 },
    { q: "Spesies invasif berbahaya bagi ekosistem lokal karena dapat...", options: ["Mengalahkan spesies asli dalam kompetisi", "Selalu meningkatkan biodiversitas", "Tidak pernah bereproduksi", "Menjadi produsen utama"], answer: 0 },
    { q: "Nama ilmiah hewan ditulis dengan sistem binomial yang terdiri dari...", options: ["Genus dan spesies", "Famili dan ordo", "Kelas dan filum", "Kingdom dan domain"], answer: 0 },
    { q: "Perilaku migrasi pada hewan sering dipicu oleh...", options: ["Perubahan musim, makanan, atau reproduksi", "Keinginan acak tanpa pola", "Hilangnya seluruh insting", "Larangan bergerak"], answer: 0 },
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
