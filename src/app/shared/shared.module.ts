import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { BrowserModule } from '@angular/platform-browser';
import { TabsContainerComponent } from './tabs-container/tabs-container.component';
import { TabsComponent } from './tabs/tabs.component';
import { InputComponent } from './input/input.component';



@NgModule({
  declarations: [
    ModalComponent,
    TabsContainerComponent,
    TabsComponent,
    InputComponent
  ],
  imports: [
    CommonModule,
    BrowserModule
  ],
  exports:[
    ModalComponent,
    TabsContainerComponent,
    TabsComponent
  ]
})
export class SharedModule { }
