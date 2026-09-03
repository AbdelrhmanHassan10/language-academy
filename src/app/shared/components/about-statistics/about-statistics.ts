import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-statistics',
  templateUrl: './about-statistics.html',
  styleUrl: './about-statistics.scss',
})
export class AboutStatistics {
  educationalCards = signal<any[]>([
    {
      id: 1,
      icon: '/images/icon/user-2.svg',
      title: ' 15,000+',
      description: 'طالب وطالبة',
      bgColor: '#0066CC',
    },
    {
      id: 2,
      icon: '/images/icon/glada.svg',
      title: ' 25+',
      description: 'عام من التميز',
      bgColor: '#5639AF',
    },
    {
      id: 3,
      icon: '/images/icon/book.svg',
      title: '50+ ',
      description: 'برنامج تدريبي',
      bgColor: '#00B2A9',
    },
    {
      id: 4,
      icon: '/images/icon/map.svg',
      title: '30+',
      description: 'دولة حول العالم',
      bgColor: '#FF6B35',
    },
  ]);
}
