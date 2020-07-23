import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {AlertService} from 'ngx-alerts';
import {ServerService} from '../../services/server.service';
import {CinemaData, Ville} from '../../entities';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-cinema-dialog',
  templateUrl: './cinema-dialog.component.html',
  styleUrls: ['./cinema-dialog.component.css']
})
export class CinemaDialogComponent implements OnInit {
  cinemaData: CinemaData;
  cities: Ville[];
  isLoaded: boolean = false;

  ngOnInit(): void {
    this.cinemaData = this.data.data;
    this.loadCities();
  }

  cinemaFormGroup: FormGroup;

  constructor(private fb: FormBuilder, public route: Router, public alertService: AlertService, public server: ServerService, public dialogRef: MatDialogRef<CinemaDialogComponent>,
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
    console.log(this.cinemaData);
    console.log(this.cinemaFormGroup.value);
    let selectedVille: Ville;
    for (let city of this.cities) {
      if (city.id == this.cinemaFormGroup.value.city) {
        selectedVille = city;
        break;
      }
    }
    let data = {
      id: this.cinemaData.id,
      name: this.cinemaFormGroup.value.name,
      longitude: this.cinemaFormGroup.value.longitude,
      altitude: this.cinemaFormGroup.value.altitude,
      latitude: this.cinemaFormGroup.value.latitude,
      ville: selectedVille
    };
    this.server.putCinema(data).subscribe(value => {
      this.dialogRef.close(this.cinemaData);
      this.alertService.success('Update success');
    }, error => {
      this.alertService.danger('Error saving City Data');
    });
  }

  onSalles() {
    this.route.navigateByUrl('/admin/salles/' + this.cinemaData.id);
    this.dialogRef.close(null);
  }

  private async loadCities() {
    try {
      let data = await this.server.getVilles().toPromise();
      this.cities = data['_embedded']['villes'];
      this.isLoaded = true;
      this.cinemaFormGroup = this.fb.group({
        name: [this.cinemaData.name],
        altitude: [this.cinemaData.altitude],
        longitude: [this.cinemaData.longitude],
        latitude: [this.cinemaData.latitude],
        city: [this.cinemaData.ville.id]
      });
      if(!this.data.toggleButtons) this.cinemaFormGroup.disable();
    } catch (e) {
      console.log(e);
      this.alertService.danger('Error loading data');
      this.dialogRef.close(null);
    }
  }

  onSet() {
    this.cinemaFormGroup.patchValue({
      city: this.cinemaData.ville.id
    });
  }
}
