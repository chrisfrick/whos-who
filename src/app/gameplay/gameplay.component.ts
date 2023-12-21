import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "../../services/userService";
import fetchFromSpotify from "../../services/api";
import { Howl } from "howler";

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
  selectedGenres: string[] = [];
  sample: Howl = new Howl({
    src: ["sound.mp3"],
  });
  currentTrack: {
    name: string;
    artists: string[];
    album: string;
    albumImage: string;
  } | null = null;
  albumImageUrl: string = "";
  secondAlbumImageUrl: string = "";
  currentScorePercentage: number = 0;

  constructor(private router: Router, private userService: UserService) {}

  // what needs to be appended to the spotify search endpoint
  // genre%3A+rock%2C+pop%2C+jazz&type=playlist

  ngOnInit(): void {
    this.userService.currentGame.subscribe((currentGame) => {
      this.selectedDifficulty = currentGame.difficulty;
      this.selectedGenres = currentGame.genres;
    });

    this.loadQuestionData();
  }

  loadQuestionData() {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      return;
    }

    const genresQuery = this.selectedGenres.join(",");
    const searchQuery = `genre:${genresQuery} difficulty:${this.selectedDifficulty}`;

    const spotifyParams = {
      token,
      endpoint: SPOTIFY_SEARCH_ENDPOINT,
      params: {
        q: searchQuery,
        type: "track",
      },
    };

    fetchFromSpotify(spotifyParams)
      .then((response) => {
        const tracks = response.tracks.items;

        this.albumImageUrl = tracks[0]?.album.images[0]?.url || "";
        this.secondAlbumImageUrl = tracks[1]?.album.images[0]?.url || "";

        let trackName: string = "";
        let artists: string[] = [];
        let albumName: string = "";
        let albumImage: string = "";

        tracks.forEach((track: any) => {
          trackName = track.name;
          artists = track.artists.map((artist: any) => artist.name);
          albumName = track.album.name;
          albumImage = track.album.images[0].url;
        });

        if (trackName && artists && albumName && albumImage) {
          this.currentTrack = {
            name: trackName,
            artists,
            album: albumName,
            albumImage,
          };
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  playSample() {
    if (this.sample) {
      this.sample.play();
    }
  }

  pauseSample() {
    if (this.sample) {
      this.sample.pause();
    }
  }

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
