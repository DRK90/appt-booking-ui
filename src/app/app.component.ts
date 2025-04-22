import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavBarComponent } from './shared/top-nav-bar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopNavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'appt-booking-ui';
}
