import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveroomComponent } from './livesession/liveroom/liveroom.component';
import { FormsModule } from '@angular/forms';


// routing
const routes: Routes = [
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path: 'subjects',
    loadChildren: () => import('./subjects/subject.module').then(m => m.SubjectModule)
  },
  {
    path: 'portals',
    loadChildren: () => import('./portals/portal.module').then(m => m.PortalModule)
  },
  {
    path: 'stages',
    loadChildren: () => import('./stages/stage.module').then(m => m.StageModule)
  },
  {
    path: 'courses',
    loadChildren: () => import('./courses/course.module').then(m => m.CourseModule)
  },
  {
    path: 'course-class',
    loadChildren: () => import('./courseClass/courseClass.module').then(m => m.CourseClassModule)
  },
  {
    path: 'course-student',
    loadChildren: () => import('./courseStudent/courseStudent.module').then(m => m.CourseStudentModule)
  },
  {
    path: 'payout-requests',
    loadChildren: () => import('./payout-requests/new-payout-requests.module').then(m => m.PayoutRequestsModule)
  },
  {
    path: 'transaction-history',
    loadChildren: () => import('./transactionList/transactionList.module').then(m => m.TransactionListModule)
  },
  {
    path: 'quizes',
    loadChildren: () => import('./quizes/quiz.module').then(m => m.QuizModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notification.module').then(m => m.NotificationModule)
  },
  {
    path: 'support',
    loadChildren: () => import('./support/support.module').then(m => m.SupportModule)
  },
  {
    path: 'termsAndConditions',
    loadChildren: () => import('./termsAndConditions/termsAndConditions.module').then(m => m.TermsAndConditionsModule)
  },
];

@NgModule({
  declarations: [
    LiveroomComponent,
            

  ],
  imports: [CommonModule, RouterModule.forChild(routes),FormsModule]
})
export class AppsModule { }
