import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AlertService} from 'ngx-alerts';
import {MatDialog} from '@angular/material/dialog';
import {MatTable} from '@angular/material/table';
import {MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import {ActivatedRoute, Router} from '@angular/router';
import {Cinema, CinemaData, CityData, Ville} from '../../entities';
import {ServerService} from '../../services/server.service';
import {ModifyCityDialogComponent} from '../../cities/modify-city-dialog/modify-city-dialog.component';
import {CinemaDialogComponent} from '../cinema-dialog/cinema-dialog.component';
import {SalleDialogComponent} from '../salle-dialog/salle-dialog.component';

@Component({
  selector: 'app-cinemas-list',
  templateUrl: './cinemas-list.component.html',
  styleUrls: ['./cinemas-list.component.css']
})
export class CinemasListComponent implements OnInit, AfterViewInit {
  cinemas: Cinema[] = [];
  pageSizes: number[] = [2, 10, 25, 100];
  currentPageSize = this.pageSizes[0];
  displayedColumns: string[] = ['id', 'name', 'latitude', 'longitude', 'altitude', 'action'];
  isLoaded: boolean = false;
  @ViewChild('citiesTable') citiesTableRef: MatTable<Ville>;
  @ViewChild('paginator') paginator: MatPaginatorIntl;
  totalElements: number;
  currentPage: number = 0;
  cityId: string;
  currentCity: Ville;

  constructor(public dialog: MatDialog, public server: ServerService, public alertService: AlertService, public route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.cityId = this.route.snapshot.paramMap.get('cityId');
    console.log(this.cityId);
  }

  private async initData() {
    try {
      this.currentCity = await this.server.getCityById(this.cityId).toPromise();
      let data = await this.server.getCinemasByCityPaging(this.currentCity, 0, this.currentPageSize).toPromise();
      console.log(data);
      this.cinemas = data['_embedded']['cinemas'];

      this.totalElements = data['page']['totalElements'];
    } catch (e) {
      console.log(e);
      this.alertService.danger('Error occured while loading data.');
    }
  }

  onClickMatHeaderCell(id: number) {
    console.log('clicked ' + id);
  }

  onDelete(cinema: Cinema) {
    if (!confirm('Delete?')) {
      return;
    }
    this.server.deleteCinema(cinema).subscribe(value => {
      this.alertService.success('Delete operation success');
      this.loadData(this.currentPage,this.currentPageSize);
    }, error => {
      console.log(error);
      this.alertService.danger('Error occured while execting deletion process.');
    });
    console.log(cinema);
  }

  onEdit(cinema: Cinema) {
    console.log(cinema);
  }

  copyToCinema(city: Cinema, cityData: Cinema) {
    city.name = cityData.name;
    city.longitude = cityData.longitude;
    city.latitude = cityData.latitude;
    city.altitude = cityData.altitude;
  }

  openDialog(cinema: Cinema, toggleButton: boolean): void {
    let cityData: CinemaData = {
      name: cinema.name,
      id: cinema.id,
      longitude: cinema.longitude,
      latitude: cinema.latitude,
      altitude: cinema.altitude,
      ville: this.currentCity
    };
    const dialogRef = this.dialog.open(CinemaDialogComponent, {
      width: '450px',
      data: {
        data: cityData,
        toggleButtons: toggleButton
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (!result) {
        return;
      }
      this.loadData(this.currentPage, this.currentPageSize);


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
      let data = await this.server.getCinemasByCityPaging(this.currentCity, page, size).toPromise();
      this.cinemas = data['_embedded']['cinemas'];
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
}
