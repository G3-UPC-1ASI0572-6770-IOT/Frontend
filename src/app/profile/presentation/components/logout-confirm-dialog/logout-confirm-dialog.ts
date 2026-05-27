import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {IamStore} from '../../../../iam/application/iam.store';
import {ProfileStore} from '../../../application/profile.store';

@Component({
  selector: 'app-logout-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './logout-confirm-dialog.html',
  styleUrl: './logout-confirm-dialog.css'
})
export class LogoutConfirmDialog {
  private readonly dialogRef = inject(MatDialogRef<LogoutConfirmDialog>);
  private readonly router = inject(Router);
  private readonly iamStore = inject(IamStore);
  protected readonly profileStore = inject(ProfileStore);

  protected cancel(): void { this.dialogRef.close(false); }
  protected logout(): void {
    this.iamStore.signOut();
    this.dialogRef.close(true);
    this.router.navigate(['/iam/sign-in']);
  }
}
