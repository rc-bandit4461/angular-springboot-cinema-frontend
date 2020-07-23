import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ServerService} from '../../services/server.service';
import {MatDialogRef} from '@angular/material/dialog';
import {AlertService} from 'ngx-alerts';
import {Router} from '@angular/router';

@Component({
  selector: 'app-addcity-dialog',
  templateUrl: './addcity-dialog.component.html',
  styleUrls: ['./addcity-dialog.component.css']
})
export class AddcityDialogComponent implements OnInit {
  addcityFormGroup: FormGroup;
constructor(private fb:FormBuilder,public route:Router,public alertService:AlertService,public server:ServerService,public dialogRef: MatDialogRef<AddcityDialogComponent>) {}
  ngOnInit(): void {
    this.addcityFormGroup = this.fb.group({
        name:[''],
        altitude:[''],
        latitude:[''],
        longitude:[''],
    })
  }

  onNoClick() {
  this.dialogRef.close(false);
  }

  onSubmit() {
      this.server.addCity(this.addcityFormGroup.value).subscribe(value => {
          this.alertService.success("City was added.");
          this.dialogRef.close(true);
      },error => {
          this.alertService.danger("Error while running the operation");
      })
    }

}
