import { Component, OnInit } from "@angular/core";
import { UserService } from "src/services/userService";
import Game from "../Models/Game";

@Component({
  selector: "app-game-over",
  templateUrl: "./game-over.component.html",
  styleUrls: ["./game-over.component.css"],
})
export class GameOverComponent implements OnInit {
  playerName: string = "";

  currentGame: Game = {
    playerName: "",
    finalScore: 0,
    difficulty: "",
    genres: [],
  };

  currentLeaderboard: Game[] = [];

  constructor(private gameData: UserService) {}

  ngOnInit(): void {
    // set current game
    this.gameData.currentGame.subscribe(
      (currentGame) => (this.currentGame = currentGame)
    );

    // set current leaderboard
    this.gameData.currentLeaderboard.subscribe(
      (currentLeaderboard) => (this.currentLeaderboard = currentLeaderboard)
    );
  }

  calculateFinalScore(correctAnswers: number, difficultyMultiplier: number) {
    return correctAnswers * difficultyMultiplier;
  }

  setPlayerName(name: string) {
    this.playerName = name;
  }

  onSubmit() {
    this.currentGame.playerName = this.playerName;

    const newGame: Game = {
      playerName: this.currentGame.playerName,
      finalScore: this.currentGame.finalScore,
      difficulty: this.currentGame.difficulty,
      genres: this.currentGame.genres.slice(),
    };

    const newLeaderboard = [...this.currentLeaderboard, newGame];
    this.gameData.updateCurrentGame(this.currentGame);
    this.gameData.updateCurrentLeaderboard(newLeaderboard);
  }
}
