import {Component, inject, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import localeRu from '@angular/common/locales/ru';
import {registerLocaleData, ViewportScroller} from '@angular/common';
import {LoaderComponent} from './components/common/loader/loader.component';
import {filter} from 'rxjs';
registerLocaleData(localeRu);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private viewportScroller = inject(ViewportScroller);
  private scrollPositions = new Map<string, [number, number]>();
  private lastUrl: string | null = null;

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && this.lastUrl) {
        this.scrollPositions.set(this.lastUrl, this.viewportScroller.getScrollPosition());
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const fragment = window.location.hash.slice(1);
      if (fragment) {
        setTimeout(() => {
          const el = document.getElementById(fragment);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            this.viewportScroller.scrollToPosition([0, 0]);
          }
        }, 100);
      } else {
        const position = this.scrollPositions.get(event.urlAfterRedirects);
        if (position) {
          setTimeout(() => this.viewportScroller.scrollToPosition(position), 50);
        } else {
          this.viewportScroller.scrollToPosition([0, 0]);
        }
      }
      this.lastUrl = event.urlAfterRedirects;
    });
  }
}
