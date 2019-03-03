import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from './http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('name') nameField: ElementRef;
  title = 'mongoHttp';
  persons = []; //[{name : "Krishna", profession: "Engineer", status: "dull"}];
  person = [];
  formStatus: string = 'Save';
  reactForm: FormGroup;
  filterSearch: string;
  editStyle: boolean = false;

  constructor(private mongoService: HttpService) { }

  ngOnInit() {
    this.reactForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'profession': new FormControl("Friend", Validators.required),
      'status': new FormControl("Intelligent", Validators.required)
    });
    this.onGet();
  }

  onGet(person?: any) {
    this.mongoService.getPersons()
      .subscribe(
        (response) => {
          console.log(response);
          if (response) {
            this.persons = response;
            if (person) {
              let persArray: any[] = [];
              let i: number = 0;
              persArray = this.persons;
              for (const item of persArray) {
                if (item['_id'] == person['_id']) {
                  this.persons.splice(i, 1);
                  this.persons.unshift(item);
                  break;
                }
                i++;
              }
            }
          }
        },

        (error) => { console.log(error); });
  }

  onSave() {
    !this.persons ? this.persons = [] : this.persons;
    if (this.formStatus == "Save") {
      this.mongoService.savePersons(this.reactForm.value)
        .subscribe((response) => {
          this.onGet();
        },
          (error) => console.log(error));
    } else if (this.formStatus == "Update") {
      this.person['name'] = this.reactForm.value.name;
      this.person['profession'] = this.reactForm.value.profession;
      this.person['status'] = this.reactForm.value.status;
      console.log('Updated person :' + this.person);
      this.mongoService.updatePersons(this.person['_id'], this.person)
        .subscribe((response) => {
          this.onGet(this.person);
          this.person = [];
        },
          (error) => console.log(error));

      this.formStatus = 'Save';
      this.editStyle = false;
    }

    this.reactForm.reset();
    this.reactForm.patchValue({
      profession: 'Friend',
      status: 'Intelligent'
    });
  }

  onUpdate(id: string, i: number) {
    this.person = this.persons[i];
    this.formStatus = 'Update';
    this.reactForm.patchValue({
      name: this.person['name'],
      profession: this.person['profession'],
      status: this.person['status']
    });
    this.persons.splice(i, 1);
    this.persons.unshift(this.person);
    this.nameField.nativeElement.focus();
    this.editStyle = true;
  }

  onDelete(id: string, i: number) {
    console.log(this.persons);
    console.log('_id: ' + id);
    if (this.persons) {
      this.mongoService.deletePersons(id)
        .subscribe((response) => { this.onGet(); },
          (error) => console.log('delete error:' + error));
      // this.persons.splice(i, 1);
    }
  }

  getBgColor(person) {
    if (person) {
      return {
        'list-group-item-success': person.status === 'Intelligent',
        'list-group-item-info': person.status === 'Average',
        'list-group-item-dark': person.status === 'Dull',
        'list-group-item-danger': person.status === 'Crooked',
        'list-group-item-warning': person.status === 'Sober'
      };
    }

    return null;

  }

}
