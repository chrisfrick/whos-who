import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/userService';
import Game from '../Models/Game';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.css']
})
export class GameOverComponent implements OnInit {

  playerName: string = ''

  currentGame: Game = {
    playerName: "",
    finalScore: 0,
    difficulty: "",
    genres: [],
  };

  currentLeaderboard: Game[] = []

  constructor(private gameData: UserService) {}

  ngOnInit(): void {
    // set current game
    this.gameData.currentGame.subscribe(currentGame => this.currentGame = currentGame)

    // set current leaderboard
    this.gameData.currentLeaderboard.subscribe(currentLeaderboard => this.currentLeaderboard = currentLeaderboard)

    // check for not-undefined correctAnswers and numberOfQuestions
    if (this.currentGame.correctAnswers && this.currentGame.numberOfQuestions) {
      // calculate final score based on difficulty
      switch (this.currentGame.difficulty) {
        case 'hard':
          this.currentGame.finalScore = this.calculateFinalScore(
            this.currentGame.correctAnswers,
            this.currentGame.numberOfQuestions,
            300)
            break
        case 'medium':
          this.currentGame.finalScore = this.calculateFinalScore(
            this.currentGame.correctAnswers,
            this.currentGame.numberOfQuestions,
            200)
            break
        case 'easy':
        default:
          this.currentGame.finalScore = this.calculateFinalScore(
            this.currentGame.correctAnswers,
            this.currentGame.numberOfQuestions,
            100) 
      }
    }
    
    // update userService with final score
    this.gameData.updateCurrentGame(this.currentGame)
  }

  calculateFinalScore (correctAnswers: number, totalQuestions: number, difficultyMultiplier: number) {
    return (correctAnswers / totalQuestions) * difficultyMultiplier
  }

  setPlayerName(name: string) {
    this.playerName = name;
  }

  onSubmit() {
    // TODO: Handle adding player name and score to leaderboard
    this.currentGame.playerName = this.playerName
    const newLeaderboard = this.currentLeaderboard
    newLeaderboard.push(this.currentGame)
    this.gameData.updateCurrentLeaderboard(newLeaderboard)
  }

}
