import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BeerListComponent } from './beer-list/beer-list.component';
import { BeerFormComponent } from './beer-form/beer-form.component';
import { SingleBeerComponent } from './single-beer/single-beer.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'beers', component: BeerListComponent, canActivate: [AuthGuard] },
  { path: 'beer/:id', component: SingleBeerComponent, canActivate: [AuthGuard] },
  { path: 'new-beer', component: BeerFormComponent, canActivate: [AuthGuard] },
  { path: 'modify-beer/:id', component: BeerFormComponent, canActivate: [AuthGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'beers'},
  { path: '**', redirectTo: 'beers' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
