import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const WORD_POOL = [
  "the","be","to","of","and","a","in","that","have","it","for","not","on","with",
  "he","as","you","do","at","this","but","his","by","from","they","we","say","her",
  "she","or","an","will","my","one","all","would","there","their","what","so","up",
  "out","if","about","who","get","which","go","me","when","make","can","like","time",
  "no","just","him","know","take","people","into","year","your","good","some","could",
  "them","see","other","than","then","now","look","only","come","its","over","think",
  "also","back","after","use","two","how","our","work","first","well","way","even",
  "new","want","because","any","these","give","day","most","us","great","between",
  "need","large","often","hand","high","place","hold","world","found","still","learn",
  "plant","cover","food","sun","four","between","state","keep","eye","never","last",
  "let","thought","city","tree","cross","farm","hard","start","might","story","saw",
  "far","sea","draw","left","late","run","don't","while","press","close","night",
  "real","life","few","north","open","seem","together","next","white","children",
  "begin","got","walk","example","ease","paper","group","always","music","those",
  "both","mark","book","letter","until","mile","river","car","feet","care","second",
  "enough","plain","girl","usual","young","ready","above","ever","red","list","though",
  "feel","talk","bird","soon","body","dog","family","direct","pose","leave"
];

const LESSONS = [
  {
    id: 1, title: "Home Row — Left Hand", subtitle: "asdf",
    fingers: { a: "pinky", s: "ring", d: "middle", f: "index" },
    chars: "asdf",
    desc: "Place your left hand on the home row. Your pinky rests on A, ring on S, middle on D, and index on F.",
    practice: ["asdf fdsa asdf fdsa", "ffdd ssaa ffdd ssaa", "afsd dfsa afsd dfsa", "aaaa ssss dddd ffff", "asdf asdf asdf asdf"],
    highlight: ["a","s","d","f"]
  },
  {
    id: 2, title: "Home Row — Right Hand", subtitle: "jkl;",
    fingers: { j: "index", k: "middle", l: "ring", ";": "pinky" },
    chars: "jkl;",
    desc: "Place your right hand on the home row. Index on J, middle on K, ring on L, and pinky on semicolon.",
    practice: ["jkl; ;lkj jkl; ;lkj", "jjkk ll;; jjkk ll;;", "j;lk kl;j j;lk kl;j", "jjjj kkkk llll ;;;;", "jkl; jkl; jkl; jkl;"],
    highlight: ["j","k","l",";"]
  },
  {
    id: 3, title: "Both Hands Together", subtitle: "asdf jkl;",
    fingers: {},
    chars: "asdf jkl;",
    desc: "Now combine both hands on the home row! Keep your wrists relaxed and fingers curved.",
    practice: ["fjdk slak fjdk slak", "adkl fjs; adkl fjs;", "ask; fjd; ask; fjd;", "flask jkda flask jkda", "as jk df l; as jk df l;"],
    highlight: ["a","s","d","f","j","k","l",";"]
  },
  {
    id: 4, title: "Left Index — G and H", subtitle: "fg gh",
    fingers: { g: "left index stretch", h: "right index stretch" },
    chars: "fgh",
    desc: "Your left index stretches inward to reach G. Your right index stretches inward to reach H.",
    practice: ["fig fog flag", "gag had has", "half glad", "flag fog glass", "golf hash flag"],
    highlight: ["g","h","f"]
  },
  {
    id: 5, title: "Top Row — Left: qwer", subtitle: "qwer",
    fingers: { q: "pinky", w: "ring", e: "middle", r: "index" },
    chars: "qwer",
    desc: "Reach up with your left hand. Pinky to Q, ring to W, middle to E, index to R.",
    practice: ["were qrew were qrew", "red wed red wed", "rew qwe rew qwe", "week reef drew", "werq qrew werq qrew"],
    highlight: ["q","w","e","r"]
  },
  {
    id: 6, title: "Top Row — Right: uiop", subtitle: "uiop",
    fingers: { u: "index", i: "middle", o: "ring", p: "pinky" },
    chars: "uiop",
    desc: "Reach up with your right hand. Index to U, middle to I, ring to O, pinky to P.",
    practice: ["pour quit pour quit", "oil put oil put", "upon loop upon loop", "opium uproot pious", "uiop poiu uiop poiu"],
    highlight: ["u","i","o","p"]
  },
  {
    id: 7, title: "Common Words — Home Row", subtitle: "real words",
    fingers: {},
    chars: "asdfjkl;",
    desc: "Let's practice real words using home row keys! Flow from letter to letter smoothly.",
    practice: ["fall disk lake sale", "flask slak jade safe", "lads falls jades asks", "flask slab dad lad", "all ask fad jab skal"],
    highlight: ["a","s","d","f","j","k","l",";"]
  },
  {
    id: 8, title: "Bottom Row — Left: zxcv", subtitle: "zxcv",
    fingers: { z: "pinky", x: "ring", c: "middle", v: "index" },
    chars: "zxcv",
    desc: "Curl your left fingers down. Pinky to Z, ring to X, middle to C, index to V.",
    practice: ["vex zap cab vex zap", "cave vex czar cave", "vice versa cave vex", "zinc vex czar cave", "zvcx xvcz zvcx xvcz"],
    highlight: ["z","x","c","v"]
  },
  {
    id: 9, title: "Bottom Row — Right: nm,.", subtitle: "nm,.",
    fingers: { n: "index", m: "index", ",": "middle", ".": "ring" },
    chars: "nm,.",
    desc: "Curl your right fingers down. Index covers N and M, middle to comma, ring to period.",
    practice: ["man nun man nun", "main moon main moon", "now men now men", "noon name noon name", "many men noon name"],
    highlight: ["n","m",",","."]
  },
  {
    id: 10, title: "Numbers — Left: 12345", subtitle: "12345",
    fingers: { "1": "pinky", "2": "ring", "3": "middle", "4": "index", "5": "index stretch" },
    chars: "12345",
    desc: "Stretch your left hand up to the number row. Pinky reaches 1, ring to 2, middle to 3, index to 4 and 5.",
    practice: ["1234 5432 1234 5432", "1122 3344 55 1122", "51423 12345 51423", "54321 12345 54321", "1 2 3 4 5 4 3 2 1"],
    highlight: ["1","2","3","4","5"]
  },
  {
    id: 11, title: "Numbers — Right: 67890", subtitle: "67890",
    fingers: { "6": "index stretch", "7": "index", "8": "middle", "9": "ring", "0": "pinky" },
    chars: "67890",
    desc: "Stretch your right hand up to the number row. Index covers 6 and 7, middle to 8, ring to 9, pinky to 0.",
    practice: ["6789 0987 6789 0987", "6677 8899 00 6677", "60789 67890 60789", "09876 67890 09876", "6 7 8 9 0 9 8 7 6"],
    highlight: ["6","7","8","9","0"]
  },
  {
    id: 12, title: "Capital Letters", subtitle: "Shift key",
    fingers: {},
    chars: "ASDFJKL",
    desc: "Use your OPPOSITE pinky to hold Shift while pressing the letter. Left pinky for right-hand keys; right pinky for left-hand keys.",
    practice: ["The Flag Fell", "Ask Dad", "Jake Sold Flasks", "Safe Desk Flag", "All Fall Down"],
    highlight: []
  },
  {
    id: 13, title: "Common Short Words", subtitle: "real sentences",
    fingers: {},
    chars: "",
    desc: "Type these common short words quickly. Focus on rhythm over speed at first.",
    practice: [
      "the and for are but not you all can her was one our out day",
      "get has him his how man new now old see two way who boy did",
      "its let put say she too use",
      "after again air also back ball been call came come door draw",
      "does each face fact fall feel feet fell felt fill find fine"
    ],
    highlight: []
  },
  {
    id: 14, title: "Punctuation & Flow", subtitle: ". , ; : ! ?",
    fingers: { ".": "right ring", ",": "right middle", ";": "right pinky", ":": "shift + right pinky", "!": "shift + left pinky", "?": "shift + right pinky" },
    chars: ".,;:!?",
    desc: "Punctuation keeps your right pinky busy! Comma and period are nearby — practice smooth transitions.",
    practice: [
      "Hello, world! How are you?",
      "Run fast; don't stop. Keep going!",
      "Yes, no, maybe. Let's see!",
      "Wait... is that it? Yes!",
      "Come here. Go there. Stop now."
    ],
    highlight: [",",".",";"," ","!","?"]
  },
  {
    id: 15, title: "Full Speed Run", subtitle: "all keys",
    fingers: {},
    chars: "",
    desc: "You've learned all keys! Now put it all together. Focus on accuracy first, then build speed naturally.",
    practice: [
      "the quick brown fox jumps over the lazy dog",
      "pack my box with five dozen liquor jugs",
      "how quickly daft jumping zebras vex",
      "sphinx of black quartz judge my vow",
      "waltz nymph for quick jigs vex bud"
    ],
    highlight: []
  }
];

