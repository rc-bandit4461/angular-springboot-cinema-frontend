import {Component, Inject, OnInit} from '@angular/core';
import {Cinema, SalleData, Ville} from '../../entities';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertService} from 'ngx-alerts';
import {ServerService} from '../../services/server.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-salle-dialog',
  templateUrl: './salle-dialog.component.html',
  styleUrls: ['./salle-dialog.component.css']
})
export class SalleDialogComponent implements OnInit {
  salleData: SalleData;
  cinemas: Cinema[];
  isLoaded: boolean = false;
  currentVille:Ville;
  ngOnInit(): void {
    this.salleData = this.data.data;
    this.loadCinemas();
  }

  salleFormGroup: FormGroup;

  constructor(private fb: FormBuilder, public route: Router, public alertService: AlertService, public server: ServerService, public dialogRef: MatDialogRef<SalleDialogComponent>,
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
    console.log(this.salleData);
    console.log(this.salleFormGroup.value);
    let selectedCinema: Cinema;
    for (let cinema of this.cinemas) {
      if (cinema.id == this.salleFormGroup.value.cinema) {
        selectedCinema = cinema;
        break;
      }
    }
    let data = {
      id: this.salleData.id,
      name: this.salleFormGroup.value.name,
      nombrePlaces: this.salleFormGroup.value.nombrePlaces,
      cinema: selectedCinema
    };
    this.server.putSalle(data).subscribe(value => {
      this.dialogRef.close(this.salleData);
      this.alertService.success('Update success');
    }, error => {
      this.alertService.danger('Error saving City Data');
    });
  }

  onSalles() {
    this.route.navigateByUrl('/admin/salles/' + this.salleData.id);
    this.dialogRef.close(null);
  }

  private async loadCinemas() {
    try {
      this.currentVille = await this.server.getVilleByCinema(this.salleData.cinema).toPromise();
      let data = await this.server.getCinemas(this.currentVille).toPromise();
      this.cinemas = data['_embedded']['cinemas'];
      this.isLoaded = true;
      this.salleFormGroup = this.fb.group({
        name: [this.salleData.name],
        nombrePlaces: [this.salleData.nombrePlaces],
        cinema: [this.salleData.cinema.id]
      });
      if(!this.data.toggleButtons) this.salleFormGroup.disable();
    } catch (e) {
      console.log(e);
      this.alertService.danger('Error loading data');
      this.dialogRef.close(null);
    }
  }

  onReSet() {
    this.salleFormGroup.patchValue({
      cinema: this.salleData.cinema.id,
      name: this.salleData.name,
      nombrePlaces: this.salleData.nombrePlaces
    });
  }

  onGetPlaces() {
      this.route.navigateByUrl('/admin/places/' +this.salleData.cinema.id);
  }
}
