import {ChangeDetectionStrategy, Component, OnInit, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {EventsStore} from '../../../application/events.store';

type EventsView = 'main' | 'empty';
type DetailsPath = 'Path A' | 'Path B' | 'Direct';

@Component({
  selector: 'app-events-history',
  imports: [CommonModule, FormsModule, RouterLink, PageHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './events-history.html',
  styleUrl: './events-history.css'
})
export class EventsHistory implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly eventsStore = inject(EventsStore);

  protected readonly view = signal<EventsView>('main');
  protected readonly detailsOpen = signal(false);
  protected readonly detailsPath = signal<DetailsPath>('Direct');

  protected readonly query = this.eventsStore.query;

  protected get eventRows() {
    return this.eventsStore.filtered().map(e => ({
      time: e.time,
      type: e.title,
      space: '',
      previous: '',
      next: '',
      source: '',
      node: e.id,
      severity: e.severity as 'critical' | 'warning' | 'info'
    }));
  }

  constructor() {
    const segment = this.route.snapshot.url.at(0)?.path ?? '';

    if (segment.includes('empty')) {
      this.view.set('empty');
    }

    if (segment === 'path-b-main') {
      this.showPathBMain();
    }

    if (segment === 'details') {
      this.openDetails('Path A');
    }

    if (segment === 'path-b-details') {
      this.showPathBDetails();
    }
  }

  ngOnInit(): void {
    this.eventsStore.load();
  }

  protected setView(view: EventsView): void {
    this.view.set(view);
  }

  protected showPathA(): void {
    this.view.set('empty');
    this.openDetails('Path A');
  }

  protected showPathBMain(): void {
    this.view.set('main');
    this.detailsOpen.set(false);
    this.detailsPath.set('Path B');
  }

  protected showPathBEmpty(): void {
    this.view.set('empty');
    this.detailsOpen.set(false);
    this.detailsPath.set('Path B');
  }

  protected showPathBDetails(): void {
    this.view.set('empty');
    this.openDetails('Path B');
  }

  protected openDetails(path: DetailsPath = 'Direct'): void {
    this.view.set('empty');
    this.detailsPath.set(path);
    this.detailsOpen.set(true);
  }

  protected closeDetails(): void {
    this.detailsOpen.set(false);
  }

  protected severityLabel(severity: string): string {
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  }
}
