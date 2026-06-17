import {Component, OnInit, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {navigationItems} from '../../../infrastructure/navigation-items';
import {ProfileStore} from '../../../../profile/application/profile.store';

@Component({
  selector: 'app-owner-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './owner-layout.html',
  styleUrl: './owner-layout.css'
})
export class OwnerLayout implements OnInit {
  protected readonly navItems = navigationItems;
  protected readonly mobileMenuOpen = signal(false);
  protected readonly notificationsCount = signal(3);
  protected readonly profileStore = inject(ProfileStore);
  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.profileStore.load();
  }

  protected readonly currentPath = computed(() => this.router.url);

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
