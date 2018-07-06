import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
  Renderer2,
  ElementRef,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { FsEditorRichTextOptions } from '../../interfaces';
import { FsEditorRichTextService } from '../../services/fs-editor-rich-text.service';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FsEditorRichTextComponent),
  multi: true
};


@Component({
  selector: 'fs-editor-rich-text',
  templateUrl: 'fs-editor-rich-text.component.html',
  styleUrls: [ 'fs-editor-rich-text.component.scss' ],
  providers: [
    FsEditorRichTextService,
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR
  ]
})
export class FsEditorRichTextComponent implements OnInit, AfterViewInit, ControlValueAccessor {

  @Input() public options: FsEditorRichTextOptions = {};

  @ViewChild('editor') public container;

  public text = '';
  public disabled;

  constructor(
    private _el: ElementRef,
    private _renderer: Renderer2,
    private _richTextService: FsEditorRichTextService,
  ) {
  }

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
    this.subscribe();
  }

  public writeValue(data: any): void {
    this.text = data;
    this.onChange(this.text);
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
      this.writeValue(this._richTextService.editor.getContents());
    });
  }
}
