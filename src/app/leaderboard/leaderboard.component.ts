import { Component, OnInit } from "@angular/core";
import Game from "../Models/Game";
import { UserService } from "src/services/userService";

@Component({
  selector: "app-leaderboard",
  templateUrl: "./leaderboard.component.html",
  styleUrls: ["./leaderboard.component.css"],
})
export class LeaderboardComponent implements OnInit {
  constructor(private userData: UserService) {}

  leaderboard: Game[] = [];

  game: Game = {
    finalScore: 0,
    playerName: "",
    difficulty: "",
    genres: [],
  };

  ngOnInit(): void {
    this.userData.currentGame.subscribe(
      (currentGame) => (this.game = currentGame)
    );

    this.userData.currentLeaderboard.subscribe(
      (currentLeaderboard) => (this.leaderboard = currentLeaderboard)
    );

    this.leaderboard.sort((a: Game, b: Game) => b.finalScore - a.finalScore);
  }

  partialReset() {
    console.log(this.game);
    this.game.correctAnswers = 0;
    this.game.incorrectAnswers = 0;
    this.userData.updateCurrentGame(this.game);
  }
}
