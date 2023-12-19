import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-entry",
  templateUrl: "./entry.component.html",
  styleUrls: ["./entry.component.css"],
})
export class EntryComponent implements OnInit {
  @Input() playerName: string = "";
  @Input() finalScore: number = 0;

  constructor() {}

  ngOnInit(): void {}
}
