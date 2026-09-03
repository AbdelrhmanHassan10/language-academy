import { Component,signal } from '@angular/core';

@Component({
  selector: 'app-contact-statistics',
  templateUrl: './contact-statistics.html',
  styleUrl: './contact-statistics.scss',
})
export class ContactStatistics {
  contactCards = signal<any[]>([
    {
      id: 1,
      icon: '/images/icon/geo-alt.svg',
      title: ' العنوان',
      description: 'جامعة بني سويف \n شارع صلاح سالم , بني سويف ,مصر',
      link: '/contact-page',
      bgColor: '#0066CC',
    },
    {
      id: 2,
      icon: './images/icon/telephone.svg',
      title: ' الهاتف',
      description: '082-2322333 \n 01012345678',
      link: '/contact-page',
      bgColor: '#5639AF',
    },
    {
      id: 3,
      icon: '/images/icon/envelope.svg',
      title: 'البريد الألكتروني',
      description: 'info@languagecenter.bsu.edu.eg\nsupport@languagecenter.bsu.edu.eg',
      link: '/contact-page',
      bgColor: '#00B2A9',
    },
    {
      id: 4,
      icon: '/images/icon/timer.svg',
      title: 'ساعات العمل',
      description: 'السبت-الخميس: 9صباحا-5مساء \n الجمعة:مغلق',
      link: '/contact-page',
      bgColor: '#FF6B35',
    }
  ]);

}
