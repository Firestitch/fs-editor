import { ElementRef, Inject, Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { delay, filter, share, takeUntil } from 'rxjs/operators';
import cloneDeep from 'lodash/cloneDeep';
import { FsEditorRichTextOptions } from '../interfaces/fs-editor-rich-text.interface';
import { FS_EDITOR_RICH_TEXT_CONFIG } from '../fs-editor-rich-text.providers';
import { ClipboardPaste } from '../classes/clipboard-paste';
import { Test } from '../classes/test';
import Parchment from 'parchment';
import {ImageLoading} from '../classes/image-loading';


declare var require: any;
var Quill: any = undefined;

@Injectable()
export class FsEditorRichTextService implements OnDestroy {

  public editor: any;

  private _editorOptions: FsEditorRichTextOptions;
  private _targetElement: ElementRef;
  private _clipboard: ClipboardPaste;
  private _destroy$ = new Subject<void>();


  constructor(@Inject(FS_EDITOR_RICH_TEXT_CONFIG) private _defaultEditorOptions) {
    this._editorOptions = cloneDeep(this._defaultEditorOptions);
  }

  public ngOnDestroy(): void {
    this._clipboard.destroy();
    this._destroy$.next();
    this._destroy$.complete();
  }

  public setOptions(options: FsEditorRichTextOptions = {}) {
    this._editorOptions = Object.assign(this._editorOptions, options);

    // Default options
    if (!this._editorOptions.modules
      || (this._editorOptions.modules && !this._editorOptions.modules.toolbar)
    ) {

      if (!this._editorOptions.modules) {
        this._editorOptions.modules = {};
      }

      this._editorOptions.modules.toolbar = DEFAULT_TOOLBAR_OPTIONS;
    }

    if (!this._editorOptions.theme) {
      this._editorOptions.theme = 'snow';
    }
  }

  public setTargetElement(el: ElementRef) {
    this._targetElement = el;
  }

  public initEditor() {
    if (!Quill) {
      Quill = require('quill');
    }

    this.setupIcons();

    // Pfff
    Quill.register(Test);
    Quill.register(ImageLoading);
    ///

    this.editor = new Quill(this._targetElement.nativeElement, this._editorOptions);

    ////
    // const toolbar = this.editor.getModule('toolbar');
    // toolbar.attach(toolbar.container.querySelector('button.ql-videos'));
    ///

    if (this._editorOptions.image && this._editorOptions.image.upload) {
      this.editor.getModule('toolbar').addHandler('image', () => {
        this.selectImage();
      });
    }

    this.initClipboard();

    this.editor.getModule('toolbar').addHandler('videos', (e) => {
      const range = this.editor.getSelection(true);
      this.editor.insertText(range.index, '\n', Quill.sources.USER);
      const d = this.editor.insertEmbed(range.index + 1, 'image-loader', '123', Quill.sources.USER);
      this.editor.setSelection(range.index + 2, Quill.sources.SILENT);
      // this.editor.updateContents(d.delete(d.length()))
      // d.delete(d.length());
      console.log('handle???', d, e);
    });
  }

  public subscribe() {}

  private initClipboard() {
    this._clipboard = new ClipboardPaste(this._targetElement.nativeElement);
    this._clipboard.subscribe();

    this._clipboard.imagePasted$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((file: Blob) => {
        this.uploadToServer(file);
      });
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
        this.uploadToServer(file);
        // saveToServer(file); // TODO callback t
      } else {
        console.warn('You could only upload images.');
      }
    };
  }

  private uploadToServer(file) {
    const upload = this._editorOptions.image.upload(file)
      .pipe(
        share(),
        takeUntil(this._destroy$),
      );

    const range = this.editor.getSelection(true);
    this.editor.insertText(range.index, '\n', Quill.sources.USER);
    const d = this.editor.insertEmbed(range.index + 1, 'image-loader', upload, Quill.sources.USER);
    this.editor.setSelection(range.index + 2, Quill.sources.SILENT);

    upload
      .pipe(
        filter((response: any) => response.type === void 0),
      )
      .subscribe((url) => {

        this.insertToEditor(url);
      });
  }
  private insertToEditor(url) {
    const range = this.editor.getSelection();
    this.editor.insertEmbed(range.index, 'image', url);
  }

  private setupIcons() {
    const icons = Quill.import('ui/icons');

    icons['bold'] = '<i class="material-icons">format_bold</i>';
    icons['italic'] = '<i class="material-icons">format_italic</i>';
    icons['underline'] = '<i class="material-icons">format_underlined</i>';
    icons['strike'] = '<i class="material-icons">strikethrough_s</i>';
    icons['color'] = '<i class="material-icons">format_color_text</i>';
    icons['background'] = '<i class="material-icons">format_color_fill</i>';
    icons['list']['ordered'] = '<i class="material-icons">format_list_numbered</i>';
    icons['list']['bullet'] = '<i class="material-icons">list</i>';
    icons['indent']['+1'] = '<i class="material-icons">format_indent_increase</i>';
    icons['indent']['-1'] = '<i class="material-icons">format_indent_decrease</i>';
    icons['video'] = '<i class="material-icons">local_movies</i>';
    icons['align'][''] = '<i class="material-icons">format_align_left</i>';
    icons['align']['center'] = '<i class="material-icons">format_align_center</i>';
    icons['align']['justify'] = '<i class="material-icons">format_align_justify</i>';
    icons['align']['right'] = '<i class="material-icons">format_align_right</i>';
    icons['link'] = '<i class="material-icons">insert_link</i>';
    icons['image'] = '<i class="material-icons">insert_photo</i>';
    icons['blockquote'] = '<i class="material-icons">format_quote</i>';
    icons['code-block'] = '<i class="material-icons">code</i>';
    icons['blockquote'] = '<i class="material-icons">format_quote</i>';
  }
}

const DEFAULT_TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  [
    'bold',
    'italic',
    'underline',
    'strike',
  ],
  [
    {color: []},
    {background: []},
  ],
  [
    'blockquote',
    'code-block',
  ],
  [
    { list: 'ordered' },
    { list: 'bullet' },
    { indent: '-1' },
    { indent: '+1' },
  ],
  [
    { align: [] }
  ],
  [
    'link',
    'image',
    'video',
    'videos',
  ]
];
