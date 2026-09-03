import { Component } from '@angular/core';
import { AboutCenter } from '../../shared/components/about-center/about-center';
import { CoursesServices } from '../../shared/components/about-center/courses-services/courses-services';
import { WhyOurServices } from '../../shared/components/why-our-services/why-our-services';
import { HowToStart } from '../../shared/components/how-to-start/how-to-start';
import { ReadyToStart } from '../../shared/components/ready-to-start/ready-to-start';

@Component({
  selector: 'app-services',
  imports: [AboutCenter, CoursesServices, WhyOurServices, HowToStart, ReadyToStart],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  servicesAbout = {
    title: 'خدماتنا المتميزة',
    description:
      'نقدم مجموعة شاملة من الخدمات التعليمية والترجمة المعتمدة لدعم مسيرتك الأكاديمية والمهنية',
  };
}