// ─── KEYBOARD LAYOUT ────────────────────────────────────────────────────────

const KEYBOARD_ROWS = [
  ["`","1","2","3","4","5","6","7","8","9","0","-","=","⌫"],
  ["⇥","q","w","e","r","t","y","u","i","o","p","[","]","\\"],
  ["⌃","a","s","d","f","g","h","j","k","l",";","'","↵"],
  ["⇧","z","x","c","v","b","n","m",",",".","/","⇧"],
  ["","","space","",""]
];

const FINGER_COLORS = {
  pinky:  "#e05a5a",
  ring:   "#e0a05a",
  middle: "#5ac45a",
  index:  "#5a9ae0",
  thumb:  "#9a5ae0",
};

const KEY_FINGER_MAP = {
  "`":  "left pinky",  "1": "left pinky",  "q": "left pinky",   "a": "left pinky",   "z": "left pinky",
  "2":  "left ring",   "w": "left ring",   "s": "left ring",    "x": "left ring",
  "3":  "left middle", "e": "left middle", "d": "left middle",  "c": "left middle",
  "4":  "left index",  "r": "left index",  "f": "left index",   "v": "left index",
  "5":  "left index",  "t": "left index",  "g": "left index",   "b": "left index",
  "6":  "right index", "y": "right index", "h": "right index",  "n": "right index",
  "7":  "right index", "u": "right index", "j": "right index",  "m": "right index",
  "8":  "right middle","i": "right middle","k": "right middle",  ",": "right middle",
  "9":  "right ring",  "o": "right ring",  "l": "right ring",   ".": "right ring",
  "0":  "right pinky", "p": "right pinky", ";": "right pinky",  "/": "right pinky",
  "-":  "right pinky", "[": "right pinky", "'": "right pinky",
  "=":  "right pinky", "]": "right pinky",
  " ":  "thumb", "space": "thumb",
};

