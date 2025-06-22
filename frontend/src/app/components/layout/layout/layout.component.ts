import {Component, inject, OnInit} from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {FooterComponent} from '../footer/footer.component';
import {RouterOutlet} from '@angular/router';
import {CategoryType} from '../../../../types/category.type';
import {CategoryService} from '../../../services/category.service';
import {CategoryWithTypeType} from '../../../../types/category-with-type.type';

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
  categories: CategoryWithTypeType[] = [];

  ngOnInit(): void {
    this.CategoryService.getCategoriesWithTypes().subscribe((categories: CategoryWithTypeType[]) =>{
      this.categories = categories.map(item => {
        return Object.assign({typesUrl: item.types.map(el => el.url)}, item)
      });
    })
  }
}
