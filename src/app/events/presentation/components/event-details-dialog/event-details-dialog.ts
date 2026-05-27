import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {EventAlert} from '../../../../shared/domain/model/event-alert';

@Component({
  selector: 'app-event-details-dialog',
  templateUrl: './event-details-dialog.html',
  styleUrl: './event-details-dialog.css'
})
export class EventDetailsDialog {
  private readonly dialogRef = inject(MatDialogRef<EventDetailsDialog>);
  protected readonly alert = inject<EventAlert>(MAT_DIALOG_DATA);
  private readonly router = inject(Router);

  protected close(): void {
    this.dialogRef.close();
  }

  protected viewMonitoringBoard(): void {
    this.dialogRef.close();
    this.router.navigate(['/monitoring']);
  }
}
