import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GameStatsComponent } from "../components/game-stats/game-stats.component";
import { UserService } from "../../services/userService";
import fetchFromSpotify, { request } from "../../services/api";

const SPOTIFY_SEARCH_ENDPOINT = "https://api.spotify.com/v1/search";
const TOKEN_KEY = "whos-who-access-token";

@Component({
  selector: "app-gameplay",
  templateUrl: "./gameplay.component.html",
  styleUrls: ["./gameplay.component.css"],
})
export class GameplayComponent implements OnInit {
  questionNumber: number = 1;
  correctAnswers: number = 0;
  incorrectAnswers: number = 0;
  currentScore: number = 0;
  selectedDifficulty: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameStatsComponent: GameStatsComponent,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.currentGame.subscribe((currentGame) => {
      this.selectedDifficulty = currentGame.difficulty;
    });

    this.loadQuestionData();
  }

  loadQuestionData() {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      return;
    }

    const searchQuery = "";

    const spotifyParams = {
      token,
      endpoint: SPOTIFY_SEARCH_ENDPOINT,
      params: {
        q: searchQuery,
        type: "track",
        difficulty: this.selectedDifficulty,
      },
    };

    fetchFromSpotify(spotifyParams)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  playSample() {}

  stopSample() {}

  chooseAlbum(albumNumber: number) {
    const isCorrect = true;

    if (isCorrect) {
      this.correctAnswers++;
    } else {
      this.incorrectAnswers++;
    }

    this.currentScore = this.calculateCurrentScore();
    this.questionNumber++;

    const totalQuestions = 10;

    if (this.questionNumber <= totalQuestions) {
      this.loadQuestionData();
    } else {
      this.router.navigate(["/game-over"]);
    }
  }

  calculateCurrentScore(): number {
    const totalQuestions = this.correctAnswers + this.incorrectAnswers;
    return (this.correctAnswers / totalQuestions) * 100 || 0;
  }
}
