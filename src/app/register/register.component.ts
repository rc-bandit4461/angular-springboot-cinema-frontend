import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ServerService} from '../services/server.service';
import {AlertService} from 'ngx-alerts';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  profileFormGroup: FormGroup;

  constructor(private route:Router,private fb:FormBuilder,private server:ServerService,private alertService:AlertService) { }

 ngOnInit(): void {
    this.profileFormGroup = this.fb.group({
      firstName:['',[Validators.required,Validators.minLength(3)]],
      lastName:['',[Validators.required,Validators.minLength(3)]],
      email:['',[Validators.required,Validators.email]],
      password:['',Validators.required],
      passwordConfirmation:['',Validators.required],
    })
  }

  onSubmit(value: any) {
      if(this.profileFormGroup.invalid || this.profileFormGroup.get('password').value != this.profileFormGroup.get('passwordConfirmation').value){
        this.alertService.info("Invalid form");
        return;
      }
      let userDetails = {
        firstName:this.profileFormGroup.get('firstName').value,
        lastName:this.profileFormGroup.get('lastName').value,
        email:this.profileFormGroup.get('email').value,
        password:this.profileFormGroup.get('password').value,
      }
      this.server.register(userDetails).subscribe(value1 => {
        this.alertService.success("Registration  successful");
        this.route.navigateByUrl('/login');
      },error => {
        this.alertService.info("Error occured while executing registration procedure");

      })
    console.log(this.profileFormGroup.value);
  }
}