const FINGER_COLOR_BY_MAP = {
  "left pinky": FINGER_COLORS.pinky,
  "left ring": FINGER_COLORS.ring,
  "left middle": FINGER_COLORS.middle,
  "left index": FINGER_COLORS.index,
  "right index": FINGER_COLORS.index,
  "right middle": FINGER_COLORS.middle,
  "right ring": FINGER_COLORS.ring,
  "right pinky": FINGER_COLORS.pinky,
  "thumb": FINGER_COLORS.thumb,
};

function getKeyColor(key, highlightKeys, activeKey) {
  const k = key.toLowerCase();
  if (key === "space") return activeKey === " " ? "#5a9ae0" : (highlightKeys.includes(" ") ? "#5a9ae055" : null);
  if (activeKey && activeKey.toLowerCase() === k) return "#5a9ae0";
  if (highlightKeys.length && highlightKeys.map(h=>h.toLowerCase()).includes(k)) {
    const finger = KEY_FINGER_MAP[k];
    return finger ? FINGER_COLOR_BY_MAP[finger] + "66" : "#ffffff22";
  }
  return null;
}

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function Keyboard({ highlightKeys = [], activeKey = null }) {
  return (
    <div style={{ width: "100%", maxWidth: 680, margin: "0 auto" }}>
      {KEYBOARD_ROWS.map((row, ri) => (
        <div key={ri} style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 4 }}>
          {row.map((key, ki) => {
            const bg = getKeyColor(key, highlightKeys, activeKey);
            const isWide = key === "⌫" || key === "⇥" || key === "⌃" || key === "↵" || key === "⇧";
            const isSpace = key === "space";
            const isTiny = key === "" || key === "⊞";
            if (isTiny) return <div key={ki} style={{ width: 20 }} />;
            return (
              <div key={ki} style={{
                background: bg || "rgba(255,255,255,0.08)",
                border: bg ? `1.5px solid ${bg}` : "1.5px solid rgba(255,255,255,0.12)",
                borderRadius: 6,
                width: isSpace ? 240 : isWide ? 60 : 40,
                height: 38,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: isSpace ? 11 : 12,
                color: bg ? "#fff" : "rgba(255,255,255,0.7)",
                fontFamily: "monospace",
                transition: "background 0.15s",
                userSelect: "none",
                flexShrink: 0,
              }}>
                {isSpace ? "SPACE" : key}
              </div>
            );
          })}
        </div>
      ))}
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 10, flexWrap: "wrap" }}>
        {Object.entries(FINGER_COLORS).map(([name, color]) => (
          <div key={name} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "capitalize" }}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 12, padding: "14px 20px", textAlign: "center", minWidth: 100
    }}>
      <div style={{ fontSize: 26, fontWeight: 700, color: color || "#00ff9d", fontFamily: "monospace" }}>{value}</div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{label}</div>
    </div>
  );
}

// ─── MONKEY TYPE MODE ────────────────────────────────────────────────────────

function generateText(count = 50) {
  let words = [];
  for (let i = 0; i < count; i++) words.push(WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)]);
  return words.join(" ");
}

