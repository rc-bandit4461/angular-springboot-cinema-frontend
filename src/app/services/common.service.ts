import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
public url:string = "http://localhost:8080";
  constructor() {

  }

}
