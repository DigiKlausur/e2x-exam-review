import { Routes } from '@angular/router';
import {LandingPage} from './components/pages/landing-page/landing-page';
import {ReviewPage} from './components/pages/review-page/review-page';
import {ExamListPage} from './components/pages/exam-list-page/exam-list-page';
import {ExamEditorPage} from './components/pages/exam-editor-page/exam-editor-page';
import {ReviewListPage} from './components/pages/review-list-page/review-list-page';
import oidcCanActivateGuard from './guards/oidc-can-activate-guard/oidc-can-activate-guard';
import {environment} from '../environments/environment';

const roleMappings = environment.openId.roleMappings;

export const routes: Routes = [
  {
    path: '',
    component: LandingPage
  },
  {
    path: 'review',
    component: ReviewListPage,
    data: { roles: [roleMappings.student, roleMappings.lecturer] },
    canActivate: [oidcCanActivateGuard]
  },
  {
    path: 'review/:assignmentId/:fileId',
    component: ReviewPage,
    data: { roles: [roleMappings.student, roleMappings.lecturer] },
    canActivate: [oidcCanActivateGuard]
  },
  {
    path: 'manage',
    component: ExamListPage,
    data: { roles: [roleMappings.lecturer] },
    canActivate: [oidcCanActivateGuard]
  },
  {
    path: 'manage/exam/:id',
    component: ExamEditorPage,
    data: { roles: [roleMappings.lecturer] },
    canActivate: [oidcCanActivateGuard]
  }
];
