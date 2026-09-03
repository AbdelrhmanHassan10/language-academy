import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Feature {
  icon: string;
  text: string;
}

const ICON_URL = 'https://www.figma.com/api/mcp/asset/afc38882-5f26-46b1-8a8e-626cee688770';

@Component({
  selector: 'app-what-makes-us-different',
  templateUrl: './what-makes-us-different.html',
  styleUrls: ['./what-makes-us-different.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class WhatMakesUsDifferent {
  features: Feature[] = [
    { icon: ICON_URL, text: 'هيئة تدريس متخصصة ومعتمدة دولياً' },
    { icon: ICON_URL, text: 'برامج تدريبية حديثة ومتطورة' },
    { icon: ICON_URL, text: 'شهادات معتمدة من جهات عالمية' },
    { icon: ICON_URL, text: 'خدمات ترجمة احترافية ومعتمدة' },
    { icon: ICON_URL, text: 'قاعات مجهزة بأحدث التقنيات' },
    { icon: ICON_URL, text: 'دعم فني ومتابعة مستمرة' },
    { icon: ICON_URL, text: 'أسعار تنافسية ومرونة في الدفع' },
    { icon: ICON_URL, text: 'شراكات دولية مع مؤسسات عالمية' },
  ];
  trackText(index: number, feature: Feature) {
    return feature.text;
  }
}
