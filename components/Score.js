import React from "react";
import styles from "../styles/Score.module.css";

const Score = ({ name, score }) => {
  return (
    <p>
      {name} : {score} secondes
    </p>
  );
};

export default Score;
