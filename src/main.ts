import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import firebase from 'firebase/compat/app';
import { environment } from '../environments/environment';

firebase.initializeApp(environment.firebase)

firebase.auth().onAuthStateChanged(()=>{
  
  let appInit=false;

  if(!appInit){
    platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
  }

  appInit=true;
})

