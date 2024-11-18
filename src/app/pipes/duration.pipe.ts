import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true
})
export class DurationPipe implements PipeTransform {

  transform(startDate: Date, endDate: Date): string {
    if (!startDate || !endDate) {
      return '';
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInMilliseconds = end.getTime() - start.getTime();
    const durationInHours = durationInMilliseconds / (1000 * 60 * 60);

    return `${durationInHours.toFixed(2)} hours`;
  }
  
}