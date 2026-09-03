import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lang-translation',
  imports: [RouterLink],
  templateUrl: './lang-translation.html',
  styleUrl: './lang-translation.scss',
  standalone: true,
})
export class LangTranslation {

  langData = signal<{ icon: string, title: string, description: string }[]>([
    {
      icon: '/images/icon/national.svg',
      title: ' اعتماد دولي ',
      description: '    شهاداتنا معتمدة من أفضل الجامعات والمؤسسات العالمية '
    },

    {
      icon: '/images/icon/circle.svg',
      title: '  دقة عالية',
      description: 'نضمن لك أعلى مستويات الجودة في الاختبارات والترجمة'
    },
    {
      icon: '/images/icon/clock.svg',
      title: 'مرونة في المواعيد',
      description: 'جداول مرنة تناسب جميع الطلاب والعاملين'
    },
    {
      icon: '/images/icon/privacy.svg',
      title: 'أمان وخصوصية ',
      description: ' نحافظ على سرية بياناتك ونتائجك بكل احترافية   '
    },

  ])

}
