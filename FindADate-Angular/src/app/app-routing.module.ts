import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { SearchFormComponent } from './search-form/search-form.component';
import {AppComponent} from './app.component';
import {AuthenticationComponent} from './authentication/authentication.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: AuthenticationComponent},
  {path: 'search', component: SearchFormComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
