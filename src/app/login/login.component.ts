import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from 'ngx-alerts';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
declare var $:any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;

  constructor(public route:Router,private auth:AuthService,private alertService:AlertService,private fb: FormBuilder) {
  }

  ngOnInit(): void {
    if(this.auth.isLoggedIn()) this.route.navigateByUrl('/');
    this.loginFormGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]]
    });
  }


  onSubmitForm($event: any) {
    if(this.loginFormGroup.valid){
      this.auth.login({
        username:this.loginFormGroup.get('username').value,
        password:this.loginFormGroup.get('password').value,
      }).then(result => {
        if(!result){
      this.alertService.warning("Invalid Credentials");
        }else {
      this.alertService.success("Logged in");
      $('#sidebar').removeClass('active');
      this.route.navigateByUrl('/');

        }
      })
    console.log($event);
    console.log(this.loginFormGroup.value);
    }else{
      this.alertService.info("Please fill the full form")
    }

  }
}
