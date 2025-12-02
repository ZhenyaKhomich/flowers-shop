import {Component, Input, EventEmitter, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'count-selector',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './count-selector.component.html',
  styleUrl: './count-selector.component.scss'
})
export class CountSelectorComponent {
  @Input() count: number = 1;
  @Output() onCountChange: EventEmitter<number> = new EventEmitter<number>();

  countChange(): void {
    this.onCountChange.emit(this.count);
  }

  decreaseCount(): void {
    if (this.count > 1) {
      this.count--;
      this.countChange();
    }
  }

  increaseCount(): void {
    this.count++;
    this.countChange();
  }
}
