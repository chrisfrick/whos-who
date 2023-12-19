import { Component, OnInit } from "@angular/core";

interface leaderboardUser {
  username: string;
  score: number;
}

@Component({
  selector: "app-leaderboard",
  templateUrl: "./leaderboard.component.html",
  styleUrls: ["./leaderboard.component.css"],
})
export class LeaderboardComponent implements OnInit {
  constructor() {}

  leaderboard: leaderboardUser[] = [
    {
      username: "MadMax!!",
      score: 10,
    },
    {
      username: "Mirag3",
      score: 8,
    },
    {
      username: "Bob",
      score: 12,
    },
  ];

  ngOnInit(): void {
    this.leaderboard.sort(
      (a: leaderboardUser, b: leaderboardUser) => b.score - a.score
    );
  }
}
