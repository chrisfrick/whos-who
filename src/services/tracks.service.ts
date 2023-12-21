import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import fetchFromSpotify, { request } from './api';

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  private tracksSource = new BehaviorSubject<any>({
    tracks: []
  });
  tracks = this.tracksSource.asObservable()

  token = ''

  constructor() { }

  updateTracks(genres: string[]) {
    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage");
        this.token = storedToken.value;
      }
    } else {
      console.log("Sending request to AWS endpoint");
      request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
        const newToken = {
          value: access_token,
          expiration: Date.now() + (expires_in - 20) * 1000,
        };
        localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
        this.token = newToken.value;
      });
    }
    
    const genresQuery = genres.join(",");
    const genreSearchQuery = `genre: ${genresQuery}`;

    const playlistSpotifyParams = {
      token: this.token,
      endpoint: 'search',
      params: {
        q: genreSearchQuery,
        type: "playlist",
      },
    };

    fetchFromSpotify(playlistSpotifyParams)
      .then(playlists => 
        fetchFromSpotify({
        token: this.token,
        endpoint: `playlists/${playlists.playlists.items[0].id}/tracks`
        }))
      // .then(r => console.log(r))
      .then((response) => {
        // console.log(response)
        this.tracksSource.next(response.items)
      })
      .catch((error) => {
        console.error(error);
      });
  }

}
