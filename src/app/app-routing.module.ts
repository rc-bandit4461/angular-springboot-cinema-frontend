import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CinemaComponent} from './cinema/cinema.component';
import {CitiesListComponent} from './cities-list/cities-list.component';
import {SallesListComponent} from './salles-list/salles-list.component';
import {CinemasListComponent} from './admin/cinemas-list/cinemas-list.component';
import {PlacesListComponent} from './admin/places-list/places-list.component';
import {FilmsComponent} from './admin/films/films.component';
import {Projection} from './entities';
import {ProjectionsListComponent} from './admin/projections-list/projections-list.component';
import {LoginComponent} from './login/login.component';
import {ProfileComponent} from './profile/profile.component';
import {RegisterComponent} from './register/register.component';
import {UsersComponent} from './admin/users/users.component';


const routes: Routes = [
  {
    path: 'cinema',
    component: CinemaComponent
  },
  {
    path: '',
    component: CinemaComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
   {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'admin/cities',
    component: CitiesListComponent
  },
  {
    path: 'admin/salles/:cinemaId',
    component: SallesListComponent
  },
  {
    path: 'admin/cinemas/:cityId',
    component: CinemasListComponent
  },
   {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin/places/:salleId',
    component: PlacesListComponent
  },
  {
    path: 'admin/films',
    component: FilmsComponent
  },
  {
    path: 'admin/projections/byCinema/:cinemaId',
    component: ProjectionsListComponent
  }
   , {
    path: 'admin/users',
    component: UsersComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
