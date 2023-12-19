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

  ngOnInit(): void {
    this.userData.currentLeaderboard.subscribe(
      (currentLeaderboard) => (this.leaderboard = currentLeaderboard)
    );

    this.leaderboard.sort((a: Game, b: Game) => b.finalScore - a.finalScore);
  }
}