function MonkeyMode({ onBack }) {
  const [duration, setDuration] = useState(30);
  const [phase, setPhase] = useState("config"); // config | test | result
  const [text, setText] = useState("");
  const [typed, setTyped] = useState("");
  const [time, setTime] = useState(30);
  const [started, setStarted] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const inputRef = useRef(null);
  const intervalRef = useRef(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const wordsRef = useRef([]);
  const charsRef = useRef({ correct: 0, wrong: 0 });

  const startTest = (dur) => {
    const t = generateText(120);
    setText(t);
    wordsRef.current = t.split(" ");
    setTyped("");
    setTime(dur || duration);
    setStarted(false);
    setMistakes(0);
    charsRef.current = { correct: 0, wrong: 0 };
    setPhase("test");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    if (!started || phase !== "test") return;
    intervalRef.current = setInterval(() => {
      setTime(p => {
        if (p <= 1) { clearInterval(intervalRef.current); finishTest(); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [started, phase]);

  const finishTest = useCallback(() => {
    clearInterval(intervalRef.current);
    setPhase("result");
  }, []);

  const handleInput = (e) => {
    const val = e.target.value;
    if (!started && val.length > 0) setStarted(true);
    const last = val[val.length - 1];
    if (last) { setActiveKey(last); setTimeout(() => setActiveKey(null), 120); }
    // track chars
    if (val.length > typed.length) {
      const idx = val.length - 1;
      if (text[idx] === val[idx]) charsRef.current.correct++;
      else { charsRef.current.wrong++; setMistakes(m => m + 1); }
    }
    setTyped(val);
    // current word index for highlighting
    const spacesBefore = val.split("").filter((c,i) => c === " " && text[i] === " ").length;
    setWordIndex(spacesBefore);
  };

  // render text with coloring
  const renderText = () => {
    const chars = text.split("").slice(0, typed.length + 80);
    return chars.map((ch, i) => {
      let color = "rgba(255,255,255,0.25)";
      if (i < typed.length) color = typed[i] === ch ? "#00ff9d" : "#ff4d6d";
      if (i === typed.length) color = "#fff";
      return <span key={i} style={{ color, borderBottom: i === typed.length ? "2px solid #00ff9d" : "none" }}>{ch}</span>;
    });
  };

  const wpm = phase === "result"
    ? Math.round((charsRef.current.correct / 5) / ((duration - time || duration) / 60))
    : Math.round((charsRef.current.correct / 5) / Math.max((duration - time), 1) * 60);
  const acc = charsRef.current.correct + charsRef.current.wrong > 0
    ? Math.round(charsRef.current.correct / (charsRef.current.correct + charsRef.current.wrong) * 100) : 100;

  if (phase === "config") return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ color: "#00ff9d", marginBottom: 8 }}>⌨ Monkey Type Mode</h2>
      <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 32 }}>Random words — how fast can you go?</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
        {[15, 30, 60, 120].map(d => (
          <button key={d} onClick={() => setDuration(d)} style={{
            background: duration === d ? "#00ff9d" : "rgba(255,255,255,0.07)",
            color: duration === d ? "#000" : "#fff",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 20, padding: "8px 22px", cursor: "pointer", fontSize: 15, fontWeight: 600
          }}>{d}s</button>
        ))}
      </div>
      <button onClick={() => startTest(duration)} style={{
        background: "#00ff9d", color: "#000", border: "none", borderRadius: 30,
        padding: "14px 44px", fontSize: 16, fontWeight: 700, cursor: "pointer"
      }}>Start Test</button>
    </div>
  );

  if (phase === "result") return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ color: "#00ff9d", marginBottom: 20 }}>Results 📊</h2>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
        <StatBox label="WPM" value={wpm} color="#00ff9d" />
        <StatBox label="Accuracy" value={acc + "%"} color="#5a9ae0" />
        <StatBox label="Mistakes" value={mistakes} color="#ff4d6d" />
        <StatBox label="Duration" value={duration + "s"} color="#e0a05a" />
      </div>
      <div style={{ marginBottom: 16 }}>
        {wpm >= 80 ? "🚀 Incredible speed!" : wpm >= 50 ? "💪 Great job!" : wpm >= 30 ? "👍 Keep practicing!" : "🎯 Focus on accuracy first!"}
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={() => startTest(duration)} style={{
          background: "#00ff9d", color: "#000", border: "none", borderRadius: 20,
          padding: "10px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer"
        }}>Try Again</button>
        <button onClick={() => setPhase("config")} style={{
          background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 20, padding: "10px 28px", fontSize: 14, cursor: "pointer"
        }}>Change Settings</button>
        <button onClick={onBack} style={{
          background: "transparent", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20, padding: "10px 28px", fontSize: 14, cursor: "pointer"
        }}>Main Menu</button>
      </div>
    </div>
  );

  return (
    <div>
      {/* Stats bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 20 }}>
          <span style={{ color: "#00ff9d", fontWeight: 700, fontSize: 18 }}>{time}s</span>
          <span style={{ color: "#5a9ae0" }}>{wpm} wpm</span>
          <span style={{ color: acc < 90 ? "#ff4d6d" : "rgba(255,255,255,0.6)" }}>{acc}% acc</span>
        </div>
        <button onClick={finishTest} style={{ background: "transparent", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "4px 12px", cursor: "pointer", fontSize: 12 }}>End</button>
      </div>

      {/* Text display */}
      <div style={{
        fontFamily: "monospace", fontSize: 20, lineHeight: "2rem",
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12, padding: "20px 24px", marginBottom: 16,
        maxHeight: 120, overflow: "hidden", letterSpacing: 1
      }}>
        {renderText()}
      </div>

      {/* Hidden input */}
      <input ref={inputRef} value={typed} onChange={handleInput}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 1, height: 1 }}
        autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
      />
      <div onClick={() => inputRef.current?.focus()} style={{
        textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 13,
        cursor: "text", padding: "8px 0", marginBottom: 20
      }}>
        {started ? "Keep typing..." : "Click here or start typing to begin"}
      </div>

      <Keyboard highlightKeys={[]} activeKey={activeKey} />
    </div>
  );
}

