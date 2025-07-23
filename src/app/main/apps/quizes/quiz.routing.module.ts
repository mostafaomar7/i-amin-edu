import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { NewQuizComponent } from './new-quiz/new-quiz.component';
import { QuizPreviewComponent } from './quiz-view/quiz-preview.component';


// routing
const routes: Routes = [
    {
        path: 'list',
        component: QuizListComponent,
        data: { animation: 'QuizListComponent' }
    },
    {
        path: 'quiz-list/view',
        component: QuizPreviewComponent,
    },
    {
        path: 'list/new',
        component: NewQuizComponent,
    },
    {
        path: 'list/new/:id',
        component: NewQuizComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class QuizRoutingModule { }