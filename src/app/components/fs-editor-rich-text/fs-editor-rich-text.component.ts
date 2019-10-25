import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
  Renderer2,
  ElementRef,
  forwardRef,
  OnDestroy,
  HostBinding,
  Output,
  EventEmitter
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { FsEditorRichTextOptions } from '../../interfaces/fs-editor-rich-text.interface';
import { FsEditorRichTextService } from '../../services/fs-editor-rich-text.service';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'fs-editor-rich-text',
  templateUrl: 'fs-editor-rich-text.component.html',
  styleUrls: [ 'fs-editor-rich-text.component.scss' ],
  providers: [
    FsEditorRichTextService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FsEditorRichTextComponent),
      multi: true
    }
  ]
})
export class FsEditorRichTextComponent implements OnInit, ControlValueAccessor, OnDestroy {

  @Input() public options: FsEditorRichTextOptions = {};
  @Input() public ngModel;

  @Output() public initialized = new EventEmitter();
  @Output() public destroyed = new EventEmitter();

  @ViewChild('editor') public container;

  @HostBinding('class.focused') classFocused = false;

  public disabled;
  public initializing;

  private _destroy$ = new Subject();
  private _focus$ = new Subject();

  constructor(
    private _richTextService: FsEditorRichTextService,
  ) {}

  onChange = (data: any) => {};
  onTouched = () => {};

  public ngOnInit() {
    this._richTextService.setOptions(this.options);

    if (!this.options.initOnClick) {
      this.initalize();
    }
  }

  public initalize() {

    if (this._richTextService.initialized) {
      return;
    }

    this.initializing = true;
    setTimeout(() => {
      this._richTextService.setTargetElement(this.container);
      this._richTextService.initEditor();
      this._richTextService.editor.setContents(this.ngModel);
      this.subscribe();
      this._richTextService.editor.focus();
      this.initialized.emit();
    });
  }

  public writeValue(data: any): void {
    if (this._richTextService.editor) {
      this._richTextService.editor.setContents(data);
    }
  }

  public registerOnChange(fn: (data: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public disable(disable = true): void {
    this.disabled = disable;
  }

  public subscribe() {
    this._richTextService.editor.on('text-change', this._textChange);
    this._richTextService.editor.root.addEventListener('blur', this.blur);
    this._richTextService.editor.root.addEventListener('focus', this.focus);

    this._focus$
    .pipe(
      debounceTime(100),
      takeUntil(this._destroy$)
    )
    .subscribe((value: boolean) => {
      this.classFocused = value;
    });
  }

  public blur = () => {
    this._focus$.next(false);
  }

  public focus = () => {
    this._focus$.next(true);
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
    this.destroy();
  }

  public destroy() {
    this.initializing = false;
    if (this._richTextService.editor) {
      this._richTextService.editor.off('text-change', this._textChange);
      this._richTextService.editor.root.removeEventListener('blur', this.blur);
      this._richTextService.editor.root.removeEventListener('focus', this.focus);
    }

    this._richTextService.destroy();
    this.destroyed.emit();
  }

  private _textChange = (delta, oldDelta, source) => {
    let contents = this._richTextService.editor.getContents().ops;

    if (contents.length === 1 && contents[0].insert === '\n') {
      contents = [];
    }

    this.onChange(contents);
    if (this.options.change) {
      this.options.change.apply(null, [contents]);
    }
  }
}
