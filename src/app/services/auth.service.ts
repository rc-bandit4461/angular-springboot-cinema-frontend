import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Role, User} from '../entities';
import {Router} from '@angular/router';
import {CommonService} from './common.service';
import {ServerService} from './server.service';
import {first} from 'rxjs/operators';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loggedIn = new BehaviorSubject<boolean>(false);
  public token: string;
  public user: User;
  public roles: Role[];


  constructor(private router: Router, public common: CommonService, private server: ServerService) {
    this.checkIfLoggedInMemory();
  }

  isAdmin(): boolean {
    for (let role of this.roles) {
      if (role.role == Role.ADMIN_ROLE) {
        return true;
      }
    }
    return false;
  }
  isOwner(): boolean {
    for (let role of this.roles) {
      if (role.role == Role.OWNER_ROLE) {
        return true;
      }
    }
    return false;
  }

  checkIfLoggedInMemory() {
    const userData = localStorage.getItem('user');
    if (userData) {
      console.log('Logged in from memory');
      const user = JSON.parse(userData);
      this.token = user.token;
      this.user = user.user;
      this.roles = user.roles;
      this.loggedIn.next(true);

    }
  }

  updateUserProfile(userDetails: { firstName: string, lastName: string }) {
    this.user.firstName = userDetails.firstName;
    this.user.lastName = userDetails.lastName;
    const userData = {
      token: this.token,
      user: this.user,
      auth: true,
      roles: this.roles
    };
    localStorage.setItem('user', JSON.stringify(userData));
  }

  async login(user: { username: any, password: any }) {
    try {
      let data = await this.server.authenticate(user).toPromise();
      if (data['token'] != undefined && data['auth'] == true) {
        this.token = <string> data['token'];
        this.user = <User> await this.server.getUserByEmail(user.username).toPromise();
        data = await this.server.getUserRoles(this.user).toPromise();
        this.roles = data['_embedded']['roles'];
        this.loggedIn.next(true);
        const userData = {
          token: this.token,
          user: this.user,
          auth: true,
          roles: this.roles
        };
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      }

    } catch (e) {
      console.log(e);
      return false;
    }
    return false;
  }

  isLoggedIn() {
    return this.loggedIn.getValue();
  }

  logout() {
    this.loggedIn.next(false);
    delete this.token;
    delete this.user;
    this.loggedIn.next(false);
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
}
