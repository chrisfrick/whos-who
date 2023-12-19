export default interface Game {
  numberOfQuestions?: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
  finalScore: number;
  playerName: string;
  difficulty: string;
  genres: string[];
}
