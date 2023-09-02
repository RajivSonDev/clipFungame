 import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ClipComponent } from './clip/clip.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ClipService } from './service/clip.service';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'about',component:AboutComponent},
  {path:'clip/:id',component:ClipComponent, resolve:{   // resolve will be return the data
    clip:ClipService
  }},
  {
    path:'', // dashboard/manage , dashboard/upload
    loadChildren: async () => (await import('./video/video.module')).VideoModule    // Explicitly telling 
    // Angular to load
  },
  {path:'**',component:NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],   
  exports: [RouterModule]
})
export class AppRoutingModule { }