// ─── LESSON MODE ─────────────────────────────────────────────────────────────

function LessonMode({ onBack }) {
  const [selected, setSelected] = useState(null);
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState("intro"); // intro | practice | done
  const [mistakes, setMistakes] = useState(0);
  const [activeKey, setActiveKey] = useState(null);
  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tn_completed") || "[]"); } catch { return []; }
  });
  const inputRef = useRef(null);

  const lesson = LESSONS[selected];

  const saveCompleted = (id) => {
    const next = [...new Set([...completed, id])];
    setCompleted(next);
    try { localStorage.setItem("tn_completed", JSON.stringify(next)); } catch {}
  };

  const startLesson = (idx) => {
    setSelected(idx);
    setPracticeIdx(0);
    setTyped("");
    setMistakes(0);
    setPhase("intro");
  };

  const startPractice = () => {
    setPhase("practice");
    setTyped("");
    setMistakes(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleInput = (e) => {
    const val = e.target.value;
    const target = lesson.practice[practiceIdx];
    if (val.length > target.length) return;
    const last = val[val.length - 1];
    if (last) { setActiveKey(last); setTimeout(() => setActiveKey(null), 120); }
    if (val.length > typed.length) {
      const idx = val.length - 1;
      if (val[idx] !== target[idx]) setMistakes(m => m + 1);
    }
    setTyped(val);
    if (val === target) {
      if (practiceIdx < lesson.practice.length - 1) {
        setTimeout(() => { setPracticeIdx(i => i + 1); setTyped(""); inputRef.current?.focus(); }, 400);
      } else {
        saveCompleted(lesson.id);
        setTimeout(() => setPhase("done"), 400);
      }
    }
  };

  if (selected === null) {
    return (
      <div>
        <h2 style={{ color: "#00ff9d", textAlign: "center", marginBottom: 8 }}>📚 15 Typing Lessons</h2>
        <p style={{ color: "rgba(255,255,255,0.45)", textAlign: "center", marginBottom: 24, fontSize: 14 }}>
          Learn finger positions, row by row. Complete each lesson to unlock your potential.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 10 }}>
          {LESSONS.map((l, i) => {
            const done = completed.includes(l.id);
            return (
              <button key={l.id} onClick={() => startLesson(i)} style={{
                background: done ? "rgba(0,255,157,0.08)" : "rgba(255,255,255,0.04)",
                border: done ? "1px solid rgba(0,255,157,0.3)" : "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12, padding: "14px 16px", cursor: "pointer", textAlign: "left",
                transition: "all 0.2s"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{
                    background: done ? "#00ff9d" : "rgba(255,255,255,0.1)",
                    color: done ? "#000" : "rgba(255,255,255,0.5)",
                    width: 24, height: 24, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, flexShrink: 0
                  }}>{done ? "✓" : l.id}</span>
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{l.title}</span>
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>{l.subtitle}</div>
              </button>
            );
          })}
        </div>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button onClick={onBack} style={{
            background: "transparent", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20, padding: "8px 24px", fontSize: 13, cursor: "pointer"
          }}>← Main Menu</button>
        </div>
      </div>
    );
  }

  if (phase === "intro") return (
    <div>
      <button onClick={() => setSelected(null)} style={{ background: "transparent", color: "rgba(255,255,255,0.4)", border: "none", cursor: "pointer", fontSize: 13, marginBottom: 16 }}>← All Lessons</button>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>Lesson {lesson.id} of 15</div>
        <h2 style={{ color: "#00ff9d", marginBottom: 6 }}>{lesson.title}</h2>
        <div style={{ fontFamily: "monospace", fontSize: 22, color: "#5a9ae0", marginBottom: 12, letterSpacing: 4 }}>{lesson.subtitle}</div>
        <p style={{ color: "rgba(255,255,255,0.65)", maxWidth: 480, margin: "0 auto 20px" }}>{lesson.desc}</p>
      </div>

      {/* Finger guide */}
      {Object.keys(lesson.fingers).length > 0 && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
          {Object.entries(lesson.fingers).map(([key, finger]) => {
            const color = FINGER_COLORS[finger.split(" ").pop()] || "#888";
            return (
              <div key={key} style={{
                background: color + "22", border: `1.5px solid ${color}66`,
                borderRadius: 10, padding: "8px 14px", textAlign: "center"
              }}>
                <div style={{ fontFamily: "monospace", fontSize: 20, color: color, fontWeight: 700 }}>{key.toUpperCase()}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "capitalize" }}>{finger}</div>
              </div>
            );
          })}
        </div>
      )}

      <Keyboard highlightKeys={lesson.highlight} activeKey={null} />

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button onClick={startPractice} style={{
          background: "#00ff9d", color: "#000", border: "none", borderRadius: 30,
          padding: "13px 40px", fontSize: 15, fontWeight: 700, cursor: "pointer"
        }}>Start Practice ({lesson.practice.length} exercises)</button>
      </div>
    </div>
  );

  if (phase === "done") return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
      <h2 style={{ color: "#00ff9d", marginBottom: 8 }}>Lesson Complete!</h2>
      <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>{lesson.title} — you nailed it!</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        {selected < LESSONS.length - 1 && (
          <button onClick={() => startLesson(selected + 1)} style={{
            background: "#00ff9d", color: "#000", border: "none", borderRadius: 20,
            padding: "11px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer"
          }}>Next Lesson →</button>
        )}
        <button onClick={() => startLesson(selected)} style={{
          background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 20, padding: "11px 28px", fontSize: 14, cursor: "pointer"
        }}>Retry</button>
        <button onClick={() => setSelected(null)} style={{
          background: "transparent", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20, padding: "11px 28px", fontSize: 14, cursor: "pointer"
        }}>All Lessons</button>
      </div>
    </div>
  );

  // practice phase
  const target = lesson.practice[practiceIdx];
  return (
    <div>
      <button onClick={() => setPhase("intro")} style={{ background: "transparent", color: "rgba(255,255,255,0.4)", border: "none", cursor: "pointer", fontSize: 13, marginBottom: 16 }}>← Back to Intro</button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Exercise {practiceIdx + 1} / {lesson.practice.length}</div>
        <div style={{ display: "flex", gap: 12 }}>
          <span style={{ color: "#ff4d6d", fontSize: 13 }}>✗ {mistakes}</span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>{Math.round(typed.length / target.length * 100)}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4, marginBottom: 20 }}>
        <div style={{ height: "100%", width: `${(practiceIdx / lesson.practice.length) * 100}%`, background: "#00ff9d", borderRadius: 4, transition: "width 0.4s" }} />
      </div>

      {/* Text to type */}
      <div style={{
        fontFamily: "monospace", fontSize: 22, lineHeight: "2.4rem", letterSpacing: 2,
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12, padding: "20px 24px", marginBottom: 16, minHeight: 80
      }}>
        {target.split("").map((ch, i) => {
          let color = "rgba(255,255,255,0.25)";
          if (i < typed.length) color = typed[i] === ch ? "#00ff9d" : "#ff4d6d";
          if (i === typed.length) color = "#fff";
          return (
            <span key={i} style={{
              color,
              borderBottom: i === typed.length ? "2px solid #00ff9d" : "none",
              background: i < typed.length && typed[i] !== ch ? "rgba(255,77,109,0.15)" : "transparent"
            }}>{ch}</span>
          );
        })}
      </div>

      <input ref={inputRef} value={typed} onChange={handleInput}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 1, height: 1 }}
        autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
      />
      <div onClick={() => inputRef.current?.focus()} style={{
        textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 12, cursor: "text", marginBottom: 20
      }}>Click to focus</div>

      <Keyboard highlightKeys={lesson.highlight} activeKey={activeKey} />
    </div>
  );
}

