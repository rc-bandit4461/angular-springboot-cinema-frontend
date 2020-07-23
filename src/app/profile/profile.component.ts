import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {ServerService} from '../services/server.service';
import {AlertService} from 'ngx-alerts';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileFormGroup: FormGroup;

  constructor(private alertService:AlertService,private fb:FormBuilder,private auth:AuthService,private server:ServerService) { }

  ngOnInit(): void {
    this.profileFormGroup = this.fb.group({
      firstName:[this.auth.user.firstName,[Validators.required]],
      lastName:[this.auth.user.lastName,[Validators.required]],
      password:[''],
      passwordConfirmation:[''],
    })
  }

  onSubmit(value: any) {
    this.server.updateUserProfile({
      firstName:this.profileFormGroup.get('firstName').value,
      lastName:this.profileFormGroup.get('lastName').value,
      password:this.profileFormGroup.get('password').value,
      id:this.auth.user.id
    }).subscribe(value1 => {
        this.auth.updateUserProfile({firstName:this.profileFormGroup.get('firstName').value,lastName:this.profileFormGroup.get('lastName').value})
        this.alertService.success("Update operation success");

    },error => {
        this.alertService.danger("Update operation failed");
      console.log(error);
    })
  }
}
