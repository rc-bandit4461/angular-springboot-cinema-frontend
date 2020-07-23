import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Cinema, Film, FilmData, Place, PlaceData, Salle, SalleData} from '../../entities';
import {MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import {MatTable} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {ServerService} from '../../services/server.service';
import {AlertService} from 'ngx-alerts';
import {ActivatedRoute} from '@angular/router';
import {PlacesDialogComponent} from '../places-dialog/places-dialog.component';
import {FilmDialogComponent} from '../film-dialog/film-dialog.component';
import {CommonService} from '../../services/common.service';
import {AddfilmDialogComponent} from '../addfilm-dialog/addfilm-dialog.component';
@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.css']
})
export class FilmsComponent implements OnInit, AfterViewInit {
  films: Film[] = [];
  pageSizes: number[] = [2, 10, 25, 100];
  currentPageSize = this.pageSizes[0];
  displayedColumns: string[] = ['id', 'titre', 'realisateur','dateSortie','duree','categorie','photo','description','action'];
  isLoaded: boolean = false;
  @ViewChild('filmsTable') filmsTable: MatTable<Place>;
  @ViewChild('paginator') paginator: MatPaginatorIntl;
  totalElements: number;
  currentPage: number = 0;

  constructor(public common:CommonService,public dialog: MatDialog, public server: ServerService, public alertService: AlertService, public route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  private async initData() {
    try {
      let data = await this.server.getFilmsPaging( 0, this.currentPageSize).toPromise();
      console.log(data);
      this.films = data['_embedded']['films'];
      this.totalElements = data['page']['totalElements'];
    } catch (e) {
      console.log(e);
      this.alertService.danger('Error occured while loading data.');
    }
  }

  onClickMatHeaderCell(id: number) {
    console.log('clicked ' + id);
  }

  onDelete(film: Film) {
    if (!confirm('Delete?')) {
      return;
    }
    this.server.deleteFilm(film).subscribe(value => {
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


  openDialog(film: Film, toggleButton: boolean): void {
    let filmData: FilmData = {
      titre: film.titre,
      id: film.id,
      dateSortie: film.dateSortie,
      categorie: film.categorie,
      description: film.description,
      photo: film.photo,
      realisateur: film.realisateur,
      duree: film.duree,
    };
    const dialogRef = this.dialog.open(FilmDialogComponent, {
      width: '400px',
      data: {
        data: filmData,

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
      let data = await this.server.getFilmsPaging(page, size).toPromise();
      this.films = data['_embedded']['films'];
      this.totalElements = data['page']['totalElements'];
      this.currentPage = page;
      this.currentPageSize = size;
      this.filmsTable.renderRows();
      this.isLoaded = true;
    } catch (e) {
      console.log(e);
    }
  }

  onPage($event: PageEvent) {
    console.log($event);
    this.loadData($event.pageIndex, $event.pageSize);
  }

  onAddFilm() {
    const dialogRef = this.dialog.open(AddfilmDialogComponent, {
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

