import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  HostBinding,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
  ViewChild,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';

import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { FsEditorRichTextOptions } from '../../interfaces/fs-editor-rich-text.interface';
import { FsEditorRichTextService } from '../../services/fs-editor-rich-text.service';


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
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FsEditorRichTextComponent),
      multi: true
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsEditorRichTextComponent implements OnInit, ControlValueAccessor, Validator, OnDestroy {

  @Input() public options: FsEditorRichTextOptions = {};
  @Input() public ngModel;

  @Input() maxLength?: number;
  @Input() minLength?: number;
  @Input() required = false;

  @Output() public initialized = new EventEmitter();
  @Output() public destroyed = new EventEmitter();

  @ViewChild('editor')
  public container;

  @HostBinding('class.focused') classFocused = false;

  public disabled;
  public initializing;

  private _destroy$ = new Subject();
  private _focus$ = new Subject();

  constructor(
    private _richTextService: FsEditorRichTextService,
    private _cdRef: ChangeDetectorRef,
  ) {}

  onChange = (data: any) => {};
  onTouched = () => {};

  public ngOnInit() {
    this._richTextService.setOptions(this.options);

    if (!this.options.initOnClick) {
      this.initialize();
    }
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    if (!this._richTextService.editor) {
      return null
    }

    const err: {
      minLengthError?: {
        given: number
        minLength: number
      }
      maxLengthError?: {
        given: number
        maxLength: number
      }
      requiredError?: { empty: boolean }
    } = {};

    let valid = true;

    const textLength = this._richTextService.editor.getText().trim().length;

    if (this.minLength && textLength && textLength < this.minLength) {
      err.minLengthError = {
        given: textLength,
        minLength: this.minLength
      };

      valid = false
    }

    if (this.maxLength && textLength > this.maxLength) {
      err.maxLengthError = {
        given: textLength,
        maxLength: this.maxLength
      };

      valid = false
    }

    if (this.required !== undefined && !textLength) {
      err.requiredError = {
        empty: true
      };

      valid = false
    }

    return valid ? null : err
  }

  public initialize() {
    if (this._richTextService.initialized) {
      return;
    }

    this.initializing = true;
    this._cdRef.markForCheck();

    setTimeout(() => {
      this._richTextService.setTargetElement(this.container);
      this._richTextService.initEditor();
      this._richTextService.editor.setContents(this.ngModel);
      this.onChange(this.ngModel);
      this.subscribe();
      this._richTextService.editor.focus();
      this.initialized.emit();
    });
  }

  public initializeEmpty() {
    if (!this.ngModel || !this.ngModel.length) {
      this.initialize();
    }
  }

  public writeValue(data: any): void {
    if (this._richTextService.editor) {
      this._richTextService.editor.setContents(data);
      this._cdRef.markForCheck();
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
      this._cdRef.markForCheck();
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

    this._cdRef.markForCheck();
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
    this._cdRef.markForCheck();
  }
}
