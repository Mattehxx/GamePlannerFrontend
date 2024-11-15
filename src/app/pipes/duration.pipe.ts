import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true
})
export class DurationPipe implements PipeTransform {
  transform(hours: number): string {
    if (hours === 1) return '1 hour';
    return `${hours} hours`;
  }
}