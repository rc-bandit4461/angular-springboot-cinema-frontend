import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AlertService} from 'ngx-alerts';
import {ServerService} from '../../services/server.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Role, User} from '../../entities';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-roles-dialog',
  templateUrl: './roles-dialog.component.html',
  styleUrls: ['./roles-dialog.component.css']
})
export class RolesDialogComponent implements OnInit {
    roles:Role[] = [];
  public user: User;
  rolesFormDialog: FormGroup;
  isLoaded:boolean = false;
  ngOnInit(): void {
    this.user = this.data.data;
    this.loadData();
  }

constructor(private fb:FormBuilder,public route:Router,public alertService:AlertService,public server:ServerService,public dialogRef: MatDialogRef<RolesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  closeDialog() {
    this.dialogRef.close(null);
  }

  onNoClick() {
    console.log("noClicked");
    this.dialogRef.close(null);
  }

  onSubmit() {
    console.log(this.rolesFormDialog.get('roles').value);
    let userDetails = {
      firstName: this.rolesFormDialog.get('firstName').value,
      id: this.user.id,
      lastName: this.rolesFormDialog.get('lastName').value,
      password: this.rolesFormDialog.get('password').value,
      email: this.rolesFormDialog.get('email').value,
      roles: this.rolesFormDialog.get('roles').value,
    }

    this.server.updateUser(userDetails).subscribe(value => {
        this.alertService.success("Update success");
        this.dialogRef.close(true);
      },error => {
      console.log(error);
        this.alertService.danger("Error occured while updating");

    });
  }


  private async loadData() {
      try {
        let data = await this.server.getRoles().toPromise();
        this.roles = data['_embedded']['roles'];
        // let filteredRoles = this.roles;
        // this.roles = [];
        // for (let filteredRole of filteredRoles) {
        //       if(filteredRole.role != Role.OWNER_ROLE) this.roles.push(filteredRole);
        // }
        let userRoles = [];
        for (let role of this.user.roles) {
          console.log(role.role);
          for (let role1 of this.roles) {
                  if(role.id == role1.id) userRoles.push(role.id);
          }
        }
        this.isLoaded = true;
        this.rolesFormDialog = this.fb.group({
          firstName:[this.user.firstName],
          lastName:[this.user.lastName],
          email:[this.user.email],
          password:[this.user.password],
          roles:[]
        })
        if(this.data.toggleButton) this.rolesFormDialog.disable();
        this.rolesFormDialog.patchValue({
          roles:userRoles
        });
      }catch (e) {
        console.log(e);
      }
  }

  isOwnerRole(role: Role) {
      return role.role == Role.OWNER_ROLE;
  }
}
