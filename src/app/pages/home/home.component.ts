import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../shared/material-module.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [MaterialModule]
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
