import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Role, User} from '../../entities';
import {ServerService} from '../../services/server.service';
import {AlertService} from 'ngx-alerts';
import {MatTable} from '@angular/material/table';
import {MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../services/auth.service';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {RolesDialogComponent} from '../roles-dialog/roles-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit {
  users: User[] = [];
  pageSizes: number[] = [2, 10, 25, 100];
  currentPageSize = this.pageSizes[0];
  displayedColumns: string[] = ['id', 'name', 'email','enabled', 'action'];
  isLoaded: boolean = false;
  @ViewChild('usersTable') citiesTableRef: MatTable<User>;
  @ViewChild('paginator') paginator: MatPaginatorIntl;
  totalElements: number;
  currentPage: number = 0;

  constructor(public auth: AuthService, public dialog: MatDialog, public server: ServerService, public alertService: AlertService) {
  }

  ngOnInit(): void {

  }

  private async initData() {
    try {
      let data = await this.server.getUsersPaging(0, this.currentPageSize).toPromise();
      console.log(data);
      this.users = data['_embedded']['users'];
      this.totalElements = data['page']['totalElements'];
    } catch (e) {
      console.log(e);
      this.alertService.danger('Error occured while loading data.');
    }
  }

  onClickMatHeaderCell(id: number) {
    console.log('clicked ' + id);
  }

  onDelete(user: User) {
    if (!confirm('Confirm')) {
      return;
    }
    this.server.geleteUser(user).subscribe(value => {
      this.alertService.success('Delete Success');
      this.loadData(this.currentPage, this.currentPageSize);
    }, error => {

      this.alertService.danger('Error occured while executing delete.');
    });
  }

  openDialog(user: User, toggleButton: boolean): void {

    const dialogRef = this.dialog.open(RolesDialogComponent, {
      width: '400px',
      data: {
        data: user,
        toggleButtons: toggleButton
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (!result) {
        return;
      }
      this.loadData(this.currentPage, this.currentPageSize);
      console.log(result);

    }, error => {
      console.log(error);
    });
  }

  ngAfterViewInit(): void {
    this.initData();
    console.log(this.citiesTableRef.renderRows());
  }

  async loadData(page: number, size: number) {
    try {
      let data = await this.server.getUsersPaging(page, size).toPromise();
      this.users = data['_embedded']['users'];
      this.totalElements = data['page']['totalElements'];
      this.currentPage = page;
      this.currentPageSize = size;
      this.citiesTableRef.renderRows();
    } catch (e) {
      console.log(e);
    }
  }

  onPage($event: PageEvent) {
    console.log($event);
    this.loadData($event.pageIndex, $event.pageSize);
  }
  isAdmin(user:User){
    for (let role of user.roles) {
          if(role.role == Role.ADMIN_ROLE) return true;
    }
    return false;
  }

  isOwner(user:User){
    for (let role of user.roles) {
          if(role.role == Role.OWNER_ROLE) return true;
    }
    return false;
  }

  onToggleDisable(user: User, $event: MatSlideToggleChange) {
    if(this.isOwner(user) || (this.isAdmin(user) && this.auth.isAdmin() && !this.auth.isOwner())){
      this.alertService.info("You dont have enough previleges to execute this operation");
      return;
    }
    if(this.isOwner(user)) {
      console.log("OWNER")
    }
    console.log(this.isAdmin(user));
    // return;
    this.server.toggleEnableUser(user).subscribe(value => {
      if (user.enabled) {
        this.alertService.success('User account disabled');
      } else {
        this.alertService.success('User account enabled');
      }
      user.enabled = !user.enabled;
    }, error => {
      console.log(error);
      this.alertService.danger('Error occured while executing procedure');

    });
  }
}