// ─── SPEED TEST (timed paragraph) ────────────────────────────────────────────

const PARAGRAPHS = [
  "The quick brown fox jumps over the lazy dog near the river bank. A soft breeze blew through the tall grass as birds sang in the trees above.",
  "Learning to type fast takes time and practice. Start with the home row keys and build from there. Keep your eyes on the screen not your hands.",
  "React makes building user interfaces fast and enjoyable. Components let you split your UI into independent reusable pieces each in isolation.",
  "The sun sets slowly behind the mountains casting long shadows across the valley below. Stars begin to appear one by one in the darkening sky.",
  "Technology advances faster every year bringing new tools and possibilities. Programmers around the world collaborate to solve complex problems.",
];

function SpeedTest({ onBack }) {
  const [duration, setDuration] = useState(60);
  const [phase, setPhase] = useState("config");
  const [text, setText] = useState("");
  const [typed, setTyped] = useState("");
  const [time, setTime] = useState(60);
  const [started, setStarted] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const charsRef = useRef({ correct: 0, wrong: 0 });
  const [mistakes, setMistakes] = useState(0);
  const inputRef = useRef(null);
  const intervalRef = useRef(null);

  const startTest = (dur) => {
    const t = PARAGRAPHS[Math.floor(Math.random() * PARAGRAPHS.length)];
    setText(t);
    setTyped(""); setTime(dur || duration);
    setStarted(false); setMistakes(0);
    charsRef.current = { correct: 0, wrong: 0 };
    setPhase("test");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    if (!started || phase !== "test") return;
    intervalRef.current = setInterval(() => {
      setTime(p => {
        if (p <= 1) { clearInterval(intervalRef.current); setPhase("result"); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [started, phase]);

  const handleInput = (e) => {
    const val = e.target.value;
    if (val.length > text.length) return;
    if (!started && val.length > 0) setStarted(true);
    const last = val[val.length - 1];
    if (last) { setActiveKey(last); setTimeout(() => setActiveKey(null), 120); }
    if (val.length > typed.length) {
      const idx = val.length - 1;
      if (text[idx] === val[idx]) charsRef.current.correct++;
      else { charsRef.current.wrong++; setMistakes(m => m + 1); }
    }
    setTyped(val);
    if (val === text) { clearInterval(intervalRef.current); setPhase("result"); }
  };

  const wpm = Math.round((charsRef.current.correct / 5) / Math.max((duration - time), 1) * 60);
  const acc = charsRef.current.correct + charsRef.current.wrong > 0
    ? Math.round(charsRef.current.correct / (charsRef.current.correct + charsRef.current.wrong) * 100) : 100;

  if (phase === "config") return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ color: "#00ff9d", marginBottom: 8 }}>📝 Paragraph Speed Test</h2>
      <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 28 }}>Type a full paragraph — race the clock!</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
        {[30, 60, 180, 300].map(d => (
          <button key={d} onClick={() => setDuration(d)} style={{
            background: duration === d ? "#00ff9d" : "rgba(255,255,255,0.07)",
            color: duration === d ? "#000" : "#fff",
            border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20,
            padding: "8px 20px", cursor: "pointer", fontSize: 14, fontWeight: 600
          }}>{d < 60 ? d + "s" : d / 60 + " min"}</button>
        ))}
      </div>
      <button onClick={() => startTest(duration)} style={{
        background: "#00ff9d", color: "#000", border: "none", borderRadius: 30,
        padding: "14px 44px", fontSize: 16, fontWeight: 700, cursor: "pointer"
      }}>Start</button>
    </div>
  );

  if (phase === "result") return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ color: "#00ff9d", marginBottom: 20 }}>Results 📊</h2>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
        <StatBox label="WPM" value={wpm} color="#00ff9d" />
        <StatBox label="Accuracy" value={acc + "%"} color="#5a9ae0" />
        <StatBox label="Mistakes" value={mistakes} color="#ff4d6d" />
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={() => startTest(duration)} style={{
          background: "#00ff9d", color: "#000", border: "none", borderRadius: 20,
          padding: "10px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer"
        }}>Try Again</button>
        <button onClick={onBack} style={{
          background: "transparent", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20, padding: "10px 28px", fontSize: 14, cursor: "pointer"
        }}>Main Menu</button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ color: "#00ff9d", fontWeight: 700, fontSize: 18 }}>{time}s</span>
        <span style={{ color: "#5a9ae0" }}>{started ? wpm + " wpm" : "Start typing…"}</span>
        <span style={{ color: acc < 90 ? "#ff4d6d" : "rgba(255,255,255,0.5)" }}>{acc}% acc</span>
      </div>
      <div style={{
        fontFamily: "monospace", fontSize: 18, lineHeight: "2rem",
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12, padding: "20px 24px", marginBottom: 16
      }}>
        {text.split("").map((ch, i) => {
          let color = "rgba(255,255,255,0.25)";
          if (i < typed.length) color = typed[i] === ch ? "#00ff9d" : "#ff4d6d";
          if (i === typed.length) color = "#fff";
          return <span key={i} style={{ color, borderBottom: i === typed.length ? "2px solid #00ff9d" : "none" }}>{ch}</span>;
        })}
      </div>
      <input ref={inputRef} value={typed} onChange={handleInput}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 1, height: 1 }}
        autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
      />
      <div onClick={() => inputRef.current?.focus()} style={{
        textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 12, cursor: "text", marginBottom: 20
      }}>Click here and start typing</div>
      <Keyboard highlightKeys={[]} activeKey={activeKey} />
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [mode, setMode] = useState("home"); // home | monkey | lesson | speed

  const styles = {
    app: {
      minHeight: "100vh",
      background: "radial-gradient(ellipse at top, #0d1f1a 0%, #0a0f1e 50%, #06060f 100%)",
      color: "#fff",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      padding: "0 0 40px",
    },
    nav: {
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "16px 32px", borderBottom: "1px solid rgba(255,255,255,0.07)",
      backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 10,
      background: "rgba(0,0,0,0.3)"
    },
    brand: { color: "#00ff9d", fontWeight: 800, fontSize: 20, letterSpacing: -0.5 },
    main: { maxWidth: 780, margin: "0 auto", padding: "32px 20px" },
  };

  return (
    <div style={styles.app}>
      <nav style={styles.nav}>
        <div style={styles.brand} onClick={() => setMode("home")} role="button" tabIndex={0} onKeyDown={e => e.key==="Enter"&&setMode("home")} aria-label="TypeNova home">TypeNova ⌨</div>
        {mode !== "home" && (
          <button onClick={() => setMode("home")} style={{
            background: "transparent", color: "rgba(255,255,255,0.4)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
            padding: "5px 14px", fontSize: 13, cursor: "pointer"
          }}>← Home</button>
        )}
      </nav>

      <main style={styles.main}>
        {mode === "home" && <Home onSelect={setMode} />}
        {mode === "monkey" && <MonkeyMode onBack={() => setMode("home")} />}
        {mode === "lesson" && <LessonMode onBack={() => setMode("home")} />}
        {mode === "speed" && <SpeedTest onBack={() => setMode("home")} />}
      </main>
    </div>
  );
}

