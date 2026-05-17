/**
 * @summary Application routing configuration with semantic routes and child routes per bounded context.
 * @author Estudiante U202319440
 */
import { Routes } from '@angular/router';
import { HomeComponent } from './maintenance/monitoring/presentation/views/home.component';
import { PageNotFoundComponent } from './shared/presentation/views/page-not-found.component';
import { NewEditorComponent } from './support/editorial-staff/presentation/views/new-editor.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'support',
    children: [
      { path: 'editors/new', component: NewEditorComponent }
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];
