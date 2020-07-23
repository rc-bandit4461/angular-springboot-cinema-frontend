import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CommonService} from '../services/common.service';
import {Ville, Seance, Links, Cinema, Ticket, Entity, Projection, Categorie, Film, Link, Place, Salle, Page} from '../entities';
import {ServerService} from '../services/server.service';
import {tick} from '@angular/core/testing';
import {AlertService} from 'ngx-alerts';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {
  villes: Ville[];
  cinemas: Cinema[];
  currentVille: Ville;
  currentCinema: Cinema;
  public salles: Salle[];
  ticketsPageSize: number = 9;
  projectionDate:Date =  new Date();

  constructor(public auth:AuthService, private server: ServerService, public common: CommonService, private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.initData();
  }

  private async initData() {
    try {
      let data = await this.server.getVilles().toPromise();
      this.villes = <Ville[]> data['_embedded']['villes'];
    } catch (e) {
      this.alertService.danger('Error occured while loading the data.');
      console.log(e);
    }
  }

  async onGetCinemas(ville: Ville) {
    this.salles = null;
    this.currentCinema = null;
    this.currentVille = ville;
    try {
      let data = await this.server.getCinemas(ville).toPromise();
      this.cinemas = <Cinema[]> data['_embedded']['cinemas'];
    } catch (e) {
      this.alertService.danger('Error occured while loading the data.');
      console.log(e);
    }
  }

  async onGetSalles(cinema: Cinema) {
    try {
      this.currentCinema = cinema;
      let data = await this.server.getSalles(cinema).toPromise();
      this.salles = <Salle[]> data['_embedded']['salles'];
      for (const salle of this.salles) {
        this.loadProjections(salle).then(r => {
          console.log('FINISHED SALLE');
        });
      }
    } catch (e) {
      this.alertService.danger('Error occured while loading the data.');
      console.log(e);
    }

  }

  async loadTickets(projection: Projection, paging: boolean, page: number, size: number) {
    let data;

    try {
      if (paging) {
        data = await this.server.getTicketsPaging(projection, page, size).toPromise();
        projection.ticketsPage = <Page> data['page'];
      } else {
        data = await this.server.getTickets(projection).toPromise();
        // console.log(projection.ticketsPage.totalPages);
        // console.log("ZZAB");
        // console.log(projection.ticketsPage);

      }
      console.log(data);
      projection.tickets = <Ticket[]> data['_embedded']['tickets'];

    } catch (e) {
      this.alertService.danger('Error occured while loading the data.');
      console.log(e);
    }
  }

  async loadProjections(salle: Salle) {
    let data;
    try {
      console.log(this.projectionDate);
      data = await this.server.getProjectionsBySalleAndDate(salle,this.projectionDate).toPromise();
      salle.projections = <Projection[]> data['_embedded']['projections'];
      for (let projection of salle.projections) {
        this.loadTickets(projection, true, 0, this.ticketsPageSize).then(r => {
        });
      }
      if (salle.projections?.length > 0) {
        salle.currentProjection = salle.projections[0];
      }
    } catch (e) {
      this.alertService.danger('Error occured while loading the data.');
      console.log(e);
    }
  }

  onSelectSeance(salle: Salle, projection: Projection) {
    salle.currentProjection = projection;
  }

  fetchPreviousTickets(currentProjection: Projection) {
    if (currentProjection.ticketsPage.number > 0) {
      this.loadTickets(currentProjection, true, currentProjection.ticketsPage.number - 1, this.ticketsPageSize);
    }
  }

  fetchNextTickts(currentProjection: Projection) {
    if (currentProjection.ticketsPage.number + 1 < currentProjection.ticketsPage.totalPages) {
      this.loadTickets(currentProjection, true, currentProjection.ticketsPage.number + 1, this.ticketsPageSize);
    }
  }

  togglePayForm(projection: Projection) {
    for (let ticket of projection.tickets) {
      if (ticket.selected) {
        projection.ticketSelected = true;
        return;
      }
      projection.ticketSelected = false;
    }
  }

  onClickTicket(currentProjection: Projection, ticket: Ticket) {
    ticket.selected = !ticket.selected;
    this.togglePayForm(currentProjection);
  }

  onSubmitPay(value: any, currentProjection: Projection) {
    console.log(value);
    // let dataForm = {
    //   tickets: [],
    //   nomClient: value.nomClient,
    //   codeClient: value.codeClient
    // };
    let dataForm = {
      tickets: [],
      idUser: this.auth.user.id,
    };
    for (let ticket of currentProjection.tickets) {
      if (ticket.selected) {
        dataForm.tickets.push(ticket.id);
      }
    }
    this.server.payerTicketsUser(dataForm).subscribe(value1 => {
      let count = 0;
      for (let ticket of currentProjection.tickets) {
        if (ticket.selected) {
          ticket.reserve = true;
          count++;
        }
        ticket.selected = false;
      }
      currentProjection.ticketSelected = false;
      this.alertService.success('Félicitation! Vous avez réservé ' + count + ' tickets.');

    }, error => {
      this.alertService.danger('Error occured while trying to executed the process.');
      console.log(error);
      alert('Error encountered');

    });
  }

  onChangeDateProjection($event: Event) {
    console.log($event);
    console.log(this.projectionDate);
  }
}