function Home({ onSelect }) {
  const cards = [
    {
      id: "monkey",
      icon: "🐒",
      title: "Monkey Type",
      desc: "Random words test — the classic speed challenge. Choose 15s, 30s, 60s or 120s.",
      color: "#00ff9d",
      badge: "Popular"
    },
    {
      id: "speed",
      icon: "📝",
      title: "Paragraph Test",
      desc: "Type full paragraphs with a timer. Great for building real-world typing stamina.",
      color: "#5a9ae0",
      badge: null
    },
    {
      id: "lesson",
      icon: "📚",
      title: "15 Lessons",
      desc: "Learn finger positions step by step — from home row to full keyboard mastery.",
      color: "#e0a05a",
      badge: "Learn"
    },
  ];

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, color: "#00ff9d", letterSpacing: -1, marginBottom: 10 }}>TypeNova</h1>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 16 }}>Master your keyboard — one key at a time</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 48 }}>
        {cards.map(card => (
          <button key={card.id} onClick={() => onSelect(card.id)} style={{
            background: "rgba(255,255,255,0.04)", border: `1px solid ${card.color}33`,
            borderRadius: 16, padding: "28px 24px", cursor: "pointer", textAlign: "left",
            transition: "all 0.2s", position: "relative", overflow: "hidden"
          }}>
            {card.badge && (
              <div style={{
                position: "absolute", top: 14, right: 14,
                background: card.color + "22", color: card.color, border: `1px solid ${card.color}55`,
                fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6
              }}>{card.badge}</div>
            )}
            <div style={{ fontSize: 32, marginBottom: 12 }}>{card.icon}</div>
            <h3 style={{ color: card.color, fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{card.title}</h3>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
          </button>
        ))}
      </div>

      {/* Finger position quick reference */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px" }}>
        <h3 style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginBottom: 16, fontWeight: 600 }}>Home Row Reference</h3>
        <Keyboard highlightKeys={["a","s","d","f","j","k","l",";"]} activeKey={null} />
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, textAlign: "center", marginTop: 12, marginBottom: 0 }}>
          Always return to home row: A S D F (left) — J K L ; (right)
        </p>
      </div>
    </div>
  );
}
