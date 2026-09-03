import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true 
})
export class SearchPipe implements PipeTransform {

  transform(data: any[], text: string): any[] {

    if (!data) return [];
    
    if (!text) return data;
    
    return data.filter((item) => 
      item.title.toLowerCase().includes(text.toLowerCase())
    );
  }

}
