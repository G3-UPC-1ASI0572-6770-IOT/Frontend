import {ChangeDetectionStrategy, Component, OnInit, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {SpacesStore} from '../../../application/spaces.store';
import {IamStore} from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-spaces-management',
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './spaces-management.html',
  styleUrl: './spaces-management.css'
})
export class SpacesManagement implements OnInit {
  protected readonly store = inject(SpacesStore);
  private readonly iamStore = inject(IamStore);

  ngOnInit(): void {
    const lotId = this.iamStore.parkingLotId;
    if (lotId) this.store.load(lotId);
  }
}
