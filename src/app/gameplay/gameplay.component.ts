import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "../../services/userService";
import { Howl } from "howler";
import { TrackService } from "src/services/tracks.service";



@Component({
  selector: "app-gameplay",
  templateUrl: "./gameplay.component.html",
  styleUrls: ["./gameplay.component.css"],
})
export class GameplayComponent implements OnInit {
  loading: boolean = true;
  token: String = "";

  questionNumber: number = 1;
  correctAnswers: number = 0;
  incorrectAnswers: number = 0;
  currentScore: number = 0;
  selectedDifficulty: string = "";
  selectedGenres: string[] = [];

  tracks: any[] = [];
  currentAudio: string = ''
  currentQuestion: any = null
  correctAnswer = 1;

  firstAlbumImageUrl: string = "";
  secondAlbumImageUrl: string = "";

  firstAlbumArtist: string = "";
  secondAlbumArtist: string = "";

  sample: Howl = new Howl({
    src: ["https://p.scdn.co/mp3-preview/f60beaf9fa2e73a0c1946c2402e0996270920f78?cid=74f434552d40467782bc1bc64b12b2e9"],
    format: ["mp3"]
  });

  currentTrack: {
    name: string;
    artists: string[];
    album: string;
    albumImage: string;
  } | null = null;

  constructor(private router: Router, private userService: UserService,
    private tracksService: TrackService) {}

  ngOnInit(): void {
    this.userService.currentGame.subscribe((currentGame) => {
      this.selectedDifficulty = currentGame.difficulty;
      this.selectedGenres = currentGame.genres;
    });

    this.tracksService.updateTracks(this.selectedGenres)

    this.tracksService.tracks.subscribe(tracks => {
      this.tracks = tracks
      this.currentAudio = this.tracks[0].track.preview_url
      this.loadQuestionData()
      this.loading = false
    })

  }

  loadQuestionData() {
    this.tracksService.generateQuestion()
    this.tracksService.currentQuestion.subscribe(question => this.currentQuestion = question)
    console.log(this.currentQuestion)

    this.firstAlbumImageUrl = this.currentQuestion.track1.track.album.images[0]?.url;
    this.secondAlbumImageUrl = this.currentQuestion.track2.track.album.images[0]?.url;
    this.firstAlbumArtist = this.currentQuestion.track1.track.artists[0].name;
    this.secondAlbumArtist = this.currentQuestion.track2.track.artists[0].name;
    this.correctAnswer = Math.round(Math.random()) + 1
    this.correctAnswer === 1 
      ? this.currentAudio = this.currentQuestion.track1.track.preview_url
      : this.currentAudio = this.currentQuestion.track2.track.preview_url
    this.correctAnswer === 1 
      ? this.sample = new Howl({
          src: [this.currentQuestion.track1.track.preview_url],
          format: ["mp3"]
        })
      : this.sample = new Howl({
          src: [this.currentQuestion.track2.track.preview_url],
          format: ["mp3"]
        })
    

    // let trackName: string = "";
    // let artists: string[] = [];
    // let albumName: string = "";
    // let albumImage: string = "";

    // this.tracks.forEach((track: any) => {
    //   trackName = track.track.name;
    //   artists = track.track.artists.map((artist: any) => artist.name);
    //   albumName = track.track.album.name;
    //   albumImage = track.track.album.images[0].url;
    // });

    // if (trackName && artists && albumName && albumImage) {
    //   this.currentTrack = {
    //     name: trackName,
    //     artists,
    //     album: albumName,
    //     albumImage,
    //   };
    // }
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
    const isCorrect = albumNumber === this.correctAnswer;
    this.sample.pause()

    if (isCorrect) {
      this.correctAnswers++;
    } else {
      this.incorrectAnswers++;
    }

    this.currentScore = this.calculateCurrentScore();
    console.log(this.currentScore)
    this.questionNumber++;

    const totalQuestions = 10;

    if (this.questionNumber <= totalQuestions) {
      this.loadQuestionData();
    } else {
      this.router.navigate(["/game-over"]);
    }
  }

  calculateCurrentScore(): number {
    return (this.selectedDifficulty === 'hard' ? this.correctAnswers * 300 : this.selectedDifficulty === 'medium' ? this.correctAnswers * 200 : this.correctAnswers * 100)
  }
}
