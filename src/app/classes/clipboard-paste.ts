import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


export class ClipboardPaste {

  private _processPastedContentCallback = this.processPastedContent.bind(this);
  private _imagePasted$ = new Subject<Blob>();
  private _textPasted$ = new Subject<string>();
  private _destroy$ = new Subject<void>();

  constructor(private _targetContainer: any) {}

  get imagePasted$(): Observable<Blob> {
    return this._imagePasted$
      .pipe(
        takeUntil(this._destroy$)
      );
  }

  get textPasted$(): Observable<string> {
    return this._textPasted$
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

    // default text's copy/paste works without preventDefault & stopPropagation
    e.preventDefault(); // problem
    e.stopPropagation(); // problem

    const items = e.clipboardData.items;

    let itemsCount = items.length;

    for (let i = 0; i < itemsCount; i++) {
      if (items[i].type.indexOf('text/html') !== -1) {
        items[i].getAsString((text: string) => {
          if (text) {
            this._textPasted$.next(text);
          }
        });

      }

      if (items[i].type.indexOf('image') !== -1) {
        // Retrieve image on clipboard as blob
        const blob = items[i].getAsFile();

        if (blob) {
          this._imagePasted$.next(blob);
        }
      }

    }
  }
}
