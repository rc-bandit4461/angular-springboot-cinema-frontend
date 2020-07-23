import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AlertService} from 'ngx-alerts';
import {MatDialog} from '@angular/material/dialog';
import {MatTable} from '@angular/material/table';
import {MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import {ActivatedRoute, Router} from '@angular/router';
import {Cinema, CinemaData, CityData, Projection, Ville} from '../../entities';
import {ServerService} from '../../services/server.service';
import {AddProjectionComponent} from '../add-projection/add-projection.component';
@Component({
  selector: 'app-projections-list',
  templateUrl: './projections-list.component.html',
  styleUrls: ['./projections-list.component.css']
})
export class ProjectionsListComponent implements OnInit, AfterViewInit {
  projections:Projection[] = [];

  pageSizes: number[] = [2, 10, 25, 100];
  currentPageSize = this.pageSizes[0];
  displayedColumns: string[] = ['id', 'dateProjection', 'prix', 'film', 'salle', 'seance','action'];
  isLoaded: boolean = false;
  @ViewChild('projectionsTable') projectionsTable: MatTable<Projection>;
  @ViewChild('paginator') paginator: MatPaginatorIntl;
  totalElements: number;
  currentPage: number = 0;
  cinemaId: string;
  currentCinema: Cinema;

  constructor(public dialog: MatDialog, public server: ServerService, public alertService: AlertService, public route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.cinemaId = this.route.snapshot.paramMap.get('cinemaId');
  }

  private async initData() {
    try {

      this.currentCinema = await this.server.getCinemaById(this.cinemaId).toPromise();
      let data = await this.server.getProjectionsByCinemaPaging(this.currentCinema, 0, this.currentPageSize).toPromise();
      console.log(data);
      this.projections = data['_embedded']['projections'];
      this.totalElements = data['page']['totalElements'];
    } catch (e) {
      console.log(e);
      this.alertService.danger('Error occured while loading data.');
    }
  }

  onClickMatHeaderCell(id: number) {
    console.log('clicked ' + id);
  }

  onDelete(projection: Projection) {

    if (!confirm('Delete?')) {
      return;
    }
    this.server.deleteProjection(projection).subscribe(value => {
      this.alertService.success('Delete operation success');
      this.loadData(this.currentPage,this.currentPageSize);

    }, error => {
      console.log(error);
      this.alertService.danger('Error occured while execting deletion process.');
    });
    console.log(projection);
  }


  openDialog(projection: Projection, toggleButton: boolean): void {
    // let cityData: CinemaData = {
    //   name: cinema.name,
    //   id: cinema.id,
    //   longitude: cinema.longitude,
    //   latitude: cinema.latitude,
    //   altitude: cinema.altitude,
    //   ville: this.currentCinema
    // };
    // const dialogRef = this.dialog.open(CinemaDialogComponent, {
    //   width: '450px',
    //   data: {
    //     data: cityData,
    //     toggleButtons: toggleButton
    //   }
    // });
    //
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   if (!result) {
    //     return;
    //   }
    //   this.loadData(this.currentPage, this.currentPageSize);
    //
    //
    // }, error => {
    //   console.log(error);
    // });
  }

  ngAfterViewInit(): void {
    this.initData();
    console.log(this.projectionsTable.renderRows());
  }

  async loadData(page: number, size: number) {
    try {
      let data = await this.server.getProjectionsByCinemaPaging(this.currentCinema, page, size).toPromise();
      this.projections = data['_embedded']['projections'];
      this.totalElements = data['page']['totalElements'];
      this.currentPage = page;
      this.currentPageSize = size;
      this.projectionsTable.renderRows();
    } catch (e) {
      console.log(e);
    }
  }

  onPage($event: PageEvent) {
    console.log($event);
    this.loadData($event.pageIndex, $event.pageSize);
  }

  onAddProjection() {
    const dialogRef = this.dialog.open(AddProjectionComponent, {
      width: '450px',
      data:{
        cinema:this.currentCinema
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

  test() {
    this.server.getFreeSeances(this.currentCinema,new Date()).subscribe(value => {
        console.log(value);
    },error => {
      console.log(error);
      }
    );
  }
}
