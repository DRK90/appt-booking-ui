import { NgModule } from '@angular/core';

// Angular Material components
import { MatToolbarModule }      from '@angular/material/toolbar';
import { MatIconModule }         from '@angular/material/icon';
import { MatMenuModule }         from '@angular/material/menu';
import { MatButtonModule }       from '@angular/material/button';
import { MatFormFieldModule }    from '@angular/material/form-field';
import { MatInputModule }        from '@angular/material/input';
import { MatSelectModule }       from '@angular/material/select';
import { MatCardModule }         from '@angular/material/card';
import { MatDatepickerModule }   from '@angular/material/datepicker';
import { MatNativeDateModule }   from '@angular/material/core';  // date adapter
import { MatSnackBarModule }    from '@angular/material/snack-bar';
@NgModule({
  exports: [
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ]
})
export class MaterialModule {}
