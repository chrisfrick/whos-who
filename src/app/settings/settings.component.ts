import { Component, OnInit } from "@angular/core";
import Game from "../Models/Game";
import { UserService } from "src/services/userService";
import { Router } from "@angular/router";
import { TrackService } from "src/services/tracks.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit {
  game: Game = {
    playerName: "",
    finalScore: 0,
    difficulty: "",
    genres: [],
  };

  gameDifficulty: string = "";
  selectedGenres: string[] = [];
  isEasySelected: boolean = true;
  isMediumSelected: boolean = false;
  isHardSelected: boolean = false;

  baseGenres: string[] = [
    "Rock",
    "Pop",
    "R&B",
    "Soundtrack",
    "Jazz",
    "Alternative",
  ];

  constructor(private userData: UserService, private router: Router,
    private tracksService: TrackService) {}

  ngOnInit(): void {
    this.userData.currentGame.subscribe(
      (currentGame) => (this.game = currentGame)
    );
  }

  selectDifficulty(value: string) {
    this.gameDifficulty = value;

    if (value === "easy") {
      this.isEasySelected = true;
      this.isMediumSelected = false;
      this.isHardSelected = false;
      this.selectedGenres = [];
    } else if (value === "medium") {
      this.isEasySelected = false;
      this.isMediumSelected = true;
      this.isHardSelected = false;
      this.selectedGenres = [];
    } else {
      this.isEasySelected = false;
      this.isMediumSelected = false;
      this.isHardSelected = true;
      this.selectedGenres = this.baseGenres.slice();
    }
  }

  isGenreChecked(genre: string): boolean {
    return this.selectedGenres.includes(genre) && !this.isHardSelected;
  }

  onCheckboxChange(genre: string, isChecked: boolean): void {
    if (this.isHardSelected) {
      isChecked = true;
    }

    if (isChecked) {
      this.selectedGenres.push(genre);
    } else {
      const index = this.selectedGenres.indexOf(genre);
      if (index !== -1) {
        this.selectedGenres.splice(index, 1);
      }
    }
  }

  navigateToLeaderboard() {
    this.router.navigateByUrl("/leaderboard");
  }

  onSubmit() {
    this.game.difficulty = this.gameDifficulty;
    this.game.genres = this.selectedGenres;

    if (this.isEasySelected && this.selectedGenres.length !== 1) {
      alert('Please select exactly one genre for "easy" difficulty.');
      return;
    }

    if (this.isMediumSelected && this.selectedGenres.length !== 3) {
      alert('Please select exactly three genres for "medium" difficulty');
      return
    }

    this.userData.updateCurrentGame(this.game);

    this.router.navigateByUrl("/gameplay");
  }
}
