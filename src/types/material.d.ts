declare module '@angular/material/dialog' {
  import {ComponentType} from '@angular/cdk/overlay';
  import {ComponentRef, Injector, EnvironmentInjector} from '@angular/core';
  import {Observable} from 'rxjs';

  export interface MatDialogConfig<D = any> {
    data?: D;
    width?: string;
    height?: string;
    minWidth?: string | number;
    minHeight?: string | number;
    maxWidth?: string | number;
    maxHeight?: string | number;
    panelClass?: string | string[];
    backdropClass?: string;
    disableClose?: boolean;
    autoFocus?: boolean;
    restoreFocus?: boolean;
    direction?: 'ltr' | 'rtl';
    ariaDescribedBy?: string;
    ariaLabel?: string;
    ariaModal?: boolean;
  }

  export class MatDialogRef<T, R = any> {
    readonly id: string;
    readonly componentInstance: T;
    readonly disableClose: boolean | undefined;
    close(dialogResult?: R): void;
    afterClosed(): Observable<R | undefined>;
    afterOpened(): Observable<void>;
    beforeClosed(): Observable<R | undefined>;
    backdropClick(): Observable<MouseEvent>;
    keydownEvents(): Observable<KeyboardEvent>;
  }

  export interface DialogPosition {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  }

  export const MAT_DIALOG_DATA: any;
  export const MAT_DIALOG_DEFAULT_OPTIONS: any;
  export const MatDialogDefaultOptions: any;

  export class MatDialog {
    open<T, D = any, R = any>(
      component: ComponentType<T>,
      config?: MatDialogConfig<D>
    ): MatDialogRef<T, R>;
    getDialogById(id: string): MatDialogRef<any> | undefined;
    openDialogs: MatDialogRef<any>[];
    afterOpened: Observable<MatDialogRef<any>>;
  }

  export class MatDialogModule {}
}
