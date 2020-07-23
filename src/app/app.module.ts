import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CinemaComponent} from './cinema/cinema.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AlertModule} from 'ngx-alerts';
import {CitiesListComponent} from './cities-list/cities-list.component';
import {CdkTableModule} from '@angular/cdk/table';
import {MatTable, MatTableModule} from '@angular/material/table';
import {MatSliderModule} from '@angular/material/slider';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatDialogModule} from '@angular/material/dialog';
import {ModifyCityDialogComponent} from './cities/modify-city-dialog/modify-city-dialog.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {A11yModule} from '@angular/cdk/a11y';
import {MatPaginatorModule} from '@angular/material/paginator';
import { SallesListComponent } from './salles-list/salles-list.component';
import { CinemasListComponent } from './admin/cinemas-list/cinemas-list.component';
import { CinemaDialogComponent } from './admin/cinema-dialog/cinema-dialog.component';
import {MatSelectModule} from '@angular/material/select';
import { SalleDialogComponent } from './admin/salle-dialog/salle-dialog.component';
import { PlacesListComponent } from './admin/places-list/places-list.component';
import { PlacesDialogComponent } from './admin/places-dialog/places-dialog.component';
import { FilmsComponent } from './admin/films/films.component';
import { FilmDialogComponent } from './admin/film-dialog/film-dialog.component';
import { AddfilmDialogComponent } from './admin/addfilm-dialog/addfilm-dialog.component';
import {MatIconModule} from '@angular/material/icon';
import {MaterialFileInputModule} from 'ngx-material-file-input';
import { ProjectionsListComponent } from './admin/projections-list/projections-list.component';
import { AddProjectionComponent } from './admin/add-projection/add-projection.component';
import { LoginComponent } from './login/login.component';
import {MatCardModule} from '@angular/material/card';
import { AddcityDialogComponent } from './admin/addcity-dialog/addcity-dialog.component';
import { AddcinemaDialogComponent } from './admin/addcinema-dialog/addcinema-dialog.component';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './admin/users/users.component';
import { RegisterComponent } from './register/register.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { RolesDialogComponent } from './admin/roles-dialog/roles-dialog.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    CinemaComponent,
    CitiesListComponent,
    ModifyCityDialogComponent,
    SallesListComponent,
    CinemasListComponent,
    CinemaDialogComponent,
    SalleDialogComponent,
    PlacesListComponent,
    PlacesDialogComponent,
    FilmsComponent,
    FilmDialogComponent,
    AddfilmDialogComponent,
    ProjectionsListComponent,
    AddProjectionComponent,
    LoginComponent,
    AddcityDialogComponent,
    AddcinemaDialogComponent,

    ProfileComponent,
    UsersComponent,
    RegisterComponent,
    RolesDialogComponent
  ],
  imports: [
    BrowserModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    A11yModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatIconModule,
    MaterialFileInputModule,
    MatDialogModule,
    MatTableModule,
    MatSliderModule,
    MatButtonModule,
    CdkTableModule,
    AlertModule.forRoot({maxMessages: 5, timeout: 5000, position: 'right'}),
    MatButtonToggleModule,
    MatCardModule,
    MatSlideToggleModule,
    MatDatepickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
