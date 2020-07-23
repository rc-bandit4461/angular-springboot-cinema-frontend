import {FormControl} from '@angular/forms';

export class Link {
  href: string;
}

export class Links {
  self: Link;
}

export  class Entity {
  id: number;
  _links: Links;
}
export interface CityData {
  id:number;
  name:string;
  longitude:number;
  latitude:number;
  altitude:number;
}
export interface CinemaData {
  id:number;
  name:string;
  longitude:number;
  latitude:number;
  altitude:number;
  ville:Ville;
}
export interface SalleData {
  id:number;
  name:string;
  nombrePlaces:number;
  cinema:Cinema;
}
export interface PlaceData {
  id:number;
  numero:number;
  longitude:number;
  latitude:number;
  altitude:number;
  salle:Salle;
}
export interface FilmData{
  id:number;
  categorie: Categorie;
  titre: string;
  duree: number;
  realisateur: string;
  description: string;
  photo: string;
  dateSortie: Date;
}
export class Ville extends Entity {
  name: string;
  longitude: number;
  latitude: number;
  altitude: number;
  cinemas: Cinema[];
}

export class Categorie extends Entity {
  name: string;
  films: Film[];
}

export class Film extends Entity {
  categorie: Categorie;
  projections: Projection[];
  titre: string;
  duree: number;
  realisateur: string;
  description: string;
  photo: string;
  dateSortie: Date;
}

export class Place extends Entity {
  numero: number;
  longitude: number;
  latitude: number;
  altitude: number;
  salle: Salle;
  tickets: Ticket[];
}

export class Ticket extends Entity {
  projection: Projection;
  place: Place;
  codePayment: number;
  reserve;
  boolean;
  nomClient: string;
  selected:boolean = false;
}

export class Seance extends Entity {
  heureDebut: Date;
}
export class SalleSeances {
  seances:Seance[];
  salle:Salle;
}
export class Projection extends Entity {
  prix: number;
  salle: Salle;
  dateProjection: Date;
  film: Film;
  tickets: Ticket[];
  seance: Seance;
  ticketsPage:Page;
  ticketSelected:boolean = false;
  paymentDetails = {
    nomClient:'',
    codePayment:0
  }
}

export class Salle extends Entity {
  name: string;
  nombrePlaces: number = 0;
  cinema: Cinema;
  projections: Projection[];
  places: Place[];
  currentProjection:Projection;
  seances:Seance[];
  formControl: FormControl;
}
export class Role extends Entity{
  static ADMIN_ROLE:string = "admin";
  static OWNER_ROLE:string = "owner";
  role:string;
}
export class User extends Entity{
  username:string;
  password:string;
  email:string;
  enabled:boolean;
  firstName:string;
  lastName:string;
  roles:Role[] = [];
  // public isAdmin():boolean{
  //   for (let role of this.roles) {
  //         if(role.role.toLowerCase() == Role.ADMIN_ROLE) return true;
  //   }
  //   return false;
  // }
  // hasOwnerRole(){
  //  for (let role of this.roles) {
  //         if(role.role == Role.OWNER_ROLE) return true;
  //   }
  //   return false;
  // }
  // isOwner():boolean{
  //   for (let role of this.roles) {
  //         if(role.role == Role.OWNER_ROLE) return true;
  //   }
  //   return false;
  // }
}
export class Page{
  size:number;
  totalElements:number;
  totalPages:number;
  number:number;
}
export class Cinema extends Entity {
  name: string;
  longitude: number;
  latitude: number;
  altitude: number;
  nombreSalles: number = 0;
  ville: Ville;
  salles: Salle[];

}
