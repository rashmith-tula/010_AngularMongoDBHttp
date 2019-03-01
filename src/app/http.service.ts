import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()

export class HttpService {

  constructor(private http: Http) { }

  getPersons() : Observable<[]> {
    return this.http.get('http://localhost:8080/persons')
     .pipe(map((response: any) => {
         let data = response.json();
         console.log(data);
         return data;  
      }));
  }

  savePersons(person: any) {
    const headers = new Headers({'Content-Type' : 'application/json'});
    return this.http.post('http://localhost:8080/persons/save', person, {headers: headers})
      .pipe(map((response: any) => {
        let data = response.json();
        return data;  
      }));
  }

  updatePersons(id: string, person: any) {
    console.log('id :' + id);
    console.log('person :' + person);  
    let uri = 'http://localhost:8080' + '/persons/' + id;
    const headers = new Headers({'Content-Type' : 'application/json'});
    return this.http.put(uri, person, {headers: headers})
      .pipe(map((response: any) => {
        let data = response.json();
        return data;  
      }));
  }

  deletePersons(id: string) {
      let uri = 'http://localhost:8080' + '/persons/' + id;
      const headers = new Headers({'Content-Type' : 'application/json'});
      return this.http.post(uri, {headers: headers});
  }
}
