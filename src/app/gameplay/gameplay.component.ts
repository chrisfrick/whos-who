import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "../../services/userService";
import fetchFromSpotify, { request } from "../../services/api";
import { Howl } from "howler";
import { TrackService } from "src/services/tracks.service";



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

  tracks: any[] = [];
  currentAudio: string = ''

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

  constructor(private router: Router, private userService: UserService,
    private tracksService: TrackService) {}

  ngOnInit(): void {
    this.userService.currentGame.subscribe((currentGame) => {
      this.selectedDifficulty = currentGame.difficulty;
      this.selectedGenres = currentGame.genres;
    });

    this.tracksService.tracks.subscribe(tracks => this.tracks = tracks)

    if (this.tracks.length < 1 || this.tracks.length === undefined) {
      this.router.navigateByUrl('/settings')
    }

    console.log(this.tracks)
    this.currentAudio = this.tracks[0].track.preview_url
    this.sample = new Howl({
      src: this.tracks[0].track.preview_url
    })
    console.log(this.sample)
  }

  // loadQuestionData = async (token: String) => {

  //   const genresQuery = this.selectedGenres.join(",");
  //   const genreSearchQuery = `genre: ${genresQuery}`;

  //   const playlistSpotifyParams = {
  //     token,
  //     endpoint: 'search',
  //     params: {
  //       q: genreSearchQuery,
  //       type: "playlist",
  //     },
  //   };

  //   let playlists = await fetchFromSpotify(playlistSpotifyParams)
  //   console.log(playlists.playlists.items)

  //   fetchFromSpotify({
  //     token: token,
  //     endpoint: `playlists/${playlists.playlists.items[0].id}/tracks`
  //   })
  //     // .then(r => console.log(r))
  //     .then((response) => {
  //       const tracks = response.items;
  //       console.log(tracks)
  //       this.tracks= tracks

  //       this.albumImageUrl = tracks[0]?.track.album.images[0]?.url || "";
  //       this.secondAlbumImageUrl = tracks[1]?.track.album.images[0]?.url || "";

  //       let trackName: string = "";
  //       let artists: string[] = [];
  //       let albumName: string = "";
  //       let albumImage: string = "";

  //       tracks.forEach((track: any) => {
  //         trackName = track.track.name;
  //         artists = track.track.artists.map((artist: any) => artist.name);
  //         albumName = track.track.album.name;
  //         albumImage = track.track.album.images[0].url;
  //       });

  //       if (trackName && artists && albumName && albumImage) {
  //         this.currentTrack = {
  //           name: trackName,
  //           artists,
  //           album: albumName,
  //           albumImage,
  //         };
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

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
      // this.loadQuestionData(this.token);
    } else {
      this.router.navigate(["/game-over"]);
    }
  }

  calculateCurrentScore(): number {
    const totalQuestions = this.correctAnswers + this.incorrectAnswers;
    return (this.correctAnswers / totalQuestions) * 100 || 0;
  }
}
