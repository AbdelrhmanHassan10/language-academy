import { Component } from '@angular/core';
import { AboutCenter } from '../../shared/components/about-center/about-center';
import { AboutStatistics } from '../../shared/components/about-statistics/about-statistics';
import { AboutWho } from '../../shared/components/about-who/about-who';
import { OurMessage } from '../../shared/components/our-message/our-message';
import { ExcellentPath } from '../../shared/components/excellent-path/excellent-path';
import { WhatMakesUsDifferent } from '../../shared/components/what-makes-us-different/what-makes-us-different';
import { CertificationSection } from '../../shared/components/certification-section/certification-section';

@Component({
  selector: 'app-about',
  imports: [
    AboutCenter,
    AboutStatistics,
    AboutWho,
    OurMessage,
    ExcellentPath,
    WhatMakesUsDifferent,
    CertificationSection,
  ],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  AboutData = {
    title: 'عن مركز اللغات والترجمة',
    description: 'رحلة من التميز والريادة في خدمة المجتمع الأكاديمي والمهني منذ عام 1999',
  };
}
