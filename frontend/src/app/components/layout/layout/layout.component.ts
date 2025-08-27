import {Component, inject, OnInit} from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {FooterComponent} from '../footer/footer.component';
import {RouterOutlet} from '@angular/router';
import {CategoryType} from '../../../../types/category.type';
import {CategoryService} from '../../../services/category.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterOutlet
  ],
  templateUrl: './layout.component.html',
})

export class LayoutComponent implements OnInit {
  private CategoryService = inject(CategoryService);
  categories: CategoryType[] = [];

  ngOnInit(): void {
    this.CategoryService.getCategories().subscribe((categories: CategoryType[]) =>{
      this.categories = categories;
    })
  }

}
