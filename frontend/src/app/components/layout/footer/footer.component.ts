import {Component, Input} from '@angular/core';
import {CategoryType} from '../../../../types/category.type';
import {NgForOf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'footer-component',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  @Input() categories: CategoryType[] = [];
}
