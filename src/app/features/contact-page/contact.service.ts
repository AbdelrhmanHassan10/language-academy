import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
providedIn: 'root'
})
export class ContactService {
private readonly http = inject(HttpClient);

sendContactMessage(formData: any): Observable<any> {
    return this.http.post(`${environment.baseUrl}/student/contact-messages`, formData);
}
}