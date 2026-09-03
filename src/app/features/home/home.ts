import { Component, signal } from '@angular/core';
import { HeroSection, HeroSectionData } from '../../shared/components/hero-section/hero-section';
import { EducationalCard } from './home-models';
import { EducationalCards } from '../../shared/components/educational-cards/educational-cards';
import { LangTranslation } from '../../shared/components/lang-translation/lang-translation';
import { Courses } from '../../shared/components/courses/courses';
import { ContactUs } from '../../shared/components/contact-us/contact-us';
import { Exam } from '../../shared/components/exam/exam';
import { LearningLang } from '../../shared/components/learning-lang/learning-lang';
import { Steps } from '../../shared/components/steps/steps';
import { SocialMedia } from '../../shared/components/social-media/social-media';

@Component({
  selector: 'app-home',
  imports: [
    HeroSection,
    EducationalCards,
    LangTranslation,
    Courses,
    ContactUs,
    Exam,
    LearningLang,
    Steps,
    SocialMedia,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  heroData = signal<HeroSectionData>({
    title: 'افتح ابوابك لعالم من الفرص',
    subtitle: 'مع مركز اللغات والترجمة',
    description:
      'نقدم لك اختبارات اللغة المعتمدة دوليًا، برامج تدريبية متخصصة، وخدمات ترجمة احترافية لدعم مسيرتك الأكاديمية والمهنية',

    ctas: [
      {
        label: '  سجّل في امتحان TOEFL',
        icon: 'pi pi-arrow-left',
        type: 'primary',
        link: '/courses/1/exam',
      },
      {
        label: 'تعرّف على خدماتنا',
        type: 'outline',
        link: '/courses',
      },
    ],
  });

  educationalCards = signal<EducationalCard[]>([
    {
      id: 1,
      icon: '/images/icon/checkmark.svg',
      title: 'لاختبارات الاكاديمية',
      description: 'TOEFL, IELTS وغيرها',
      link: '/courses',
      bgColor: '#0052A3',
    },
    {
      id: 2,
      icon: '/images/icon/graduated.svg',
      title: 'للكورسات والدورات',
      description: ' برامج تعليمية متخصصه',
      link: '/courses',
      bgColor: '#5639AF',
    },
    {
      id: 3,
      icon: '/images/icon/translate.svg',
      title: 'لخدمات الترجمة',
      description: 'خدمات ترجمة احترافية و دقيقة',
      link: '/courses',
      bgColor: '#008F88',
    },
    {
      id: 4,
      icon: '/images/icon/translate.svg',
      title: "لأعضاء هيئة التدريس",
      description: "برامج خاصة للأكاديميين",
      link: '/courses',
      bgColor: '#E65525',
    },
  ]);
}
