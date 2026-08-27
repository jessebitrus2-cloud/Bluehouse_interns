import { useEffect, useRef, useState } from "react";

const makeQuestion = (level = "easy") => {
  const type = Math.floor(Math.random() * 4);
  let a, b, answer, symbol;

  if (level === "easy") {
    if (type === 0) {
      a = Math.floor(Math.random() * 31) + 10;
      b = Math.floor(Math.random() * 31) + 10;
      answer = a + b;
      symbol = "+";
    } else if (type === 1) {
      a = Math.floor(Math.random() * 31) + 30;
      b = Math.floor(Math.random() * 20) + 1;
      answer = a - b;
      symbol = "−";
    } else if (type === 2) {
      a = Math.floor(Math.random() * 4) + 2;
      b = Math.floor(Math.random() * 5) + 2;
      answer = a * b;
      symbol = "×";
    } else {
      b = Math.floor(Math.random() * 4) + 2;
      answer = Math.floor(Math.random() * 5) + 2;
      a = b * answer;
      symbol = "÷";
    }

  } else if (level === "medium") {
    if (type === 0) {
      a = Math.floor(Math.random() * 201) + 100;
      b = Math.floor(Math.random() * 201) + 100;
      answer = a + b;
      symbol = "+";
    } else if (type === 1) {
      a = Math.floor(Math.random() * 301) + 200;
      b = Math.floor(Math.random() * 150) + 1;
      answer = a - b;
      symbol = "−";
    } else if (type === 2) {
      a = Math.floor(Math.random() * 8) + 3;
      b = Math.floor(Math.random() * 8) + 3;
      answer = a * b;
      symbol = "×";
    } else {
      b = Math.floor(Math.random() * 8) + 2;
      answer = Math.floor(Math.random() * 8) + 2;
      a = b * answer;
      symbol = "÷";
    }

  } else if (level === "hard") {
    if (type === 0) {
      a = Math.floor(Math.random() * 501) + 500;
      b = Math.floor(Math.random() * 501) + 500;
      answer = a + b;
      symbol = "+";
    } else if (type === 1) {
      a = Math.floor(Math.random() * 501) + 500;
      b = Math.floor(Math.random() * 400) + 50;
      answer = a - b;
      symbol = "−";
    } else if (type === 2) {
      a = Math.floor(Math.random() * 11) + 10;
      b = Math.floor(Math.random() * 11) + 10;
      answer = a * b;
      symbol = "×";
    } else {
      b = Math.floor(Math.random() * 11) + 5;
      answer = Math.floor(Math.random() * 11) + 5;
      a = b * answer;
      symbol = "÷";
    }
  }

  return { a, b, answer, symbol };
};

