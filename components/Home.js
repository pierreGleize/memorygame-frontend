import { useState, useEffect } from "react";
import Card from "./Card";
import styles from "../styles/Home.module.css";
import Score from "./Score";
import { deck } from "../data/deckData";

function Home() {
  const [selected, setSelected] = useState([]);
  const [deckShuffle, setDeckShuffle] = useState([]);
  const [score, setScore] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [pseudo, setPseudo] = useState("");
  const [lastScore, setLastScore] = useState({});

  const isGameWin = deckShuffle.every((element) => element.isMatch === true);

  useEffect(() => {
    fetch("https://memorygame-backend.vercel.app/score")
      .then((response) => response.json())
      .then((data) => {
        setScore((prevState) => [...score, ...data.score]);
      });
  }, []);

  useEffect(() => {
    // Mélange le deck au chargement
    const shuffleDeck = [...deck].sort(() => Math.random() - 0.5);
    setDeckShuffle(shuffleDeck);

    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prevState) => prevState + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (isGameWin && isRunning) {
      const dataPost = {
        score: timer,
        name: pseudo,
      };
      fetch("https://memorygame-backend.vercel.app/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataPost),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.score.pop());
          setLastScore(data.score.pop());
          setPseudo("");
          setTimer(0);
          setIsRunning(false);
        });
    }
  }, [isGameWin]);

  const selectCard = (id, card) => {
    // Ignore si deux cartes sont déjà sélectionnées
    if (!isRunning) {
      return;
    }
    if (selected.length === 2) return;

    const newSelected = [...selected, card];
    setSelected(newSelected);

    // Vérifie s'il y a une correspondance
    if (newSelected.length === 2) {
      const [firstCard, secondCard] = newSelected;
      if (firstCard.name === secondCard.name) {
        setDeckShuffle((prevDeck) =>
          prevDeck.map((c) =>
            c.name === firstCard.name ? { ...c, isMatch: true } : c
          )
        );
      }

      // Réinitialise la sélection après un délai pour permettre à l'utilisateur de voir les cartes
      setTimeout(() => setSelected([]), 500);
    }
  };

  const cardsToDisplay = deckShuffle.map((card) => (
    <Card
      key={card.id}
      id={card.id}
      name={card.name}
      image={card.image}
      selectCard={selectCard}
      card={card}
      isFlipped={selected.includes(card) || card.isMatch}
    />
  ));

  const scoreToDisplay = score.map((element, i) => (
    <Score key={i} name={element.name} score={element.score} />
  ));
  const styleButton = pseudo.length === 0 ? { opacity: 0.5 } : {};
  return (
    <div className={styles.home}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Memory Game 🧠</h1>
        <div className={styles.headerDivider} />
        {/* </div> */}

        <div className={styles.main}>
          <div className={styles.scoreContainer}>
            <h2>Timer : {timer}</h2>
            <input
              type="text"
              placeholder="Enter your name"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              className={styles.inputPseudo}
            />{" "}
            <br />
            {lastScore.name && (
              <p>
                Your last Score : {lastScore.name} : {lastScore.score} secondes
              </p>
            )}
            <button
              onClick={() => setIsRunning(true)}
              disabled={pseudo.length === 0}
              style={styleButton}
              className={styles.startBtn}
            >
              Start Game
            </button>
            <h3>Best scores</h3>
            {scoreToDisplay.length > 0 && scoreToDisplay}
          </div>
          <div className={styles.grid}>{cardsToDisplay}</div>
        </div>
      </div>
    </div>
  );
}

export default Home;
