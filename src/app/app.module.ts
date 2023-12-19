import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { GameOverComponent } from './game-over/game-over.component';
import { GameStatsComponent } from './components/game-stats/game-stats.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  { path: "", component: WelcomeComponent },
  { path: "game-over", component: GameOverComponent },
];

@NgModule({
  declarations: [AppComponent, HomeComponent, GameOverComponent, GameStatsComponent, WelcomeComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
