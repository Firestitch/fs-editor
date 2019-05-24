import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


export class ClipboardPaste {

  private _processPastedContentCallback = this.processPastedContent.bind(this);
  private _imagePasted$ = new Subject<File>();
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
    this._targetContainer.addEventListener('drop', this._processPastedContentCallback, false);
  }

  public unsubscribe() {
    this._targetContainer.removeEventListener('paste', this._processPastedContentCallback);
    this._targetContainer.removeEventListener('drop', this._processPastedContentCallback, false);
  }

  public destroy() {
    this.unsubscribe();
    this._destroy$.next();
    this._destroy$.complete();
  }

  private processPastedContent(e: DragEvent | ClipboardEvent) {

    // from copy/paste or drag/drop event
    const items = e instanceof ClipboardEvent ? e.clipboardData.items : e.dataTransfer.files;

    const itemsCount = items.length;

    for (let i = 0; i < itemsCount; i++) {

      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        e.stopPropagation();

        // Retrieve image on clipboard as blob
        const blob: File = (items[i] as DataTransferItem).getAsFile
          ? (items[i] as DataTransferItem).getAsFile()
          : (items[i] as File);

        if (blob) {
          this._imagePasted$.next(blob);
        }
      }

    }
  }
}
