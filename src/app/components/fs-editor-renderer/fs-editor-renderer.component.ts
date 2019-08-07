import {
  Component,
  forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html/dist/commonjs/QuillDeltaToHtmlConverter';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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

  public html: SafeHtml;

  constructor(private sanitized: DomSanitizer) {}

  onChange = (data: any) => {};
  onTouched = () => {};

  public writeValue(data: any): void {

    const config = {
      inlineStyles: {
        color: (value, op) => {
          return 'color:' + value;
        },
        background: (value, op) => {
          return 'background-color:' + value;
        },
        indent: (value, op) => {
          const indentSize = parseInt(value, 10) * 2;
          const side = op.attributes.direction === 'rtl' ? 'right' : 'left';
          return 'padding-' + side + ':' + indentSize + 'em';
        },
        direction: (value, op) => {
          if (value === 'rtl') {
              return 'direction:rtl' + ( op.attributes.align ? '' : '; text-align: inherit' );
          } else {
              return '';
          }
        }
      }
    };

    const converter = new QuillDeltaToHtmlConverter(data || {}, config);
    this.html = this.sanitized.bypassSecurityTrustHtml(converter.convert());
  }

  public registerOnChange(fn: (data: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