function App() {
  const correctSound = useRef(new Audio("./sounds/correct.mp3"));
  const wrongSound = useRef(new Audio("./sounds/wrong.mp3"));
  const lifeBonusSound = useRef(new Audio("./sounds/life-bonus.mp3"));
  const hoverSound = useRef(new Audio("./sounds/hover.mp3"));
  const clickSound = useRef(new Audio("./sounds/click.mp3"));
  const answerInputRef = useRef(null);

  const playHoverSound = () => {
    if (soundOn) {
      hoverSound.current.currentTime = 0;
      hoverSound.current.play().catch((error) => {
        console.log("Hover sound error:", error);
      });
    }
  };

  const playClickSound = () => {
    if (soundOn) {
      clickSound.current.currentTime = 0;
      clickSound.current.play();
    }
  };
    
    const [soundOn, setSoundOn] = useState(true);
  const [level, setLevel] = useState("easy");
  const [quizStarted, setQuizStarted] = useState(false);
  const [question, setQuestion] = useState(() => makeQuestion("easy"));
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState(null);
  const [lastLifeBonus, setLastLifeBonus] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [failureCount, setFailureCount] = useState(0);
  const [lifeCelebration, setLifeCelebration] = useState(false);

  const nextQuestion = () => {
    setQuestion(makeQuestion(level));
    setAnswer("");
    setFeedback(null);
    setFailureCount(0);
  };

useEffect(() => {
  if (quizStarted && !feedback && !gameOver) {
    answerInputRef.current?.focus();
  }
}, [question, quizStarted, feedback, gameOver]);

  const checkAnswer = (event) => {
    event.preventDefault();
    if (answer.trim() === "") return;

    const correct = Number(answer) === question.answer;
  
    if (correct) {
      setScore((current) => {
      const newScore = current + 1;

    if (newScore % 10 === 0 && newScore > lastLifeBonus) {
      setLives((currentLives) => currentLives + 1);
      setLastLifeBonus(newScore);
      setLifeCelebration(true);

  if (soundOn) {
    lifeBonusSound.current.currentTime = 0;
    lifeBonusSound.current.play();
  }

  setTimeout(() => {
    setLifeCelebration(false);
  }, 3500);
}

    return newScore;
  });

  setQuestions((current) => current + 1);

  if (soundOn) {
    correctSound.current.currentTime = 0;
    correctSound.current.play();
  }

  setFeedback("correct");


  } else {

    const newFailureCount = failureCount + 1;

setFailureCount(newFailureCount);

if (soundOn) {
  wrongSound.current.currentTime = 0;
  wrongSound.current.play();
}

if (newFailureCount >= 3) {
  setLives((currentLives) => {
    const newLives = currentLives - 1;

    if (newLives <= 0) {
      setGameOver(true);
    }

    return newLives;
  });

  setFeedback("answer");
} else {
  setFeedback("wrong");
}

}

};

useEffect(() => {
  if (!feedback) return;

  const timer = setTimeout(() => {
    if (feedback === "correct") {
      nextQuestion();
    } else if (feedback === "answer") {
      setFeedback(null);
      setAnswer("");
      setFailureCount(0);

      if (!gameOver) {
        setQuestion(makeQuestion(level));
      }
    } else {
      setFeedback(null);
      setAnswer("");

      if (gameOver) {
        setQuizStarted(false);
        setFeedback(null);
      }
    }
  }, 1800);

  return () => clearTimeout(timer);
}, [feedback, gameOver, level]);


useEffect(() => {
  if (!gameOver) return;

  const timer = setTimeout(() => {
    setGameOver(false);
    setQuizStarted(false);
    setLives(3);
    setScore(0);
    setQuestions(0);
    setLastLifeBonus(0);
    setQuestion(makeQuestion(level));
  }, 2500);

  return () => clearTimeout(timer);
}, [gameOver]);


    const resetGame = () => {
      setScore(0);
      setQuestions(0);
      setLives(3);
      setLastLifeBonus(0);
      setGameOver(false);
      setAnswer("");
      setFeedback(null);
      setQuestion(makeQuestion(level));
      setQuizStarted(false);
    };
    
  return (
    <main className="min-h-screen px-4 py-8 text-slate-800">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl items-center justify-center">
        <section className="w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-2xl backdrop-blur-md">
          <div className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 px-6 py-8 text-center text-white sm:px-10">
            <div className="mb-3 text-5xl">🧠 ✏️ ⭐</div>
            <h1 className="text-3xl font-black sm:text-5xl">Delight Mathematics Adventure!</h1>
            <p className="mt-2 text-lg font-semibold text-white/90">
              Grade 4 Challenge
            </p>
          </div>

          <div className="grid gap-6 p-6 sm:p-10">
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="rounded-2xl bg-violet-100 px-5 py-3">
                <p className="text-sm font-bold text-violet-600">SCORE</p>
                <p className="text-2xl font-black text-violet-900">{score}</p>
              </div>

              <div className="rounded-2xl bg-red-100 px-5 py-3 text-center">
                <p className="text-sm font-bold text-red-600">LIVES</p>
                <p className="text-2xl font-black text-red-700">
                  {"❤️ ".repeat(lives)}
                </p>
              </div>

                <button
                  onMouseEnter={playHoverSound}
                  onClick={() => {
                  playClickSound();
                  setSoundOn((current) => !current);
                  }}
                  className="rounded-2xl bg-yellow-100 px-5 py-3 font-black text-yellow-800 shadow-sm transition hover:-translate-y-1 hover:bg-yellow-200"
                  >
                  {soundOn ? "🔊 Sound ON" : "🔇 Sound OFF"}
                </button>

              <div className="rounded-2xl bg-cyan-100 px-5 py-3 text-right">
                <p className="text-sm font-bold text-cyan-700">QUESTIONS</p>
                <p className="text-2xl font-black text-cyan-900">{questions}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
  <p className="mb-3 text-center text-sm font-black text-slate-600">
    CHOOSE LEVEL
  </p>

  <div className="flex flex-wrap justify-center gap-3">
    <button
         onMouseEnter={playHoverSound}
          onClick={() => {
            playClickSound();
            setLevel("easy");
            setQuizStarted(false);
            setAnswer("");
            setFeedback(null);
          }}
      className={`rounded-xl px-5 py-3 font-black transition ${
        level === "easy"
          ? "bg-green-500 text-white shadow-lg"
          : "bg-green-100 text-green-700 hover:bg-green-200"
      }`}
    >
      🟢 Easy
    </button>

      <button
        onMouseEnter={playHoverSound}
          onClick={() => {
            playClickSound();
            setLevel("medium");
            setQuizStarted(false);
            setAnswer("");
            setFeedback(null);
          }}

      className={`rounded-xl px-5 py-3 font-black transition ${
        level === "medium"
          ? "bg-yellow-500 text-white shadow-lg"
          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
      }`}
    >
      🟡 Medium
    </button>

    <button
      onMouseEnter={playHoverSound}
      onClick={() => {
        playClickSound();
        setLevel("hard");
        setQuizStarted(false);
        setAnswer("");
        setFeedback(null);
      }}

      className={`rounded-xl px-5 py-3 font-black transition ${
        level === "hard"
          ? "bg-red-500 text-white shadow-lg"
          : "bg-red-100 text-red-700 hover:bg-red-200"
      }`}
    >
      🔴 Hard
</button>
  </div>

      <div className="mt-5 text-center">
        <button
  onMouseEnter={playHoverSound}
  onClick={() => {
    playClickSound();
    setScore(0);
    setQuestions(0);
    setLives(3);
    setLastLifeBonus(0);
    setGameOver(false);
    setQuestion(makeQuestion(level));
    setAnswer("");
    setFeedback(null);
    setQuizStarted(true);
  }}

  className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-4 text-xl font-black text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
>
  {quizStarted ? "🔄 Restart Quiz" : "🚀 Start Quiz"}
</button>
  </div>
</div>

            {quizStarted && !gameOver && (
              <div className="rounded-3xl bg-gradient-to-br from-yellow-100 via-pink-100 to-cyan-100 p-6 text-center sm:p-10">
                <p className="mb-4 text-lg font-bold text-slate-600">
                  Solve this:
                </p>

                <div className="mb-8 text-5xl font-black tracking-wide text-violet-700 sm:text-7xl">
                  {question.a} {question.symbol} {question.b} = ?
                </div>

                <form onSubmit={checkAnswer} className="mx-auto max-w-md">
                  <label htmlFor="answer" className="sr-only">
                    Your answer
                  </label>

                 <input
                    id="answer"
                    ref={answerInputRef}
                    type="number"
                    inputMode="numeric"
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    disabled={Boolean(feedback)}
                    placeholder="Type your answer"
                    className="w-full rounded-2xl border-4 border-white bg-white px-5 py-4 text-center text-2xl font-bold outline-none ring-violet-400 transition focus:ring-4 disabled:opacity-60"
                    autoFocus
                  />
                <button
                  type="submit"
                  onMouseEnter={playHoverSound}
                  disabled={Boolean(feedback)}
                  className="mt-4 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-4 text-xl font-black text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Check Answer 🚀
                </button>
                  
                </form>
              </div>
            )}

            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 sm:flex-row">
              <p className="font-semibold text-slate-500">
                Keep trying — every question makes you stronger! 💪
              </p>
            <button
                onMouseEnter={playHoverSound}
                onClick={() => {
                  playClickSound();
                  resetGame();
                }}
                className="rounded-xl border-2 border-violet-200 bg-white px-5 py-2 font-bold text-violet-700 transition hover:bg-violet-50"
              >
                Reset Game
              </button>
              
            </div>
          </div>
        </section>
      </div>

      {feedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div
            className={`pop-in relative w-full max-w-sm rounded-[2rem] bg-white p-8 text-center shadow-2xl ${
              feedback === "correct"
                ? "border-8 border-green-300"
                : "border-8 border-orange-300"
            }`}
          >
          <div className="bounce mb-4 text-7xl">
              {feedback === "correct" ? "🎉" : "🤔"}
        </div>
                      {feedback === "correct" && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <span className="confetti left-[10%] top-0 rotate-12">🎊</span>
              <span className="confetti left-[25%] top-0 -rotate-12">⭐</span>
              <span className="confetti left-[40%] top-0 rotate-6">🎉</span>
              <span className="confetti left-[55%] top-0 -rotate-6">✨</span>
              <span className="confetti left-[70%] top-0 rotate-12">🎊</span>
              <span className="confetti left-[85%] top-0 -rotate-12">⭐</span>
            </div>
          )}

      <h2
  className={`text-4xl font-black ${
    feedback === "correct"
      ? "text-green-600"
      : feedback === "answer"
      ? "text-blue-600"
      : "text-orange-500"
  }`}
>
  {feedback === "correct"
    ? "Great Job!"
    : feedback === "answer"
    ? "Correct Answer!"
    : "Try Again!"}
      </h2>

        <p className="mt-3 text-lg font-semibold text-slate-600">
          {feedback === "correct" ? (
            "Excellent! You got the answer right."
          ) : feedback === "answer" ? (
            <>
              The correct answer is{" "}
              <span className="text-3xl font-black text-blue-600">
                {question.answer}
              </span>
            </>
          ) : (
            "Not quite! Try the same question again."
          )}
        </p>
            </div>
        </div>
      )}


      {lifeCelebration && (
  <div className="fixed inset-0 z-[70] pointer-events-none overflow-hidden">
    
    {/* Balloons */}
    <span className="balloon left-[5%]">🎈</span>
    <span className="balloon left-[15%]">🎈</span>
    <span className="balloon left-[28%]">🎈</span>
    <span className="balloon left-[42%]">🎈</span>
    <span className="balloon left-[56%]">🎈</span>
    <span className="balloon left-[70%]">🎈</span>
    <span className="balloon left-[84%]">🎈</span>
    <span className="balloon left-[94%]">🎈</span>

    {/* Flowers */}
    <span className="flower left-[10%]">🌸</span>
    <span className="flower left-[23%]">🌺</span>
    <span className="flower left-[37%]">🌼</span>
    <span className="flower left-[50%]">🌷</span>
    <span className="flower left-[63%]">🌸</span>
    <span className="flower left-[77%]">🌺</span>
    <span className="flower left-[90%]">🌼</span>

    {/* Celebration message */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bonus-life-message rounded-[2rem] bg-white/95 px-8 py-6 text-center shadow-2xl">
        <div className="text-6xl">❤️ 🎉 ❤️</div>

        <h2 className="mt-2 text-4xl font-black text-green-600">
          BONUS LIFE!
        </h2>

        <p className="mt-2 text-xl font-bold text-violet-600">
          You earned an extra life! 🌟
        </p>
      </div>
    </div>

  </div>
)}

        {gameOver && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm">
            <div className="pop-in w-full max-w-sm rounded-[2rem] border-8 border-red-300 bg-white p-8 text-center shadow-2xl">
              
              <div className="bounce mb-4 text-7xl">
                💔
              </div>

              <h2 className="text-5xl font-black text-red-600">
                Game Over!
              </h2>

              <p className="mt-4 text-xl font-bold text-slate-600">
                You ran out of lives.
              </p>

              <p className="mt-2 text-lg font-semibold text-slate-500">
                Great effort! Get ready to try again.
              </p>

            </div>
          </div>
        )}

    </main>
  );
}

export default App;