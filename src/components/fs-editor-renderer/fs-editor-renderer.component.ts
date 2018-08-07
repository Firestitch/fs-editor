import {
  Component,
  forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import QuillDeltaToHtmlConverter = require('quill-delta-to-html');


export const FS_EDITOR_RENDERER_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FsEditorRendererComponent),
  multi: true
};


@Component({
  selector: '[fsEditorRenderer]',
  templateUrl: 'fs-editor-renderer.component.html',
  styleUrls: [ 'fs-editor-renderer.component.scss' ],
  providers: [
    FS_EDITOR_RENDERER_CONTROL_VALUE_ACCESSOR
  ]
})
export class FsEditorRendererComponent implements ControlValueAccessor {

  public html = '';

  constructor() {}

  onChange = (data: any) => {};
  onTouched = () => {};

  public writeValue(data: any): void {
    const converter = new QuillDeltaToHtmlConverter(data || {}, {});
    this.html = converter.convert();
  }

  public registerOnChange(fn: (data: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
