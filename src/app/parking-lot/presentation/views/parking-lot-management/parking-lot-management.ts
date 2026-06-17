import {ChangeDetectionStrategy, Component, OnInit, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {ParkingLotStore} from '../../../application/parking-lot.store';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';

@Component({
  selector: 'app-parking-lot-management',
  imports: [CommonModule, FormsModule, RouterLink, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './parking-lot-management.html',
  styleUrl: './parking-lot-management.css'
})
export class ParkingLotManagement implements OnInit {
  protected readonly store = inject(ParkingLotStore);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.store.load();
  }

  protected open(id: string): void {
    this.store.select(id);
    this.router.navigate(['/parking-lot/profile']);
  }
}
