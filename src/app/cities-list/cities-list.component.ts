import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ServerService} from '../services/server.service';
import {AlertService} from 'ngx-alerts';
import {CityData, Ville} from '../entities';
import {MatDialog} from '@angular/material/dialog';
import {ModifyCityDialogComponent} from '../cities/modify-city-dialog/modify-city-dialog.component';
import {MatTable} from '@angular/material/table';
import {MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import {AddcityDialogComponent} from '../admin/addcity-dialog/addcity-dialog.component';


@Component({
  selector: 'app-cities-list',
  templateUrl: './cities-list.component.html',
  styleUrls: ['./cities-list.component.css']
})

export class CitiesListComponent implements OnInit, AfterViewInit {
  cities: Ville[] = [];
  pageSizes: number[] = [2, 10, 25, 100];
  currentPageSize = this.pageSizes[0];
  displayedColumns: string[] = ['id', 'name', 'latitude', 'longitude', 'altitude', 'action'];
  isLoaded: boolean = false;
  @ViewChild('citiesTable') citiesTableRef: MatTable<Ville>;
  @ViewChild('paginator') paginator: MatPaginatorIntl;
  totalElements: number;
  currentPage: number = 0;

  constructor(public dialog: MatDialog, public server: ServerService, public alertService: AlertService) {
  }

  ngOnInit(): void {

  }

  private async initData() {
    try {
      let data = await this.server.getVillesPaging(0, this.currentPageSize).toPromise();
      this.cities = data['_embedded']['villes'];
      this.totalElements = data['page']['totalElements'];
    } catch (e) {
      console.log(e);
      this.alertService.danger('Error occured while loading data.');
    }
  }

  onClickMatHeaderCell(id: number) {
    console.log('clicked ' + id);
  }

  onDelete(city: Ville) {
    if(!confirm("Confirm")) return;
    this.server.deleteCity(city).subscribe(value => {
      this.alertService.success('Delete Success');
      this.loadData(this.currentPage,this.currentPageSize);
    },error => {

      this.alertService.danger('Error occured while executing delete.');
    })
  }

  onEdit(city: Ville) {
    console.log(city);
  }

  copyToCity(city: Ville, cityData: CityData) {
    city.name = cityData.name;
    city.longitude = cityData.longitude;
    city.latitude = cityData.latitude;
    city.altitude = cityData.altitude;
  }

  openDialog(city: Ville, toggleButton: boolean): void {
    let cityData: CityData = {
      name: city.name,
      id: city.id,
      longitude: city.longitude,
      latitude: city.latitude,
      altitude: city.altitude
    };
    const dialogRef = this.dialog.open(ModifyCityDialogComponent, {
      width: '400px',
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
      let data = await this.server.getVillesPaging(page, size).toPromise();
      this.cities = data['_embedded']['villes'];
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

  onAddCity() {
    const dialogRef = this.dialog.open(AddcityDialogComponent, {
      width: '400px',
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
}
