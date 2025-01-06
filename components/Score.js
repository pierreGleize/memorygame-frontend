import React from "react";
import styles from "../styles/Score.module.css";

const Score = ({ name, score, place }) => {
  return (
    <div className={styles.scoreContainer}>
      <span className={styles.place}>{place + 1}.</span>
      <span className={styles.name}>{name}</span>
      <span className={styles.score}>{score} secondes</span>
    </div>
  );
};

export default Score;
