import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  resultArray = [];

  transform(value: any, search: any): any {
    this.resultArray = [];
    if(value.length === 0 || !search || search == '') {
      return value;
    }

    for(const item of value) {
      let status: string = item.status;
      let filterSearch: string = search;
      status = status.toLowerCase();
      filterSearch = filterSearch.toLowerCase();
      let regExp = new RegExp(filterSearch, 'gi');

      if(status.match(regExp)) {
         this.resultArray.push(item);
      }
    }

    return this.resultArray;
    
  }

}
