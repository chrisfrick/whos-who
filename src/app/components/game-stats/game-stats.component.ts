import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/userService';

@Component({
  selector: 'app-game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.css']
})
export class GameStatsComponent implements OnInit {

  correctAnswers: number = 0
  incorrectAnswers: number = 0
  currentScore: number | null = null
  finalScore: number | null = 0

  constructor(private gameData: UserService) { }

  ngOnInit(): void {
    this.gameData.currentGame.subscribe(({numberOfQuestions, correctAnswers, incorrectAnswers, finalScore }) => {
      if (correctAnswers !== undefined && incorrectAnswers !== undefined && numberOfQuestions !== undefined) {
        console.log(correctAnswers, numberOfQuestions)
        this.correctAnswers = correctAnswers
        this.incorrectAnswers = incorrectAnswers

        if (finalScore) {
          this.currentScore = null
          this.finalScore = finalScore
        } else {
          this.currentScore = correctAnswers / numberOfQuestions
        }
      }
    })
  }

}
