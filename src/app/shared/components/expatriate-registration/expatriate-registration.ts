import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExamEnrollService, ExamListItem } from '../../../core/service/exam-enroll.service';

@Component({
  selector: 'app-expatriate-registration',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expatriate-registration.html',
  styleUrl: './expatriate-registration.scss',
})
export class ExpatriateRegistration implements OnChanges {
  private readonly examEnrollService = inject(ExamEnrollService);

  exams = input<ExamListItem[]>([]);
  defaultExamId = input<number>(1);
  isSubmitting = input<boolean>(false);

  formSubmit = output<FormData>();

  imagePreview = signal<string | null>(null);
  isImageLoading = signal<boolean>(false);

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      examId: [this.defaultExamId(), Validators.required],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      university: ['', Validators.required],
      faculty: ['', Validators.required],
      passport: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{6,20}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      bankReceiptNumber: ['', Validators.required],
      paymentDate: ['', Validators.required],
      bankReceiptImage: [null, Validators.required],
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
      this.form.patchValue({ bankReceiptImage: file });
      this.form.get('bankReceiptImage')?.updateValueAndValidity();

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
    const examIdValue = this.form.get('examId')?.value;
    if (examIdValue) {
      formData.append('exam_id', examIdValue);
    }
    formData.append('full_name', this.form.get('fullName')?.value);
    formData.append('university_name', this.form.get('university')?.value);
    formData.append('faculty_name', this.form.get('faculty')?.value);
    formData.append('passport_number', this.form.get('passport')?.value);
    formData.append('phone', this.form.get('phone')?.value);
    formData.append('bank_receipt_number', this.form.get('bankReceiptNumber')?.value);
    formData.append('payment_date', this.form.get('paymentDate')?.value);
    formData.append('nationality', 'expatriate');

    const file = this.form.get('bankReceiptImage')?.value;
    if (file instanceof File) {
      formData.append('receipt', file);
    }

    this.formSubmit.emit(formData);
  }

  get f() {
    return this.form.controls;
  }
}
