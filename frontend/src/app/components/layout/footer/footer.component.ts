import {Component, Input} from '@angular/core';
import {CategoryType} from '../../../../types/category.type';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'footer-component',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  @Input() categories: CategoryType[] = [];
}
