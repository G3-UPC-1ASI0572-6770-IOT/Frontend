import {ChangeDetectionStrategy, Component, OnInit, computed, effect, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {ParkingLotStore} from '../../../application/parking-lot.store';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';

@Component({
  selector: 'app-parking-lot-profile',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './parking-lot-profile.html',
  styleUrl: './parking-lot-profile.css'
})
export class ParkingLotProfile implements OnInit {
  private readonly fb = inject(FormBuilder);
  protected readonly store = inject(ParkingLotStore);
  protected readonly router = inject(Router);

  protected readonly tab = signal<'overview' | 'spaces' | 'events'>('overview');
  protected readonly savedToast = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    capacity: [0, [Validators.required, Validators.min(1)]],
    hourlyRate: [0, [Validators.required, Validators.min(0)]]
  });

  protected readonly occupancyPct = computed(() => {
    const l = this.store.selected();
    return l && l.capacity ? Math.round((l.occupied / l.capacity) * 100) : 0;
  });

  ngOnInit(): void {
    if (!this.store.selected()) this.store.load();
  }

  constructor() {
    effect(() => {
      const l = this.store.selected();
      if (l) {
        this.form.patchValue({
          name: l.name, address: l.address, city: l.city,
          capacity: l.capacity, hourlyRate: l.hourlyRate
        }, {emitEvent: false});
      }
    });
  }

  protected save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.savedToast.set(true);
    setTimeout(() => this.savedToast.set(false), 2400);
  }
}
