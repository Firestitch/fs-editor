import { ElementRef, Inject, Injectable } from '@angular/core';
import * as _cloneDeep from 'lodash/cloneDeep';
import { FsEditorRichTextOptions } from '../interfaces';
import { FS_EDITOR_RICH_TEXT_CONFIG } from '../fs-editor-rich-text.providers';

declare var require: any;
var Quill: any = undefined;

@Injectable()
export class FsEditorRichTextService {

  public editor: any;

  private _editorOptions: FsEditorRichTextOptions;
  private _targetElement: ElementRef;

  constructor(@Inject(FS_EDITOR_RICH_TEXT_CONFIG) private _defaultEditorOptions) {
    this._editorOptions = _cloneDeep(this._defaultEditorOptions);
  }

  public setOptions(options: FsEditorRichTextOptions = {}) {
    this._editorOptions = Object.assign(this._editorOptions, options);
  }

  public setTargetElement(el: ElementRef) {
    this._targetElement = el;
  }

  public initEditor() {
    if (!Quill) {
      Quill = require('quill');
    }

    this.editor = new Quill(this._targetElement.nativeElement, this._editorOptions);

    if (this._editorOptions.image && this._editorOptions.image.upload) {
      this.editor.getModule('toolbar').addHandler('image', () => {
        this.selectImage();
      });
    }
  }

  public subscribe() {
  }

  private selectImage() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();

    // Listen upload local image and save to server
    input.onchange = () => {
      const file = input.files[0];

      // file type is only image.
      if (/^image\//.test(file.type)) {
        this._editorOptions.image.upload(file, (url: string) => {
         this.insertToEditor(url);
        });
        // saveToServer(file); // TODO callback t
      } else {
        console.warn('You could only upload images.');
      }
    };
  }

  private insertToEditor(url) {
    console.log('insert', this.editor);
    const range = this.editor.getSelection();
    this.editor.insertEmbed(range.index, 'image', url);
  }
}
