import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {NgIf} from '@angular/common';
import {LoaderService} from '../../../services/loader.service';

@Component({
  selector: 'loader',
  standalone: true,
  imports: [
    MatProgressSpinner,
    NgIf
  ],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LoaderComponent implements OnInit {
  private LoaderService = inject(LoaderService)

  isShowed: boolean = false;

  ngOnInit() {
    this.LoaderService.isShowed$.subscribe((isShowed: boolean) => {
      this.isShowed = isShowed
    })
  }

}
