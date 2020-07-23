import {Component, Inject, OnInit} from '@angular/core';
import {Cinema, PlaceData, Salle, Ville} from '../../entities';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {AlertService} from 'ngx-alerts';
import {ServerService} from '../../services/server.service';

@Component({
  selector: 'app-places-dialog',
  templateUrl: './places-dialog.component.html',
  styleUrls: ['./places-dialog.component.css']
})
export class PlacesDialogComponent implements OnInit {
  placeData: PlaceData;
  salles: Salle[];
  isLoaded: boolean = false;
  currentSalle:Salle;
  private currentCinema: Cinema;
  ngOnInit(): void {
    this.placeData = this.data.data;
    this.loadSalles();
  }

  placeFormGroup: FormGroup;

  constructor(private fb: FormBuilder, public route: Router, public alertService: AlertService, public server: ServerService, public dialogRef: MatDialogRef<PlacesDialogComponent>,
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
    console.log(this.placeData);
    console.log(this.placeFormGroup.value);
    let selectedSalle: Salle;
    for (let salle of this.salles) {
      if (salle.id == this.placeFormGroup.value.salle) {
        selectedSalle = salle;
        break;
      }
    }
    let data = {
      id: this.placeData.id,
      longitude: this.placeFormGroup.value.longitude,
      latitude: this.placeFormGroup.value.latitude,
      altitude: this.placeFormGroup.value.altitude,
      numero: this.placeFormGroup.value.numero,
      salle: selectedSalle
    };
    this.server.putPlace(data).subscribe(value => {
      this.dialogRef.close(this.placeData);
      this.alertService.success('Update success');
    }, error => {
      this.alertService.danger('Error saving place Data');
    });
  }

  onSalles() {
    this.route.navigateByUrl('/admin/salles/' + this.placeData.id);
    this.dialogRef.close(null);
  }

  private async loadSalles() {
    try {
      this.currentCinema = await this.server.getCinemaBySalle(this.placeData.salle).toPromise();
      let data = await this.server.getSalles(this.currentCinema).toPromise();
      this.salles = data['_embedded']['salles'];
      this.isLoaded = true;
      this.placeFormGroup = this.fb.group({
        numero: [this.placeData.numero],
        altitude: [this.placeData.altitude],
        longitude: [this.placeData.longitude],
        latitude: [this.placeData.latitude],
        salle: [this.placeData.salle.id]
      });
      if(!this.data.toggleButtons) this.placeFormGroup.disable();
    } catch (e) {
      console.log(e);
      this.alertService.danger('Error loading data');
      this.dialogRef.close(null);
    }
  }

  onReSet() {
    this.placeFormGroup.patchValue({
      numero: this.placeData.numero,
        altitude: this.placeData.altitude,
        longitude: this.placeData.longitude,
        latitude: this.placeData.latitude,
        salle: this.placeData.salle.id
    });
  }

  onGetPlaces() {
      this.route.navigateByUrl('/admin/places/' +this.placeData.salle.id);
      this.dialogRef.close(null);
  }
}
