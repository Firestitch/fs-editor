import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html/dist/commonjs/QuillDeltaToHtmlConverter';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: '[fsEditorRenderer]',
  templateUrl: 'fs-editor-renderer.component.html',
  styleUrls: [ 'fs-editor-renderer.component.scss' ]
})
export class FsEditorRendererComponent implements OnInit {

  public html: SafeHtml;

  private _content;

  constructor(private sanitized: DomSanitizer) {}

  public ngOnInit() {
    this.content = this._content;
  }

  @Input('content') set content(data) {

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
    this._content = data;
  }
}
