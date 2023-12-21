import { Component, OnInit } from "@angular/core";
import Game from "../Models/Game";
import { UserService } from "src/services/userService";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit {
  game: Game = {
    playerName: "",
    finalScore: 0,
    difficulty: "",
    genres: [],
  };

  gameDifficulty: string = "";

  constructor(private userData: UserService) {}

  ngOnInit(): void {
    this.userData.currentGame.subscribe(
      (currentGame) => (this.game = currentGame)
    );
  }

  selectDifficulty(value: string) {
    this.gameDifficulty = value;
    this.userData.updateCurrentGame({
      ...this.game,
      difficulty: value,
    });
  }
}
