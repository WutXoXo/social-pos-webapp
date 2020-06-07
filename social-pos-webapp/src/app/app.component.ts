import { Component } from '@angular/core';

declare const App : any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'social-pos-webapp';

  ngOnInit(){
    App.initMainPage();
  }
}
