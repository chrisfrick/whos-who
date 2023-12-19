import { Component, OnInit } from "@angular/core";
import Game from "../Models/Game";

@Component({
  selector: "app-leaderboard",
  templateUrl: "./leaderboard.component.html",
  styleUrls: ["./leaderboard.component.css"],
})
export class LeaderboardComponent implements OnInit {
  constructor() {}

  leaderboard: Game[] = [
    {
      playerName: "MadMax!!",
      finalScore: 10,
    },
    {
      playerName: "Mirag3",
      finalScore: 8,
    },
    {
      playerName: "Bob",
      finalScore: 12,
    },
  ];

  ngOnInit(): void {
    this.leaderboard.sort((a: Game, b: Game) => b.finalScore - a.finalScore);
  }
}
