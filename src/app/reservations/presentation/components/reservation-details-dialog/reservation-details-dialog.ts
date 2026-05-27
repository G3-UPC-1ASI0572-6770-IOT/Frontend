import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Reservation} from '../../../../shared/domain/model/reservation';

@Component({
  selector: 'app-reservation-details-dialog',
  templateUrl: './reservation-details-dialog.html',
  styleUrl: './reservation-details-dialog.css'
})
export class ReservationDetailsDialog {
  private readonly dialogRef = inject(MatDialogRef<ReservationDetailsDialog>);
  protected readonly reservation = inject<Reservation>(MAT_DIALOG_DATA);

  protected close(): void {
    this.dialogRef.close();
  }

  protected manageReservation(): void {
    this.dialogRef.close({managed: true, reservationId: this.reservation.id});
  }
}
