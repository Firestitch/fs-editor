import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


export class ClipboardPaste {

  private _processPastedContentCallback = this.processPastedContent.bind(this);
  private _imagePasted$ = new Subject<Blob>();
  private _destroy$ = new Subject<void>();

  constructor(private _targetContainer: any) {}

  get imagePasted$(): Observable<Blob> {
    return this._imagePasted$
      .pipe(
        takeUntil(this._destroy$)
      );
  }

  public subscribe() {
    this._targetContainer.addEventListener('paste', this._processPastedContentCallback, false);
  }

  public unsubscribe() {
    this._targetContainer.removeEventListener('paste', this._processPastedContentCallback);
  }

  public destroy() {
    this.unsubscribe();
    this._destroy$.next();
    this._destroy$.complete();
  }

  private processPastedContent(e: ClipboardEvent) {
    e.preventDefault();
    e.stopPropagation();

    const items = e.clipboardData.items;
    const itemsCount = items.length;

    for (let i = 0; i < itemsCount; i++) {
      if (items[i].type.indexOf('image') == -1) continue;
      
      // Retrieve image on clipboard as blob
      const blob = items[i].getAsFile();

      if (blob) {
        this._imagePasted$.next(blob);
      }
    }
  }
}
