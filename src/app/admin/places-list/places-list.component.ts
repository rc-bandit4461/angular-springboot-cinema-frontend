import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Cinema, Place, PlaceData, Salle, SalleData} from '../../entities';
import {MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import {MatTable} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {ServerService} from '../../services/server.service';
import {AlertService} from 'ngx-alerts';
import {ActivatedRoute} from '@angular/router';
import {PlacesDialogComponent} from '../places-dialog/places-dialog.component';

@Component({
  selector: 'app-places-list',
  templateUrl: './places-list.component.html',
  styleUrls: ['./places-list.component.css']
})
export class PlacesListComponent implements OnInit, AfterViewInit {
  places: Place[] = [];
  pageSizes: number[] = [2, 10, 25, 100];
  currentPageSize = this.pageSizes[0];
  displayedColumns: string[] = ['id', 'altitude', 'longitude','latitude','numero','action'];
  isLoaded: boolean = false;
  @ViewChild('placesTable') placesTable: MatTable<Place>;
  @ViewChild('paginator') paginator: MatPaginatorIntl;
  totalElements: number;
  currentPage: number = 0;
  salleId: string;
  currentCinema: Cinema;
  currentSalle: Salle;

  constructor(public dialog: MatDialog, public server: ServerService, public alertService: AlertService, public route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.salleId = this.route.snapshot.paramMap.get('salleId');
    console.log(this.salleId);
  }

  private async initData() {
    try {
      this.currentSalle = await this.server.getSalleById(this.salleId).toPromise();
      this.currentCinema = await this.server.getCinemaBySalle(this.currentSalle).toPromise();
      let data = await this.server.getPlacesBySallePaging(this.currentSalle, 0, this.currentPageSize).toPromise();
      console.log(data);
      this.places = data['_embedded']['places'];
      this.totalElements = data['page']['totalElements'];
    } catch (e) {
      console.log(e);
      this.alertService.danger('Error occured while loading data.');
    }
  }

  onClickMatHeaderCell(id: number) {
    console.log('clicked ' + id);
  }

  onDelete(place: Place) {
    if (!confirm('Delete?')) {
      return;
    }
    this.server.deletePlace(place).subscribe(value => {
      this.alertService.success('Delete operation success');
      this.loadData(this.currentPage, this.currentPageSize);

    }, error => {
      console.log(error);
      this.alertService.danger('Error occured while execting deletion process.');
    });
  }

  onEdit(place: Place) {
    console.log(place);
  }


  openDialog(place: Place, toggleButton: boolean): void {
    let placeData: PlaceData = {
      id: place.id,
      numero: place.numero,
      altitude: place.altitude,
      latitude: place.latitude,
      longitude: place.longitude,
      salle: this.currentSalle
    };
    const dialogRef = this.dialog.open(PlacesDialogComponent, {
      width: '400px',
      data: {
        data: placeData,

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
      let data = await this.server.getPlacesBySallePaging(this.currentSalle, page, size).toPromise();
      this.places = data['_embedded']['places'];
      this.totalElements = data['page']['totalElements'];
      this.currentPage = page;
      this.currentPageSize = size;
      this.placesTable.renderRows();
    } catch (e) {
      console.log(e);
    }
  }

  onPage($event: PageEvent) {
    console.log($event);
    this.loadData($event.pageIndex, $event.pageSize);
  }
}
