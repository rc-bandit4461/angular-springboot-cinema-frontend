import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ServerService} from '../services/server.service';
import {AlertService} from 'ngx-alerts';
import {Cinema, CityData, Salle, SalleData} from '../entities';
import {MatDialog} from '@angular/material/dialog';
import {ModifyCityDialogComponent} from '../cities/modify-city-dialog/modify-city-dialog.component';
import {MatTable} from '@angular/material/table';
import {MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import {ActivatedRoute, Router} from '@angular/router';
import {SalleDialogComponent} from '../admin/salle-dialog/salle-dialog.component';

@Component({
  selector: 'app-salles-list',
  templateUrl: './salles-list.component.html',
  styleUrls: ['./salles-list.component.css']
})
export class SallesListComponent implements OnInit, AfterViewInit {
  salles: Salle[] = [];
  pageSizes: number[] = [2, 10, 25, 100];
  currentPageSize = this.pageSizes[0];
  displayedColumns: string[] = ['id', 'name', 'nombrePlaces', 'action'];
  isLoaded: boolean = false;
  @ViewChild('sallesTable') sallesTable: MatTable<Salle>;
  @ViewChild('paginator') paginator: MatPaginatorIntl;
  totalElements: number;
  currentPage: number = 0;
  cinemaId: string;
  currentCinema: Cinema;

  constructor(public dialog: MatDialog, public server: ServerService, public alertService: AlertService, public route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.cinemaId = this.route.snapshot.paramMap.get('cinemaId');
    console.log(this.cinemaId);
  }

  private async initData() {
    try {
      this.currentCinema = await this.server.getCinemaById(this.cinemaId).toPromise();
      let data = await this.server.getSallesByCinemaPaging(this.currentCinema, 0, this.currentPageSize).toPromise();
      console.log(data);
      this.salles = data['_embedded']['salles'];
      this.totalElements = data['page']['totalElements'];
    } catch (e) {
      console.log(e);
      this.alertService.danger('Error occured while loading data.');
    }
  }

  onClickMatHeaderCell(id: number) {
    console.log('clicked ' + id);
  }

  onDelete(salle: Salle) {
    if (!confirm('Delete?')) {
      return;
    }
    this.server.deleteSalle(salle).subscribe(value => {
      this.alertService.success('Delete operation success');
      this.loadData(this.currentPage, this.currentPageSize);

    }, error => {
      console.log(error);
      this.alertService.danger('Error occured while execting deletion process.');
    });
  }

  onEdit(salle: Salle) {
    console.log(salle);
  }


  openDialog(salle: Salle, toggleButton: boolean): void {
    let salleData: SalleData = {
      id: salle.id,
      name: salle.name,
      nombrePlaces: salle.nombrePlaces,
      cinema: this.currentCinema
    };
    const dialogRef = this.dialog.open(SalleDialogComponent, {
      width: '400px',
      data: {
        data: salleData,
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
    // console.log(this.sallesTableRef.renderRows());
  }

  async loadData(page: number, size: number) {
    try {
      let data = await this.server.getSallesByCinemaPaging(this.currentCinema, page, size).toPromise();
      this.salles = data['_embedded']['salles'];
      this.totalElements = data['page']['totalElements'];
      this.currentPage = page;
      this.currentPageSize = size;
      this.sallesTable.renderRows();
    } catch (e) {
      console.log(e);
    }
  }

  onPage($event: PageEvent) {
    console.log($event);
    this.loadData($event.pageIndex, $event.pageSize);
  }

  onRedirectPlaces() {

  }
}
