import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertService} from 'ngx-alerts';
import {ServerService} from '../../services/server.service';
import {MatDialogRef} from '@angular/material/dialog';
import {Ville} from '../../entities';

@Component({
  selector: 'app-addcinema-dialog',
  templateUrl: './addcinema-dialog.component.html',
  styleUrls: ['./addcinema-dialog.component.css']
})
export class AddcinemaDialogComponent implements OnInit {
  cities: Ville[] = [];
  isLoaded = false;
  addCinemaFormGroup: FormGroup;

  constructor(private fb: FormBuilder, public route: Router, public alertService: AlertService, public server: ServerService, public dialogRef: MatDialogRef<AddcinemaDialogComponent>) {
  }

  ngOnInit(): void {
    this.initData();
  }

  private async initData() {
    try {
      let data = await this.server.getVilles().toPromise();
      this.cities = data['_embedded']['villes'];
      this.addCinemaFormGroup = this.fb.group({
        name:[''],
        altitude:[''],
        latitude:[''],
        longitude:[''],

      })
      this.isLoaded = true;
    } catch (e) {
      console.log(e);
      this.alertService.danger('Error while loading data');
    }
  }
}
