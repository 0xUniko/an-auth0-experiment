import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule.forRoot({
      domain: 'dev-3rae35pa.jp.auth0.com',
      clientId: 'EGiW0SOiomkRtHrzvEjAPQ6oOrkMkXzj',
      audience: 'api-for-azure-functions',
      httpInterceptor: {
        allowedList: [{ uri: 'api/*', allowAnonymous: true }],
        // allowedList: [{ uri: 'api/HttpTrigger1' }],
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
