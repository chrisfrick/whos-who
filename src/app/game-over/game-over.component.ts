import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.css']
})
export class GameOverComponent implements OnInit {

  playerName: string = ''



  constructor() { }

  ngOnInit(): void {
  }

  setPlayerName(name: string) {
    this.playerName = name;
  }

  onSubmit() {
    // TODO: Handle adding player name and score to leaderboard
  }

}
