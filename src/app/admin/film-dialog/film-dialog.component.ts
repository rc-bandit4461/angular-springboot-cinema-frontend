import {Component, Inject, OnInit} from '@angular/core';
import {Categorie, Cinema, Film, FilmData, PlaceData, Salle, Ville} from '../../entities';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {AlertService} from 'ngx-alerts';
import {ServerService} from '../../services/server.service';
@Component({
  selector: 'app-film-dialog',
  templateUrl: './film-dialog.component.html',
  styleUrls: ['./film-dialog.component.css']
})
export class FilmDialogComponent implements OnInit {
  filmData: FilmData;
  isLoaded: boolean = false;
  public categories: Categorie[];
  ngOnInit(): void {
    this.filmData =this.data.data;
    console.log(this.filmData);
    this.loadData();
  }

  filmFormGroup: FormGroup;

  constructor(private fb: FormBuilder, public route: Router, public alertService: AlertService, public server: ServerService, public dialogRef: MatDialogRef<FilmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  onNoClick() {
    console.log('noClicked');
    this.dialogRef.close(null);
  }

  onSubmit() {
    console.log(this.filmData);
    console.log(this.filmFormGroup.value);
    let selectedCategorie: Categorie;
    // return;
    for (let categorie of this.categories) {
      if (categorie.id == this.filmFormGroup.value.categorie) {
        selectedCategorie = categorie;
        break;
      }
    }
    let data = {
      id: this.filmData.id,
      titre: this.filmFormGroup.value.titre,
      realisateur: this.filmFormGroup.value.realisateur,
      duree: this.filmFormGroup.value.duree,
      description: this.filmFormGroup.value.description,
      dateSortie: this.filmFormGroup.value.dateSortie,
      categorie: selectedCategorie
    };
    this.server.putFilm(data).subscribe(value => {
      this.dialogRef.close(this.filmData);
      this.alertService.success('Update success');
    }, error => {
      this.alertService.danger('Error saving place Data');
    });
  }

  private async loadData() {
    try {
      let data = await this.server.getCategories().toPromise();
      this.categories = data['_embedded']['categories'];
      this.filmFormGroup = this.fb.group({
        titre: [this.filmData.titre],
        duree: [this.filmData.duree],
        realisateur: [this.filmData.realisateur],
        dateSortie: [this.filmData.dateSortie],
        description: [this.filmData.description],
        categorie:[this.filmData.categorie.id]
        // photo: [this.filmData.photo],
      });
      if(!this.data.toggleButtons) this.filmFormGroup.disable();
      this.isLoaded = true;
    } catch (e) {
      console.log(e);
      this.alertService.danger('Error loading data');
      this.dialogRef.close(null);
    }
  }

  onReSet() {
    this.filmFormGroup.patchValue({
       titre: this.filmData.titre,
        duree: this.filmData.duree,
        realisateur: this.filmData.realisateur,
        dateSortie: this.filmData.dateSortie,
        description: this.filmData.description,
        // photo: this.filmData.photo,
    });
  }
}
