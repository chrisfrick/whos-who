import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import Game from "src/app/Models/Game";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private currentGameSource = new BehaviorSubject<Game>({
    numberOfQuestions: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    finalScore: 0,
    playerName: "",
    difficulty: "easy",
    genres: [],
  });
  currentGame = this.currentGameSource.asObservable();

  private currentLeaderboardSource = new BehaviorSubject<Game[]>([
    {
      playerName: "MadMax!!",
      finalScore: 100,
      difficulty: "easy",
      genres: ["rock"],
    },
    {
      playerName: "Mirag3",
      finalScore: 800,
      difficulty: "easy",
      genres: ["rock"],
    },
    {
      playerName: "Bob",
      finalScore: 400,
      difficulty: "easy",
      genres: ["rock"],
    },
  ]);

  currentLeaderboard = this.currentLeaderboardSource.asObservable();

  updateCurrentGame(game: Game) {
    this.currentGameSource.next(game);
  }

  updateCurrentLeaderboard(leaderboard: Game[]) {
    this.currentLeaderboardSource.next(leaderboard);
  }
}
