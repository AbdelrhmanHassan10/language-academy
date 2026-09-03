import { Component, ElementRef, inject, input, output, signal, ViewChild } from '@angular/core';
import { EgyptiansRegistration } from '../egyptians-registration/egyptians-registration';
import { ExpatriateRegistration } from '../expatriate-registration/expatriate-registration';
import { CourseService } from '../../../core/service/course.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-course-register',
  imports: [EgyptiansRegistration, ExpatriateRegistration],
  templateUrl: './course-register.html',
  styleUrl: './course-register.scss',
})
export class CourseRegister {
  private readonly courseService = inject(CourseService);

  isOpen = input<boolean>(false);
  courseId = input<number | null>(null);
  closePanel = output<void>();

  @ViewChild('egyptBtn') egyptBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('foreignBtn') foreignBtn!: ElementRef<HTMLButtonElement>;

  selectedTab = signal<'egyptians' | 'expatriates'>('egyptians');
  isSubmitting = signal<boolean>(false);

  select(type: 'egyptians' | 'expatriates') {
    this.selectedTab.set(type);
  }

  onEgyptianSubmit(formData: FormData) {
    const id = this.courseId();
    if (!id) {
      this.showErrorAlert('معرف الكورس مفقود.');
      return;
    }

    this.isSubmitting.set(true);
    this.courseService.registerEgyptian(id, formData).subscribe({
      next: (response) => {
        if (response?.success === false) {
          const message = response.message || 'تعذر التسجيل في الكورس. حاول مرة أخرى.';
          if (message === 'أنت مسجل بالفعل في هذا الكورس') {
            this.showAlreadyRegisteredAlert(message);
          } else {
            this.showErrorAlert(message);
          }
          this.isSubmitting.set(false);
          return;
        }

        this.showSuccessAlert();
        this.isSubmitting.set(false);
        this.close();
      },
      error: (error) => {
        const message = this.extractErrorMessage(error) || 'تعذر التسجيل في الكورس. حاول مرة أخرى.';
        if (message === 'أنت مسجل بالفعل في هذا الكورس') {
          this.showAlreadyRegisteredAlert(message);
        } else {
          this.showErrorAlert(message);
        }
        this.isSubmitting.set(false);
      },
    });
  }

  onExpatriateSubmit(formData: FormData) {
    const id = this.courseId();
    console.log('courseId:', id);
    if (!id) {
      this.showErrorAlert('معرف الكورس مفقود.');
      return;
    }

    this.isSubmitting.set(true);
    this.courseService.registerExpatriate(id, formData).subscribe({
      next: (response) => {
        if (response?.success === false) {
          const message = response.message || 'تعذر التسجيل في الكورس. حاول مرة أخرى.';
          if (message === 'أنت مسجل بالفعل في هذا الكورس') {
            this.showAlreadyRegisteredAlert(message);
          } else {
            this.showErrorAlert(message);
          }
          this.isSubmitting.set(false);
          return;
        }

        this.showSuccessAlert();
        this.isSubmitting.set(false);
        this.close();
      },
      error: (error) => {
        const message = this.extractErrorMessage(error) || 'تعذر التسجيل في الكورس. حاول مرة أخرى.';
        if (message === 'أنت مسجل بالفعل في هذا الكورس') {
          this.showAlreadyRegisteredAlert(message);
        } else {
          this.showErrorAlert(message);
        }
        this.isSubmitting.set(false);
      },
    });
  }

  private showSuccessAlert(): void {
    Swal.fire({
      icon: 'success',
      title: 'تم التسجيل بنجاح',
      text: 'تم إرسال طلب التسجيل بنجاح وسيتم مراجعته قريباً.',
      confirmButtonText: 'حسناً',
      confirmButtonColor: '#2563eb',
    });
  }

  private showErrorAlert(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'خطأ',
      text: message,
      confirmButtonText: 'حسناً',
      confirmButtonColor: '#d33',
    });
  }

  private showAlreadyRegisteredAlert(message: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'تنبيه',
      text: message,
      confirmButtonText: 'حسناً',
      confirmButtonColor: '#2563eb',
    }).then(() => {
      this.close();
    });
  }

  private extractErrorMessage(payload: any): string {
    return payload?.error?.message || payload?.message || '';
  }

  close() {
    this.closePanel.emit();
  }

  showScrollArrow = signal(true);

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  onScroll(): void {
    const el = this.scrollContainer.nativeElement;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10; // 10px threshold
    this.showScrollArrow.set(!atBottom);
  }
}
