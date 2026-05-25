import React, { useEffect, useMemo, useRef, useState } from "react";
import "./style.css";

const QUESTION_COUNT = 6;

const GENRES = [
  { id: "general", label: "Random", icon: "?" },
  { id: "science", label: "Science", icon: "i" },
  { id: "history", label: "History", icon: "#" },
  { id: "culture", label: "Pop Culture", icon: "*" },
];

const DIFFICULTIES = [
  { id: "easy", label: "Santai", seconds: 18, points: 100 },
  { id: "normal", label: "Normal", seconds: 14, points: 140 },
  { id: "hard", label: "Ngebut", seconds: 10, points: 190 },
];

const COLORS = ["#ffcf4a", "#53d6c3", "#ff7a90", "#8ba7ff", "#9be564", "#f49d37"];

const DEFAULT_MASCOTS = [
  { id: "yay", name: "Yay", src: "/mascots/mascot-1.png", fallback: "Y" },
  { id: "pop", name: "Pop", src: "/mascots/mascot-2.png", fallback: "P" },
  { id: "zap", name: "Zap", src: "/mascots/mascot-3.png", fallback: "Z" },
  { id: "neo", name: "Neo", src: "/mascots/mascot-4.png", fallback: "N" },
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
  ],
};

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
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
  const [mascotId, setMascotId] = useState("yay");
  const [color, setColor] = useState(COLORS[0]);
  const [round, setRound] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(14);
  const [picked, setPicked] = useState(null);
  const [locked, setLocked] = useState(false);
  const timerRef = useRef(null);

  const difficultyMeta = DIFFICULTIES.find((item) => item.id === difficulty) ?? DIFFICULTIES[1];
  const mascot = DEFAULT_MASCOTS.find((item) => item.id === mascotId) ?? DEFAULT_MASCOTS[0];
  const current = round[index];
  const progress = round.length ? ((index + 1) / round.length) * 100 : 0;

  const bestScore = useMemo(() => Number(localStorage.getItem("triviyay-best") || 0), [screen]);

  const stopTimer = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
  };

  const startGame = () => {
    const nextQuestions = shuffle(QUESTIONS[genre]).slice(0, QUESTION_COUNT);
    setRound(nextQuestions);
    setIndex(0);
    setScore(0);
    setPicked(null);
    setLocked(false);
    setTimeLeft(difficultyMeta.seconds);
    setScreen("game");
  };

  const finishAnswer = (choice) => {
    if (!current || locked) return;

    stopTimer();
    setPicked(choice);
    setLocked(true);

    const correct = choice === current.answer;
    if (correct) {
      const speedBonus = Math.round((timeLeft / difficultyMeta.seconds) * 45);
      setScore((value) => value + difficultyMeta.points + speedBonus);
    }

    window.setTimeout(() => {
      if (index + 1 >= round.length) {
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
    if (screen !== "game" || locked) return undefined;

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
  }, [screen, index, locked, difficulty]);

  return (
    <main className="app-shell">
      <section className="phone-frame">
        {screen === "home" && (
          <div className="screen home-screen">
            <header className="brand-block">
              <Mascot mascot={mascot} color={color} className="hero-mascot" />
              <p className="eyebrow">Mobile quiz game</p>
              <h1>TriviYAY</h1>
              <p className="subtitle">Jawab cepat, kumpulin skor, terus ganti maskot sesuka lu.</p>
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
              <button className="primary-btn" onClick={() => setScreen("setup")}>
                <span className="btn-icon">▶</span>
                Main
              </button>
              <button className="ghost-btn" onClick={() => setScreen("customize")}>
                <span className="btn-icon">✦</span>
                Custom Maskot
              </button>
            </div>
          </div>
        )}

        {screen === "setup" && (
          <div className="screen">
            <button className="back-btn" onClick={() => setScreen("home")}>‹ Back</button>
            <h2>Setup Game</h2>

            <p className="section-label">Genre</p>
            <div className="option-grid">
              {GENRES.map((item) => (
                <button
                  key={item.id}
                  className={`option-card ${genre === item.id ? "active" : ""}`}
                  onClick={() => setGenre(item.id)}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            <p className="section-label">Difficulty</p>
            <div className="difficulty-list">
              {DIFFICULTIES.map((item) => (
                <button
                  key={item.id}
                  className={`difficulty-row ${difficulty === item.id ? "active" : ""}`}
                  onClick={() => setDifficulty(item.id)}
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
            <button className="back-btn" onClick={() => setScreen("home")}>‹ Back</button>
            <h2>Custom Maskot</h2>
            <p className="hint">Taruh gambar lu di <code>public/mascots</code>, lalu pakai nama file <code>mascot-1.png</code> sampai <code>mascot-4.png</code>.</p>

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
                  onClick={() => setMascotId(item.id)}
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
                  onClick={() => setColor(item)}
                />
              ))}
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
            </header>

            <div className="progress-track">
              <div style={{ width: `${progress}%` }} />
            </div>

            <p className="question-count">Soal {index + 1} dari {round.length}</p>
            <h2 className="question-text">{current.q}</h2>

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
              <button className="ghost-btn" onClick={() => setScreen("home")}>
                <span className="btn-icon">⌂</span>
                Home
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
