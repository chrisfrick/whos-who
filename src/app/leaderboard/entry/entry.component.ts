import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-entry",
  templateUrl: "./entry.component.html",
  styleUrls: ["./entry.component.css"],
})
export class EntryComponent implements OnInit {
  @Input() username: string = "";
  @Input() score: number = 0;

  constructor() {}

  ngOnInit(): void {}
}
