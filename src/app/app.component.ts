import {Component, OnInit} from '@angular/core';
import {AddProjectionComponent} from './admin/add-projection/add-projection.component';
import {AuthService} from './services/auth.service';
import {Ville} from './entities';
import {ServerService} from './services/server.service';
import {AlertService} from 'ngx-alerts';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'CinemaFrontEnd';
  villes: Ville[] = [];

  constructor(private server: ServerService, private alert: AlertService, public auth: AuthService) {

  }

  onSidebarCollapse() {
    if (this.auth.isLoggedIn()) {
      $('#sidebar').toggleClass('active');
    }
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      $('#sidebar').removeClass('active');
    }
    if (this.auth.isLoggedIn() && this.auth.isAdmin()) {
      this.initData();
    }
  }

  logout() {
    this.auth.logout();
    $('#sidebar').addClass('active');

  }

  private async initData() {
    try {
      let data = await this.server.getVilles().toPromise();
      this.villes = data['_embedded']['villes'];
      for (let ville of this.villes) {
        data = await this.server.getCinemas(ville).toPromise();
        ville.cinemas = data['_embedded']['cinemas'];

      }
    } catch (e) {
      console.log(e);
      this.alert.danger('Error while loading data');
    }

  }
}
