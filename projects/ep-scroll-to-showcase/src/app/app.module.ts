import { EpScrollToModule } from './../../../ep-scroll-to/src/lib/ep-scroll-to.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, EpScrollToModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
