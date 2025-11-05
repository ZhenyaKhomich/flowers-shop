import {Component, inject, Input, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {CategoryWithTypeType} from '../../../../types/category-with-type.type';
import {Router} from '@angular/router';
import {ActiveParamsType} from '../../../../types/active-params.type';

@Component({
  selector: 'category-filter',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './category-filter.component.html',
  styleUrl: './category-filter.component.scss'
})
export class CategoryFilterComponent {

  private router = inject(Router);

  @Input() category!: CategoryWithTypeType;
  @Input() type: string | null = null;
  open: boolean = false;
  activeParams: ActiveParamsType = {types: []};


  get title(): string {
    if(this.category) {
      return this.category.name;
    } else if(this.type) {
      if(this.type === 'height') {
        return 'Высота'
      } else if (this.type === 'diameter') {
        return 'Диаметр';
      }
    }
    return '';
  }

  toggle() {
   this.open = !this.open;
  }

  updateFilterParam(url: string, input:boolean): void {
    // if(this.activeParams.types && this.activeParams.types.length > 0) {
    //   const existingTypesInParams = this.activeParams.types.find(item => item === url);
    //   if(existingTypesInParams && !input) {
    //     this.activeParams.types = this.activeParams.types.filter(str => str !== url)
    //   } else if(!existingTypesInParams && input) {
    //     this.activeParams.types.push(url);
    //   }
    // } else if (input) {
    //   this.activeParams.types = [url];
    // }


    //код вверху тоже самое что и нижний, но с большим количеством условий
    if(input) {
      if (!this.activeParams.types.includes(url)) {
        this.activeParams.types.push(url);
      }
    } else {
      this.activeParams.types = this.activeParams.types.filter(str => str !== url)
    }

    this.router.navigate(['/catalog'], { queryParams: this.activeParams});
  }
}
