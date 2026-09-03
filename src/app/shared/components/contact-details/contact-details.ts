import { CommonModule } from '@angular/common';
import { Component ,signal , inject} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../../features/contact-page/contact.service';
import Swal from 'sweetalert2';

interface SpecialDepartment {
  id: number;
  name: string;
  phone: string;
  email: string;
  icon: string;
}

@Component({
  selector: 'app-contact-details',
  imports: [CommonModule , ReactiveFormsModule],
  templateUrl: './contact-details.html',
  styleUrl: './contact-details.scss',
})
export class ContactDetails {
  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);

  contactForm: FormGroup = this.fb.group({
    full_name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    subject: ['', [Validators.required]],
    message: ['', [Validators.required]]
  });


  specialDepartments = signal<SpecialDepartment[]>([
    {
      id: 1,
      name: 'قسم الاختبارات',
      phone: '082-2322344',
      email: 'exams@languagecenter.bsu.edu.eg',
      icon: '/images/icon/building.svg'
    },
    {
      id: 2,
      name: 'قسم الكورسات',
      phone: '082-2322355',
      email: 'ccourses@languagecenter.bsu.edu.eg',
      icon: '/images/icon/building.svg'
    },
    {
      id: 3,
      name: 'قسم الترجمة',
      phone: '082-2322366',
      email: 'translation@languagecenter.bsu.edu.eg',
      icon: '/images/icon/building.svg'
    },
    {
      id: 4,
      name: 'الدعم الفني',
      phone: '082-2322377',
      email: 'support@languagecenter.bsu.edu.eg',
      icon: '/images/icon/building.svg'
    }
  ]);


onSubmit() {
  if (this.contactForm.valid) {
    this.contactService.sendContactMessage(this.contactForm.value).subscribe({
      next:(res) => {

        Swal.fire({
          title: 'تم الإرسال!',
          text: 'تم إرسال رسالتك بنجاح، شكرًا لتواصلك معنا.',
          icon: 'success',
          confirmButtonText: 'موافق',
          confirmButtonColor: '#2563eb' 
        });

        this.contactForm.reset();
      },
      error: (err) => {
        Swal.fire({
          title: 'خطأ!',
          text: 'للأسف لم يتم الإرسال، تأكدي من الاتصال بالإنترنت.',
          icon: 'error',
          confirmButtonText: 'حاول مرة أخرى'
        });
      }
    });
  }
}


}