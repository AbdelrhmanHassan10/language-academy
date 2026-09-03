import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-certification-section',
  imports: [],
  templateUrl: './certification-section.html',

})
export class CertificationSection {
  certifications = signal<any[]>([
    { id: 1, icon: '/images/icon/cert-1.svg', title: 'ISO 9001', issuer: 'International Org' },
    { id: 2, icon: '/images/icon/cert-2.svg', title: 'Accredited', issuer: 'Global Board' },
    { id: 3, icon: '/images/icon/cert-3.svg', title: 'Top Rated', issuer: 'Edu Authority' },
    { id: 4, icon: '/images/icon/cert-4.svg', title: 'Trusted', issuer: 'Quality Mark' },
  ]);

}
