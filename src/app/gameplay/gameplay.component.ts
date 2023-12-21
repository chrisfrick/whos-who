import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "../../services/userService";
import fetchFromSpotify, { request } from "../../services/api";
import { Howl } from "howler";

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const SPOTIFY_SEARCH_ENDPOINT = "search";
const TOKEN_KEY = "whos-who-access-token";

@Component({
  selector: "app-gameplay",
  templateUrl: "./gameplay.component.html",
  styleUrls: ["./gameplay.component.css"],
})
export class GameplayComponent implements OnInit {
  authLoading: boolean = false;
  token: String = "";

  questionNumber: number = 1;
  correctAnswers: number = 0;
  incorrectAnswers: number = 0;
  currentScore: number = 0;
  selectedDifficulty: string = "";
  selectedGenres: string[] = ['rock', 'pop'];
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

  ngOnInit(): void {
    this.userService.currentGame.subscribe((currentGame) => {
      this.selectedDifficulty = currentGame.difficulty;
      this.selectedGenres = currentGame.genres;
    });

    this.authLoading = true;
    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage");
        this.authLoading = false;
        this.token = storedToken.value;
        this.loadQuestionData(this.token);
        return;
      }
    }
    console.log("Sending request to AWS endpoint");
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      this.authLoading = false;
      this.token = newToken.value;
      this.loadQuestionData(this.token);
    });

    this.loadQuestionData(this.token);
  }

  loadQuestionData = async (token: String) => {

    const genresQuery = this.selectedGenres.join(",");
    const genreSearchQuery = `genre: ${genresQuery}`;

    const playlistSpotifyParams = {
      token,
      endpoint: 'search',
      params: {
        q: genreSearchQuery,
        type: "playlist",
      },
    };

    let playlists = await fetchFromSpotify(playlistSpotifyParams)
    console.log(playlists.playlists.items)

    fetchFromSpotify({
      token: token,
      endpoint: `playlists/${playlists.playlists.items[0].id}/tracks`
    })
      // .then(r => console.log(r))
      .then((response) => {
        const tracks = response.items;

        this.albumImageUrl = tracks[0]?.track.album.images[0]?.url || "";
        this.secondAlbumImageUrl = tracks[1]?.track.album.images[0]?.url || "";

        let trackName: string = "";
        let artists: string[] = [];
        let albumName: string = "";
        let albumImage: string = "";

        tracks.forEach((track: any) => {
          trackName = track.track.name;
          artists = track.track.artists.map((artist: any) => artist.name);
          albumName = track.track.album.name;
          albumImage = track.track.album.images[0].url;
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
      this.loadQuestionData(this.token);
    } else {
      this.router.navigate(["/game-over"]);
    }
  }

  calculateCurrentScore(): number {
    const totalQuestions = this.correctAnswers + this.incorrectAnswers;
    return (this.correctAnswers / totalQuestions) * 100 || 0;
  }
}
