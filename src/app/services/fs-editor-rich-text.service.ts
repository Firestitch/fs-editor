import { ElementRef, Inject, Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { cloneDeep, remove } from 'lodash-es';
import { FsEditorRichTextOptions } from '../interfaces/fs-editor-rich-text.interface';
import { FS_EDITOR_RICH_TEXT_CONFIG } from '../fs-editor-rich-text.providers';
import { ClipboardPaste } from '../classes/clipboard-paste';
import { DEFAULT_TOOLBAR_CONFIG } from '../consts/default-toolbar-config';
import { FsPrompt } from '@firestitch/prompt';

declare var require: any;
var Quill: any = undefined;

@Injectable()
export class FsEditorRichTextService implements OnDestroy {

  public editor: any;

  private _editorOptions: FsEditorRichTextOptions;
  private _targetElement: ElementRef;
  private _clipboard: ClipboardPaste;
  private _destroy$ = new Subject<void>();


  constructor(@Inject(FS_EDITOR_RICH_TEXT_CONFIG) private _defaultEditorOptions,
              private _prompt: FsPrompt) {
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
    if (!this._editorOptions.modules) {
      this._editorOptions.modules = {};
    }

    if (!this._editorOptions.modules.toolbar) {
      this._editorOptions.modules.toolbar = DEFAULT_TOOLBAR_CONFIG;
    }

    if (!this._editorOptions.modules.toolbar.handlers) {
      this._editorOptions.modules.toolbar.handlers = {};
    }

    if (!this._editorOptions.theme) {
      this._editorOptions.theme = 'snow';
    }
  }

  public setTargetElement(el: ElementRef) {
    this._targetElement = el;

    // For correct position tooltip and other popup elements from editor
    this._editorOptions.bounds = this._targetElement.nativeElement;
    this._editorOptions.scrollingContainer = this._targetElement.nativeElement;
  }

  public initEditor() {
    if (!Quill) {
      Quill = require('quill');
    }

    this.setupIcons();

    if (!this._editorOptions.image) {
      this._editorOptions.modules.toolbar = this._editorOptions.modules.toolbar.filter(item => {
        if (item !== 'image') {

          remove(item, (i) => {
            return i === 'image';
          });

          if (item.length) {
            return true;
          }
        }
      });
    }

    this.editor = new Quill(this._targetElement.nativeElement, this._editorOptions);

    if (this._editorOptions.image && this._editorOptions.image.upload) {
      this.editor.getModule('toolbar').addHandler('image', () => {
        this.selectImage();
      });
    }

    this.editor.getModule('toolbar').addHandler('link', (value) => {

      const selection = this.editor.getSelection() || {};

      if (!selection.length) {
        return;
      }

      const text = this.editor.getText(selection.index, selection.length);

      this._prompt.input({
        label: 'Please enter a URL',
        title: 'Link',
        commitLabel: 'Save',
        required: true
      })
      .subscribe((url: string) => {

        if (url) {
          if (!url.match(/^http/)) {
            url = 'http://'.concat(url);
          }

          this.editor.deleteText(selection.index, selection.length);
          this.editor.insertText(selection.index, text, 'link', url);
        }
      });
    });

    this.initClipboard();
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
      }
    };
  }

  private uploadToServer(file) {
    this._editorOptions.image.upload(file)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((url) => {
        this.insertImageToEditor(url);
      });
  }

  private insertImageToEditor(url) {
    // const range = this.editor.getSelection();
    const index = (this.editor.getSelection() || {}).index || this.editor.getLength();
    this.editor.insertEmbed(index, 'image', url);
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
