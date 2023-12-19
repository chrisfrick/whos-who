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
    playerName: "unnamed player",
    difficulty: "easy",
    genres: ["rock"],
  });
  currentGame = this.currentGameSource.asObservable();

  private currentLeaderboardSource = new BehaviorSubject<Game[]>([
    {
      playerName: "MadMax!!",
      finalScore: 10,
      difficulty: "easy",
      genres: ["rock"],
    },
    {
      playerName: "Mirag3",
      finalScore: 8,
      difficulty: "easy",
      genres: ["rock"],
    },
    {
      playerName: "Bob",
      finalScore: 12,
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
