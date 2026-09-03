import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExamEnrollService, ExamListItem } from '../../../core/service/exam-enroll.service';

@Component({
  selector: 'app-egyptians-registration',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './egyptians-registration.html',
  styleUrl: './egyptians-registration.scss',
})
export class EgyptiansRegistration implements OnChanges {
  private readonly examEnrollService = inject(ExamEnrollService);

  exams = input<ExamListItem[]>([]);
  defaultExamId = input<number>(1);
  isSubmitting = input<boolean>(false);

  imagePreview = signal<string | null>(null);
  isImageLoading = signal<boolean>(false);

  form: FormGroup;
  formSubmit = output<FormData>();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      examId: [this.defaultExamId(), Validators.required],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      university: ['', Validators.required],
      faculty: ['', Validators.required],
      nationalId: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
      degree: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      fawryNumber: ['', [Validators.required, Validators.pattern(/^9\d+$/)]],
      paymentDate: ['', Validators.required],
      receiptImage: [null, Validators.required],
    });
  }

  // Update examId when inputs change
  ngOnChanges() {
    if (this.defaultExamId()) {
      this.form.patchValue({ examId: this.defaultExamId() });
    }

    // Make examId optional when no exams are provided (course enrollment)
    const examIdControl = this.form.get('examId');
    if (this.exams().length === 0) {
      examIdControl?.clearValidators();
    } else {
      examIdControl?.setValidators(Validators.required);
    }
    examIdControl?.updateValueAndValidity();
  }

  onExamChange(examId: number): void {
    this.form.patchValue({ examId });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        return;
      }
      this.isImageLoading.set(true);
      this.form.patchValue({ receiptImage: file });
      this.form.get('receiptImage')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Add a simulated delay to give the user visual feedback of the "upload/processing" state
        setTimeout(() => {
          this.imagePreview.set(e.target.result);
          this.isImageLoading.set(false);
        }, 1200);
      };
      reader.onerror = () => {
        this.isImageLoading.set(false);
        this.imagePreview.set(null);
      };
      reader.readAsDataURL(file);
    }
  }

  onNumberOnlyInput(event: any, maxLength: number) {
    let value = event.target.value;
    // Remove all non-numeric characters
    value = value.replace(/\D/g, '');
    // Enforce max length
    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
    }
    event.target.value = value;
    // Keep form control in sync
    const controlName = event.target.getAttribute('formControlName');
    if (controlName && this.form.get(controlName)) {
      this.form.get(controlName)?.setValue(value, { emitEvent: false });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const values = this.form.value;

    if (values.examId) {
      formData.append('exam_id', values.examId);
    }
    formData.append('full_name', values.fullName);
    formData.append('university_name', values.university);
    formData.append('faculty_name', values.faculty);
    formData.append('national_id', values.nationalId);
    formData.append('degree', values.degree);
    formData.append('phone', values.phone);
    formData.append('fawry_receipt_number', values.fawryNumber);
    formData.append('payment_date', values.paymentDate);
    formData.append('nationality', 'egyptian');

    if (values.receiptImage) {
      formData.append('receipt', values.receiptImage);
    }

    // console.log('FormData Content:', Object.fromEntries(formData.entries()));

    this.formSubmit.emit(formData);
  }

  get f() {
    return this.form.controls;
  }
}
