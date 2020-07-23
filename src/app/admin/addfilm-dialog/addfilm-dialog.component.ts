import {Component, Inject, OnInit} from '@angular/core';
import {Categorie, Cinema, Film, FilmData, PlaceData, Salle, SalleSeances, Ville} from '../../entities';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {AlertService} from 'ngx-alerts';
import {ServerService} from '../../services/server.service';
import {FileValidator} from 'ngx-material-file-input';

@Component({
  selector: 'app-addfilm-dialog',
  templateUrl: './addfilm-dialog.component.html',
  styleUrls: ['./addfilm-dialog.component.css']
})
export class AddfilmDialogComponent implements OnInit {
  filmData: FilmData;
  isLoaded: boolean = false;
  public categories: Categorie[];
  ngOnInit(): void {
    this.loadData();
  }

  filmFormGroup: FormGroup;

  constructor(private fb: FormBuilder, public route: Router, public alertService: AlertService, public server: ServerService, public dialogRef: MatDialogRef<AddfilmDialogComponent>,) {
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  onNoClick() {
    console.log('noClicked');
    this.dialogRef.close(null);
  }

  async onSubmit() {
    console.log(this.filmData);
    console.log(this.filmFormGroup.value);
    let selectedCategorie: Categorie;
    for (let categorie of this.categories) {
      if (categorie.id == this.filmFormGroup.value.categorie) {
        selectedCategorie = categorie;
        break;
      }
    }
    let data = {
      titre: this.filmFormGroup.value.titre,
      realisateur: this.filmFormGroup.value.realisateur,
      duree: this.filmFormGroup.value.duree,
      description: this.filmFormGroup.value.description,
      dateSortie: this.filmFormGroup.value.dateSortie,
      categorie: selectedCategorie
    };
    try {
      let myFilm = await this.server.addFilm(data).toPromise();
      await this.server.addPhotoFilm(<Film> myFilm, this.filmFormGroup.value.photo._files[0]).toPromise();
      this.dialogRef.close(true);
      this.alertService.success('Movie added!');
    } catch (e) {
      console.log(e);
      this.alertService.danger('Error saving Data');
    }

  }

  private async loadData() {
    try {
      let data = await this.server.getCategories().toPromise();
      this.categories = data['_embedded']['categories'];
      this.filmFormGroup = this.fb.group({
        titre: [''],
        duree: [''],
        realisateur: [''],
        dateSortie: [''],
        description: [''],
        categorie: [''],
        photo: ['', [Validators.required]]
        // photo: [this.filmData.photo],
      });
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
