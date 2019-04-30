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
  HostBinding
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { FsEditorRichTextOptions } from '../../interfaces/fs-editor-rich-text.interface';
import { FsEditorRichTextService } from '../../services/fs-editor-rich-text.service';
import { Subject } from 'rxjs';
import { debounce, debounceTime, first } from 'rxjs/operators';


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
export class FsEditorRichTextComponent implements OnInit, AfterViewInit, ControlValueAccessor, OnDestroy {

  @Input() public options: FsEditorRichTextOptions = {};
  @Input() public ngModel;

  @ViewChild('editor') public container;

  @HostBinding('class.focused') classFocused = false;

  public disabled;

  private _destroy$ = new Subject();
  private _focus$ = new Subject();

  constructor(
    private _el: ElementRef,
    private _renderer: Renderer2,
    private _richTextService: FsEditorRichTextService,
  ) {}

  onChange = (data: any) => {};
  onTouched = () => {};

  public ngOnInit() {
    // Setup
    this._richTextService.setOptions(this.options);
  }

  public ngAfterViewInit() {
    // Init
    this._richTextService.setTargetElement(this.container);
    this._richTextService.initEditor();
    this._richTextService.editor.setContents(this.ngModel);
    this.subscribe();
  }

  public writeValue(data: any): void {
    console.log(data);
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

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public subscribe() {
    this._richTextService.editor.on('text-change', (delta, oldDelta, source) => {
      const data = this._richTextService.editor.getContents().ops;
      this.onChange(data);
      this.change(data);
    });

    this._richTextService.editor.root.addEventListener('blur', this.blur);
    this._richTextService.editor.root.addEventListener('focus', this.focus);


    this._focus$
    .pipe(
      debounceTime(100)
    )
    .subscribe((value: boolean) => {
      this.classFocused = value;
    });
  }

  private blur = () => {
    this._focus$.next(false);
  }

  private focus = () => {
    this._focus$.next(true);
  }

  private change(data) {
    if (this.options.change) {
      this.options.change.apply(null, [data]);
    }
  }

  ngOnDestroy() {

    this._richTextService.editor.root.removeEventListener('blur', this.blur);
    this._richTextService.editor.root.removeEventListener('focus', this.focus);

    this._destroy$.next();
    this._destroy$.complete();
  }
}
