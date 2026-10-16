import { Routes } from '@angular/router';
import {LandingPage} from './components/pages/landing-page/landing-page';
import {ReviewPage} from './components/pages/review-page/review-page';
import {ExamListPage} from './components/pages/exam-list-page/exam-list-page';
import {ExamEditorPage} from './components/pages/exam-editor-page/exam-editor-page';
import {ReviewListPage} from './components/pages/review-list-page/review-list-page';
import {environment} from '../environments/environment';
import {keycloakAuthGuard} from './guards/keycloak-auth-guard/keycloak-auth-guard';

const roleMappings = environment.keycloak.roleMappings;

export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
    canActivate: [keycloakAuthGuard]
  },
  {
    path: 'review',
    component: ReviewListPage,
    data: { roles: [roleMappings.student, roleMappings.lecturer] },
    canActivate: [keycloakAuthGuard]
  },
  {
    path: 'review/:assignmentId/:fileId',
    component: ReviewPage,
    data: { roles: [roleMappings.student, roleMappings.lecturer] },
    canActivate: [keycloakAuthGuard]
  },
  {
    path: 'manage',
    component: ExamListPage,
    data: { roles: [roleMappings.lecturer] },
    canActivate: [keycloakAuthGuard]
  },
  {
    path: 'manage/exam/:id',
    component: ExamEditorPage,
    data: { roles: [roleMappings.lecturer] },
    canActivate: [keycloakAuthGuard]
  }
];
