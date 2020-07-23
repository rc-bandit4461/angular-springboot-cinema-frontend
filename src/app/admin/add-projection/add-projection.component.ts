import {Component, Inject, OnInit} from '@angular/core';
import {Categorie, Cinema, Film, FilmData, PlaceData, Salle, SalleSeances, Seance, Ville} from '../../entities';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {AlertService} from 'ngx-alerts';
import {ServerService} from '../../services/server.service';
import {MatSelectChange} from '@angular/material/select';
import {$e} from 'codelyzer/angular/styles/chars';
@Component({
  selector: 'app-add-projection',
  templateUrl: './add-projection.component.html',
  styleUrls: ['./add-projection.component.css']
})
export class AddProjectionComponent implements OnInit {
  filmData: FilmData;
  isLoaded: boolean = false;
  public categories: Categorie[] = [];
  public films: Film[] = [];
  public currentCinema:Cinema;
  public salleSeancesList:SalleSeances[]= [];
  private salles: Salle[] = [];
  private seances: Seance[] = [];

  ngOnInit(): void {
    this.currentCinema = this.data.cinema;
    console.log(this.currentCinema);
    this.loadData();
  }

  projectionFormGroup: FormGroup;

  constructor(private fb: FormBuilder, public route: Router, public alertService: AlertService, public server: ServerService, public dialogRef: MatDialogRef<AddProjectionComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  onNoClick() {
    console.log('noClicked');
    this.dialogRef.close(null);
  }

  async onSubmit() {
    console.log(this.projectionFormGroup.value);
    // for (let salleSeance of this.salleSeancesList) {
    //   console.log(salleSeance.salle.formControl);
    // }

    let salleSeances = [];
    for (let salleSeance of this.salleSeancesList) {
      if(salleSeance.salle.formControl.value){
        salleSeances.push({
          salleId:salleSeance.salle.id,
          seances:salleSeance.salle.formControl.value
        })
      }
    }
     let data = {
      filmId:this.projectionFormGroup.get('film').value,
      dateProjection:this.projectionFormGroup.get('dateProjection').value,
      prix:this.projectionFormGroup.get('prix').value,
       salleSeances:salleSeances
    }
    this.server.addProjection(data).subscribe(value => {
      this.alertService.success("Projections added!");
      this.dialogRef.close(true);

    },error => {
      console.log(error);
      this.alertService.danger("Error while saving data");
    })
    // let selectedCategorie: Categorie;
    // for (let categorie of this.categories) {
    //   if (categorie.id == this.projectionFormGroup.value.categorie) {
    //     selectedCategorie = categorie;
    //     break;
    //   }
    // }
    // let data = {
    //   titre: this.projectionFormGroup.value.titre,
    //   realisateur: this.projectionFormGroup.value.realisateur,
    //   duree: this.projectionFormGroup.value.duree,
    //   description: this.projectionFormGroup.value.description,
    //   dateSortie: this.projectionFormGroup.value.dateSortie,
    //   categorie: selectedCategorie
    // };
    // try {
    //   let myFilm = await this.server.addFilm(data).toPromise();
    //   await this.server.addPhotoFilm(<Film> myFilm, this.projectionFormGroup.value.photo._files[0]).toPromise();
    //   this.dialogRef.close(true);
    //   this.alertService.success('Movie added!')
    // } catch (e) {
    //   console.log(e);
    //   this.alertService.danger('Error saving Data');
    // }
    //
  }
  private updateForm(){
    let formContols = [];
    // for (let salle of this.salles) {
    //       salle.formControl = new FormControl();
    //       formContols.push(salle.formControl);
    // }
    for(let salleSeances of this.salleSeancesList){
          salleSeances.salle.formControl = new FormControl();
          formContols.push(salleSeances.salle.formControl);

    }
      let formArray = new FormArray(formContols);
      let salleFormGroup = this.fb.group(formArray);
      if(!this.projectionFormGroup){
         this.projectionFormGroup = this.fb.group({
        categorie:[''],
        prix:[''],
        dateProjection:[''],
        film:[''],
        salleSeances: this.fb.array(formContols)
        // photo: [this.filmData.photo],
      });
      }
      else
      this.projectionFormGroup = this.fb.group({
        categorie:[this.projectionFormGroup.get('categorie').value],
        dateProjection:[this.projectionFormGroup.get('dateProjection').value],
        film:[this.projectionFormGroup.get('film').value],
        prix:[this.projectionFormGroup.get('prix').value],
        salleSeances: this.fb.array(formContols)
        // photo: [this.filmData.photo],
      });


  }
  private async loadData() {
    try {
      let data = await this.server.getCategories().toPromise();
      this.categories = data['_embedded']['categories'];
      await this.loadSalles();
      this.updateForm();
      this.projectionFormGroup.get('film').disable();
      this.isLoaded = true;
    } catch (e) {
      console.log(e);
      this.alertService.danger('Error loading data');
      this.dialogRef.close(null);
    }
  }
    private async loadSalles(){
    let data = await this.server.getSallesByCinema(this.currentCinema).toPromise();
      this.salles = <Salle[]>data['_embedded']['salles'];
      data = await this.server.getSeances().toPromise();
      this.seances = <Seance[]>data['_embedded']['seances'];
      for (let salle of this.salles) {
            salle.seances = [];
        for (let seance of this.seances) {
                salle.seances.push(seance);
        }
      }
    }
  onReSet() {
    this.projectionFormGroup.reset();
    this.projectionFormGroup.get('film').disable();
  }

  onChangeCategorie($event: MatSelectChange) {
    console.log(this.projectionFormGroup.value.categorie);
    if(!this.projectionFormGroup.value.categorie) return;
    for (let category of this.categories) {
        if(category.id == this.projectionFormGroup.value.categorie){
          this.loadFilms(category);

          return;
        }
    }
  }

  private async loadFilms(categorie:Categorie) {
        try {
      let data = await this.server.getFilmsByCategorie(categorie).toPromise();
      this.films = <Film[]>data['_embedded']['films'];
      this.projectionFormGroup.get('film').enable();
    this.updateForm();
    } catch (e) {
      console.log(e);
      this.alertService.danger('Error loading data');
    }
  }
  private async loadSalleSeances(cinema,date){
    try {
       this.salleSeancesList = <SalleSeances[]>await this.server.getFreeSeances(cinema,date).toPromise();
      console.log(this.salleSeancesList);
      for (let salle of this.salles) {
        for (let salleSeance of this.salleSeancesList) {
              if(salle.id == salleSeance.salle.id){

              }
        }
      }

      this.updateForm();
    }catch (e) {
      this.alertService.danger('Error loading data');

    }
  }
  onChangeDateProjection() {
      let date:Date = this.projectionFormGroup.get('dateProjection').value;
      this.loadSalleSeances(this.currentCinema,date);
  }
}
