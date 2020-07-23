import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { CityData} from '../../entities';
import {ServerService} from '../../services/server.service';
import {AlertService} from 'ngx-alerts';
import {Router} from '@angular/router';

@Component({
  selector: 'app-modify-city-dialog',
  templateUrl: './modify-city-dialog.component.html',
  styleUrls: ['./modify-city-dialog.component.css']
})
export class ModifyCityDialogComponent implements OnInit {
  cityData:CityData;

  ngOnInit(): void {
    this.cityData = this.data.data;
  }
constructor(public route:Router,public alertService:AlertService,public server:ServerService,public dialogRef: MatDialogRef<ModifyCityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  closeDialog() {
    this.dialogRef.close(null);
  }

  onNoClick() {
    console.log("noClicked");
    this.dialogRef.close(null);
  }

  onSubmit() {
    this.server.putVille(this.cityData).subscribe(value => {
        this.dialogRef.close(this.cityData);
        this.alertService.success("Update success");
    },error => {
        this.alertService.danger("Error saving City Data");
    })
  }

  onSalles() {
    this.route.navigateByUrl('/admin/cinemas/' + this.cityData.id);
    this.dialogRef.close(null);
  }
}
