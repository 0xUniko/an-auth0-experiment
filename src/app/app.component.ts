import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'My App';

  header = 'header';

  constructor(public auth: AuthService, private http: HttpClient) {}

  loginWithRedirect() {
    this.auth.loginWithRedirect();
    // this.auth.loginWithRedirect({ screen_hint: 'signup' });
  }

  logout() {
    this.auth.logout({ returnTo: window.location.origin });
  }

  fetchApi() {
    this.http
      .get<{ header: string }>('api/HttpTrigger1')
      .subscribe((response) => {
        this.header = response.header;
      });
  }
}
