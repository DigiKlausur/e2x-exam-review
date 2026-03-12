import { Routes } from '@angular/router';
import {LandingPage} from './components/pages/landing-page/landing-page';
import {ReviewPage} from './components/pages/review-page/review-page';
import {ExamListPage} from './components/pages/exam-list-page/exam-list-page';
import {ExamEditorPage} from './components/pages/exam-editor-page/exam-editor-page';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage
  },
  {
    path: 'review/:id',
    component: ReviewPage
  },
  {
    path: 'manage',
    component: ExamListPage,
  },
  {
    path: 'manage/exam/:id',
    component: ExamEditorPage
  }
];
