import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.css']
})
export class GameStatsComponent implements OnInit {

  correctAnswers: number = 8
  incorrectAnswers: number = 2
  currentScore: number | null = null
  finalScore: number | null = 800

  constructor() { }

  ngOnInit(): void {
    // TODO: get game stats from service
  }

}
