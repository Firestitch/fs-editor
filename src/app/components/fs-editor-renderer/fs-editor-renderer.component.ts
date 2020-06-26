import {
  Component,
  Input,
  OnInit,
  ElementRef,
  ChangeDetectionStrategy,
  HostBinding,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { QuillDeltaToHtmlConverter, DeltaInsertOp } from 'quill-delta-to-html';


@Component({
  selector: '[fsEditorRenderer]',
  templateUrl: 'fs-editor-renderer.component.html',
  styleUrls: [ 'fs-editor-renderer.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsEditorRendererComponent implements OnInit, OnChanges {

  @HostBinding('class.fs-editor-default') classEditorReset = true;
  @HostBinding('class.fs-editor-renderer') classEditorRenderer = true;

  @Input() format: 'html' | 'text' = 'html';
  @Input() renderCustomBlot: (customOp: DeltaInsertOp, contextOp: DeltaInsertOp) => string;

  @Input() public content;

  constructor(private el: ElementRef) {}

  public ngOnInit() { }

  public ngOnChanges(change: SimpleChanges) {

    if (change.content) {
      const config = {
        multiLineParagraph: false,
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
      }

      const converter = new QuillDeltaToHtmlConverter(this.content || {}, config);

      if (this.renderCustomBlot) {
        converter.renderCustomWith((op, contextOp) => {
          return this.renderCustomBlot(op, contextOp);
        });
      }

      const rendered = converter.convert();

      if (this.format === 'html') {
        this.el.nativeElement.innerHTML = rendered;

      } else if (this.format === 'text') {
        const div = document.createElement('div');
        div.innerHTML = rendered;
        this.el.nativeElement.innerHTML = div.textContent || div.innerText || '';
      }
    }
  }
}
