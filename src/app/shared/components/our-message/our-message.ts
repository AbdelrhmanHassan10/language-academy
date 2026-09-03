import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-our-message',
  imports: [CommonModule],
  templateUrl: './our-message.html',
  styleUrl: './our-message.scss',
})
export class OurMessage {
  educationalCards = signal<any[]>([
    {
      id: 1,
      icon: '/images/icon/circle-2.svg',
      title: 'الرؤية',
      description: 'أن نكون المركز الرائد إقليمياً في تقديم خدمات اللغات والترجمة المعتمدة والمتميزة',
      link: '/courses',
      bgColor: '#0066CC',
    },
    {
      id: 2,
      icon: '/images/icon/glada.svg',
      title: 'الرسالة',
      description: 'تقديم خدمات تعليمية وترجمة معتمدة بأعلى معايير الجودة لدعم المجتمع الأكاديمي والمهني',
      link: '/courses',
      bgColor: '#5639AF',
    },
    {
      id: 3,
      icon: '/images/icon/chart.svg',
      title: 'الأهداف',
      description: 'تطوير مهارات اللغة، تقديم شهادات معتمدة دولياً، وخدمات ترجمة احترافية',
      link: '/courses',
      bgColor: '#00B2A9',
    },
   
  ]);

}
