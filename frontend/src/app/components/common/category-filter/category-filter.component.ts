import {Component, inject, Input, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {CategoryWithTypeType} from '../../../../types/category-with-type.type';
import {ActivatedRoute, Router} from '@angular/router';
import {ActiveParamsType} from '../../../../types/active-params.type';
import {FormsModule} from '@angular/forms';
import {ActiveParamsUtil} from '../../../utils/active-params.util';

@Component({
  selector: 'category-filter',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass,
    FormsModule
  ],
  templateUrl: './category-filter.component.html',
  styleUrl: './category-filter.component.scss'
})
export class CategoryFilterComponent implements OnInit {

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  @Input() category!: CategoryWithTypeType;
  @Input() type: string | null = null;
  open: boolean = false;
  activeParams: ActiveParamsType = {types: []};
  from: number | null = null;
  to: number | null = null;

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {

      this.activeParams = ActiveParamsUtil.processParams(params);

      if(this.type) {
        if(this.type === 'height') {
          if(this.activeParams.heightFrom || this.activeParams.heightTo) {
            this.open = true;
          }
          this.from = this.activeParams.heightFrom ? +this.activeParams.heightFrom : null;
          this.to = this.activeParams.heightTo ? +this.activeParams.heightTo : null;
        } else if(this.type === 'diameter') {
          if(this.activeParams.diameterFrom || this.activeParams.diameterTo) {
            this.open = true;
          }
          this.from = this.activeParams.diameterFrom ? +this.activeParams.diameterFrom : null;
          this.to = this.activeParams.diameterTo ? +this.activeParams.diameterTo : null;
        }
      } else {
        if(params['types']) {
          this.activeParams.types = Array.isArray(params['types']) ? params['types'] : [params['types']];

          if(this.category && this.category.types && this.category.types.length > 0) {
            this.category.types.some(type => {
              const categoryOpen = this.activeParams.types.find(item =>  {
               return  type.url === item
              });
              if(categoryOpen) {
                this.open = true;
              }
            })
          }
        }
      }
    })
  }

  get title(): string {
    if (this.category) {
      return this.category.name;
    } else if (this.type) {
      if (this.type === 'height') {
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

  updateFilterParam(url: string, input: boolean): void {
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
    if (input) {
      if (!this.activeParams.types.includes(url)) {
        this.activeParams.types = [...this.activeParams.types, url];
        // this.activeParams.types.push(url);
      }
    } else {
      this.activeParams.types = this.activeParams.types.filter(str => str !== url)
    }

    this.activeParams.page = 1;
    this.router.navigate(['/catalog'], {queryParams: this.activeParams});
  }

  updateFilterParamFromTo(param: string, value: string): void {
    if (param === 'heightTo' || param === 'heightFrom' || param === 'diameterTo' || param === 'diameterFrom') {
      if (this.activeParams[param] && !value) {
        delete this.activeParams[param];
      } else {
        this.activeParams[param] = value;
      }

      this.activeParams.page = 1;
      this.router.navigate(['/catalog'], {queryParams: this.activeParams});
    }
  }


}
