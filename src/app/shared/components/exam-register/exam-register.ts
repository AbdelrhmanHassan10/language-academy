import { Component, inject, input, output, signal, OnInit, effect } from '@angular/core';
import { EgyptiansRegistration } from '../egyptians-registration/egyptians-registration';
import { ExpatriateRegistration } from '../expatriate-registration/expatriate-registration';
import {
  ExamEnrollResponse,
  ExamEnrollService,
  ExamListItem,
} from '../../../core/service/exam-enroll.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-exam-register',
  imports: [EgyptiansRegistration, ExpatriateRegistration],
  templateUrl: './exam-register.html',
  styleUrl: './exam-register.scss',
})
export class ExamRegister implements OnInit {
  private readonly examEnrollService = inject(ExamEnrollService);

  isOpen = input<boolean>(false);
  examId = input<number>(1);
  examTitle = input<string>('اختبار TOEFL');

  closePanel = output<void>();
  enrolled = output<any>();

  selectedTab = signal<'egyptians' | 'expatriates'>('egyptians');
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  exams = signal<ExamListItem[]>([]);

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.loadExams();
      }
    });
  }

  ngOnInit(): void {
    // No longer loading automatically on init
  }

  loadExams(): void {
    this.examEnrollService.getExamsList().subscribe({
      next: (response) => {
        if (response.success) {
          this.exams.set(response.data);
        }
      },
      error: (error) => {
        console.error('Error loading exams:', error);
      },
    });
  }

  select(type: 'egyptians' | 'expatriates'): void {
    this.selectedTab.set(type);
  }

  onEgyptianSubmit(formData: FormData): void {
    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    this.examEnrollService.enrollEgyptian(formData).subscribe({
      next: (response) => {
        if (response.success || this.isAlreadyEnrolledMessage(response.message)) {
          this.isSubmitting.set(false);
          if (!response.success && this.isAlreadyEnrolledMessage(response.message)) {
            this.showAlreadyEnrolledAlert(response.message || '');
          } else {
            this.showSuccessAlert();
          }
          this.enrolled.emit(response.data || response);
          this.close();
          return;
        }

        this.isSubmitting.set(false);
        this.errorMessage.set(response.message || 'تعذر التسجيل في الامتحان. حاول مرة أخرى.');
        this.showErrorAlert(response.message || 'تعذر التسجيل في الامتحان. حاول مرة أخرى.');
      },
      error: (error) => {
        const message = this.extractErrorMessage(error);
        const errorBody = (error as any)?.error;

        if (this.isAlreadyEnrolledMessage(message)) {
          this.isSubmitting.set(false);
          this.showAlreadyEnrolledAlert(message);
          // Extract enrollment_id from error response if available
          const enrollId = errorBody?.data?.enrollment_id || errorBody?.enrollment_id;
          this.enrolled.emit({
            enrollment_id: enrollId,
            status: errorBody?.data?.status || 'pending',
            status_label: errorBody?.data?.status_label || '',
          });
          this.close();
          return;
        }

        this.isSubmitting.set(false);
        this.errorMessage.set(message || 'تعذر التسجيل في الامتحان. حاول مرة أخرى.');
        this.showErrorAlert(message || 'تعذر التسجيل في الامتحان. حاول مرة أخرى.');
      },
    });
  }

  onExpatriateSubmit(formData: FormData): void {
    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    this.examEnrollService.enrollExpatriate(formData).subscribe({
      next: (response) => {
        if (response.success || this.isAlreadyEnrolledMessage(response.message)) {
          this.isSubmitting.set(false);
          if (!response.success && this.isAlreadyEnrolledMessage(response.message)) {
            this.showAlreadyEnrolledAlert(response.message || '');
          } else {
            this.showSuccessAlert();
          }
          this.enrolled.emit(response.data || response);
          this.close();
          return;
        }

        this.isSubmitting.set(false);
        this.errorMessage.set(response.message || 'تعذر التسجيل في الامتحان. حاول مرة أخرى.');
        this.showErrorAlert(response.message || 'تعذر التسجيل في الامتحان. حاول مرة أخرى.');
      },
      error: (error) => {
        const message = this.extractErrorMessage(error);
        const errorBody = (error as any)?.error;

        if (this.isAlreadyEnrolledMessage(message)) {
          this.isSubmitting.set(false);
          this.showAlreadyEnrolledAlert(message);
          const enrollId = errorBody?.data?.enrollment_id || errorBody?.enrollment_id;
          this.enrolled.emit({
            enrollment_id: enrollId,
            status: errorBody?.data?.status || 'pending',
            status_label: errorBody?.data?.status_label || '',
          });
          this.close();
          return;
        }

        this.isSubmitting.set(false);
        this.errorMessage.set(message || 'تعذر التسجيل في الامتحان. حاول مرة أخرى.');
        this.showErrorAlert(message || 'تعذر التسجيل في الامتحان. حاول مرة أخرى.');
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
      title: 'فشل التسجيل',
      text: message,
      confirmButtonText: 'حسناً',
      confirmButtonColor: '#d33',
    });
  }

  private showAlreadyEnrolledAlert(message: string): void {
    Swal.fire({
      icon: 'info',
      title: 'مسجل مسبقاً',
      text: message,
      confirmButtonText: 'حسناً',
      confirmButtonColor: '#2563eb',
      width: '28em',
      padding: '2em',
      color: '#1e293b',
      background: '#f8fafc',
      backdrop: `rgba(15, 23, 42, 0.6)`,
      customClass: {
        popup: 'rounded-3xl shadow-2xl border border-blue-100',
        title: 'text-2xl font-bold text-blue-900 mb-2',
        confirmButton:
          'rounded-xl px-8 py-2.5 text-sm font-semibold shadow-md hover:shadow-lg hover:bg-blue-700 transition-all duration-300',
      },
    });
  }

  private extractErrorMessage(error: unknown): string {
    const errorBody = (error as { error?: ExamEnrollResponse })?.error;
    return errorBody?.message ?? '';
  }

  private isAlreadyEnrolledMessage(message?: string): boolean {
    if (!message) return false;
    return message.includes('مسجل بالفعل') || message.toLowerCase().includes('already enrolled');
  }

  close(): void {
    this.closePanel.emit();
  }
}
