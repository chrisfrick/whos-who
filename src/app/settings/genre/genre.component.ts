import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-genre",
  templateUrl: "./genre.component.html",
  styleUrls: ["./genre.component.css"],
})
export class GenreComponent implements OnInit {
  constructor() {}

  @Input() genre: string = "";
  @Input() isChecked: boolean = false;
  @Input() disabled: boolean = false;
  @Output() checkboxChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  onCheckboxChange(event: any): void {
    if (!this.disabled) {
      this.checkboxChange.emit(event.target.checked);
    }
  }
  ngOnInit(): void {}
}
