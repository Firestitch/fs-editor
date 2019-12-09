import {
  Component,
  Input,
  OnInit,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html/dist/commonjs/QuillDeltaToHtmlConverter';


@Component({
  selector: '[fsEditorRenderer]',
  templateUrl: 'fs-editor-renderer.component.html',
  styleUrls: [ 'fs-editor-renderer.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsEditorRendererComponent implements OnInit {

  @Input() format: 'html' | 'text' = 'html';

  @Input('content')
  set content(data) {

    this._content = data;

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
            return 'direction:rtl' + (op.attributes.align ? '' : '; text-align: inherit');
          } else {
            return '';
          }
        }
      }
    };

    const converter = new QuillDeltaToHtmlConverter(this._content || {}, config);

    if (this.format === 'html') {
      this.el.nativeElement.innerHTML = converter.convert();

    } else if (this.format === 'text') {
      const div = document.createElement('div');
      div.innerHTML = converter.convert();
      this.el.nativeElement.innerHTML = div.textContent || div.innerText || '';
    }
  }

  private _content;

  constructor(private el: ElementRef) {}

  public ngOnInit() {
    this.content = this._content;
  }
}
