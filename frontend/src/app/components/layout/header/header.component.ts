import {Component, Input} from '@angular/core';

import {NgForOf} from '@angular/common';
import {CategoryType} from '../../../../types/category.type';

@Component({
  selector: 'header-component',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent {
  @Input() categories: CategoryType[] = [];

}
