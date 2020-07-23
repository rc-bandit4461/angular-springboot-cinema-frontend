import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from './common.service';
import {Categorie, Cinema, CinemaData, CityData, Film, Place, Projection, Salle, Ticket, User, Ville} from '../entities';
import {toBase64String} from '@angular/compiler/src/output/source_map';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private common: CommonService, private  httpClient: HttpClient) {
  }

  public getVilles() {
    return this.httpClient.get(this.common.url + '/villes');
  }

  public getVillesPaging(page: number, size: number) {
    return this.httpClient.get(this.common.url + '/villes?page=' + page + '&size=' + size);
  }

  public getCinemas(ville: Ville) {
    return this.httpClient.get(ville._links.self.href + '/cinemas');
  }

  public getVilleByCinema(cinema: Cinema) {
    return this.httpClient.get<Ville>(cinema._links.self.href + '/ville');

  }

  public getCinemasByCityPaging(ville: Ville, page: number, size: number) {
    return this.httpClient.get(this.common.url + '/cinemas/search/byCity?id=' + ville.id + '&page=' + page + '&size=' + size);
  }

  public deleteCinema(cinema: Cinema) {
    return this.httpClient.delete(cinema._links.self.href);
  }

  getSalles(cinema: Cinema) {
    return this.httpClient.get(cinema._links.self.href + '/salles');
  }

  public getProjections(salle: Salle) {
    return this.httpClient.get(salle._links.self.href + '/projections?projection=p1');

  }
    public getProjectionsBySalleAndDate(salle: Salle,date:Date) {
      console.log(this.formatDate(date));
    return this.httpClient.get(this.common.url + '/projections/search/byDate?dt='+this.formatDate(date)+'&id='+salle.id+'&projection=p1');

  }

  getTicketsPaging(projection: Projection, page: number, size: number) {
    return this.httpClient.get<Ticket[]>(this.common.url + '/tickets/search/byProjection?id=' + projection.id + '&projection=p2&page=' + page + '&size=' + size);

  }
  formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}
  getTickets(projection: Projection) {
    return this.httpClient.get<Ticket[]>(projection._links.self.href + '/tickets?projection=p2');

  }

  getPlaceByTicketId(ticket: Ticket) {
    return this.httpClient.get<Place>(this.common.url + '/tickets/' + ticket.id + '/place');

  }

  payerTickets(dataForm: { tickets: any[]; codeClient: any; nomClient: any }) {
    return this.httpClient.post(this.common.url + '/payerTickets', dataForm);
  }
   payerTicketsUser(dataForm: { tickets: any[]; idUser: any }) {
    return this.httpClient.post(this.common.url + '/payerTicketsUser', dataForm);
  }

  putVille(data: CityData) {
    return this.httpClient.put(this.common.url + '/villes/' + data.id, data);
  }

  getCityById(cityId: string) {
    return this.httpClient.get<Ville>(this.common.url + '/villes/' + cityId);
  }

  putCinema(cinemaData: any) {
    let data = {
      name: cinemaData.name,
      longitude: cinemaData.longitude,
      latitude: cinemaData.latitude,
      altitude: cinemaData.altitude,
      ville: cinemaData.ville._links.self.href
    };
    console.log(data);
    return this.httpClient.patch(this.common.url + '/cinemas/' + cinemaData.id, data);
  }

  getSallesByCinemaPaging(cinema: Cinema, page: number, size: number) {
    return this.httpClient.get(this.common.url + '/salles/search/byCinema?id=' + cinema.id + '&page=' + page + '&size=' + size);
  }

  getCinemaById(cinemaId: string) {
    return this.httpClient.get<Cinema>(this.common.url + '/cinemas/' + cinemaId);

  }

  deleteSalle(salle: Salle) {
    return this.httpClient.delete(salle._links.self.href);
  }

  putSalle(salleData: { nombrePlaces: number; name: string; id: number; cinema: Cinema }) {
    let data = {
      name: salleData.name,
      nombrePlaces: salleData.nombrePlaces,
      cinema: salleData.cinema._links.self.href
    };
    console.log(data);
    return this.httpClient.patch(this.common.url + '/salles/' + salleData.id, data);

  }

  getSalleById(cinemaId: string) {
    return this.httpClient.get<Salle>(this.common.url + '/salles/' + cinemaId);

  }

  getCinemaBySalle(salle: Salle) {
    return this.httpClient.get<Cinema>(salle._links.self.href + '/cinema');

  }

  getPlacesBySallePaging(salle: Salle, page: number, size: number) {
    return this.httpClient.get(this.common.url + '/places/search/bySalle?id=' + salle.id + '&page=' + page + '&size=' + size);

  }

  deletePlace(place: Place) {
    return this.httpClient.delete(place._links.self.href);

  }

  putPlace(placeData: { numero: number, altitude: number; salle: Salle; latitude: number; id: number; longitude: number }) {
    let data = {
      numero: placeData.numero,
      longitude: placeData.longitude,
      latitude: placeData.latitude,
      altitude: placeData.altitude,
      salle: placeData.salle._links.self.href
    };
    console.log(data);
    return this.httpClient.patch(this.common.url + '/places/' + placeData.id, data);
  }

  getFilmsPaging(page: number, size: number) {
    return this.httpClient.get(this.common.url + '/films?projection=p3&page=' + page + '&size=' + size);

  }


  deleteFilm(film: Film) {
    return this.httpClient.delete(film._links.self.href);

  }

  putFilm(filmData: { realisateur: any; categorie: Categorie; titre: any; dateSortie: any; duree: any; description: any; id: number }) {
    let data = {
      realisateur: filmData.realisateur,
      categorie: filmData.categorie._links.self.href,
      titre: filmData.titre,
      description: filmData.description,
      duree: filmData.duree,
      dateSortie: filmData.dateSortie,
    };
    return this.httpClient.patch(this.common.url + '/films/' + filmData.id, data);
  }

  getCategories() {
    return this.httpClient.get(this.common.url + '/categories');
  }

  addFilm(filmData: { realisateur: any; categorie: Categorie; titre: any; dateSortie: any; duree: any; description: any }) {
    let data = {
      realisateur: filmData.realisateur,
      categorie: filmData.categorie._links.self.href,
      titre: filmData.titre,
      description: filmData.description,
      duree: filmData.duree,
      dateSortie: filmData.dateSortie,
    };
    return this.httpClient.post(this.common.url + '/films', data);
  }

  addPhotoFilm(film: Film, file: File) {
    return this.httpClient.post(this.common.url + '/imageFilm/' + film.id, file);
  }

  getFilmById(id: number) {
    return this.httpClient.get(this.common.url + '/films/' + id + '?projection=p3');

  }

  getProjectionsByCinemaPaging(cinema: Cinema, page: number, size: number) {
    return this.httpClient.get(this.common.url + '/projections/search/byCinema?projection=p1&id=' + cinema.id + '&page=' + page + '&size=' + size);

  }

  deleteProjection(projection: Projection) {
    return this.httpClient.delete(projection._links.self.href);

  }

  getFilmsByCategorie(categorie: Categorie) {
    return this.httpClient.get(categorie._links.self.href + '/films');
  }

  getFreeSeances(currentCinema: Cinema, date: Date) {
    return this.httpClient.post(this.common.url + '/getAvailabeSalles', {
      date: date,
      cinemaId: currentCinema.id
    });
  }

  getSallesByCinema(cinema: Cinema) {
        return this.httpClient.get(cinema._links.self.href+ '/salles');
  }

   getSeances() {
    return this.httpClient.get(this.common.url + '/seances');
  }

  addProjection(data: { salleSeances: any[]; dateProjection: any; prix: any; filmId: any }) {
          return this.httpClient.post(this.common.url + '/addProjection',data);
  }

  authenticate(user: { username: any; password: any }) {
          return this.httpClient.post(this.common.url + '/authenticate',user);
  }

  getUserByEmail(email: string) {
      return this.httpClient.get(this.common.url + '/users/search/byEmail?email='+email.toLowerCase());
  }

  addCity(value: any) {
        return this.httpClient.post(this.common.url + '/villes',value);
  }

  deleteCity(city: Ville) {
        return this.httpClient.delete(city._links.self.href);
  }

   getUserRoles(user: User) {
    return this.httpClient.get(user._links.self.href + '/roles');
  }

  updateUserProfile(param: { firstName: any; lastName: any; password: any; id: number }) {
          return this.httpClient.put(this.common.url + '/updateUserProfile',param);
  }

  register(userDetails: { firstName: any; lastName: any; password: any; email: any }) {
          return this.httpClient.post(this.common.url + '/register',userDetails);

  }

  getUsersPaging(page: number, size: number) {
      return this.httpClient.get(this.common.url + '/users?projection=p4&page='+page+"&size="+size);
  }

  geleteUser(user: User) {
      return this.httpClient.delete(user._links.self.href);

  }

  toggleEnableUser(user: User) {
        return this.httpClient.put(this.common.url + '/toggleEnaleUser',{id:user.id});
  }

  getRoles() {
      return this.httpClient.get(this.common.url + '/roles');
  }

  updateUser(userDetails: { firstName: any; lastName: any; password: any; roles: any; email: any }) {
            return this.httpClient.put(this.common.url + '/updateUser',userDetails);
  }
}
