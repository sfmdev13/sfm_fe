import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from './components/layout/layout.module';
import { AuthInterceptor } from './auth.interceptor';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ExcelService } from './excel.service';

registerLocaleData(en);

@NgModule({ declarations: [
        AppComponent,
        UnauthorizedComponent,
        SpinnerComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        LayoutModule,
        NzModalModule,
        NzSpinModule], providers: [
            ExcelService,
        { provide: NZ_I18N, useValue: en_US },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
