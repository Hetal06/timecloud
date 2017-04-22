import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPage } from './login';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule,
    HttpModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    LoginPage
  ]
})
export class LoginModule { }
