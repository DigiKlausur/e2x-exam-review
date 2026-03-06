import { Routes } from '@angular/router';
import {LandingPage} from './components/pages/landing-page/landing-page';
import {ReviewPage} from './components/pages/review-page/review-page';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage
  },
  {
    path: 'review/:path',
    component: ReviewPage
  }
];
