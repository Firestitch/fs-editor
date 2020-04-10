import { ElementRef, Inject, Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { cloneDeep, remove } from 'lodash-es';
import { FsEditorRichTextOptions } from '../interfaces/fs-editor-rich-text.interface';
import { FS_EDITOR_RICH_TEXT_CONFIG } from '../fs-editor-rich-text.providers';
import { ClipboardPaste } from '../classes/clipboard-paste';
import { DEFAULT_TOOLBAR_CONFIG } from '../consts/default-toolbar-config';
import { FsPrompt } from '@firestitch/prompt';
import { Quill as quill } from 'quill';
import Video from '../formats/video.format';

declare var require: any;
var Quill: any = undefined;
Quill = require('quill');

@Injectable()
export class FsEditorRichTextService implements OnDestroy {

  public quill: quill;
  public initialized = false;

  private _editorOptions: FsEditorRichTextOptions;
  private _targetElement: ElementRef;
  private _clipboard: ClipboardPaste;
  private _destroy$ = new Subject<void>();

  constructor(@Inject(FS_EDITOR_RICH_TEXT_CONFIG) private _defaultEditorOptions,
              private _prompt: FsPrompt) {
    this._editorOptions = cloneDeep(this._defaultEditorOptions);
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

    //Quill.register(SmartBreak);

    this._initIcons();
    this._initImage();

    const modules = {
      toolbar: this._editorOptions.modules.toolbar,

      keyboard: {
        bindings: {
            // Used for capture shift + tab to prevent scrolling to top
            shiftTab: {
              key: 'tab',
              shiftKey: true,
              handler: (range, context) => {
                return false;
              }
            }

          // enter: {
          //   key: 13,
          //   shiftKey: true,
          //   handler: (range, context) => {

          //     const currentLeaf = this.quill.getLeaf(range.index)[0];
          //     const nextLeaf = this.quill.getLeaf(range.index + 1)[0];
          //     this.quill.insertEmbed(range.index, 'break', true, Quill.sources.USER);
          //     // Insert a second break if:
          //     // At the end of the editor, OR next leaf has a different parent (<p>)
          //     if (nextLeaf === null || currentLeaf.parent !== nextLeaf.parent) {
          //       this.quill.insertEmbed(range.index, 'break', true, Quill.sources.USER);
          //     }
          //     // Now that we've inserted a line break, move the cursor forward
          //     this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
          //   }
          // }
        }
      }
    };

    this._editorOptions.modules = modules;

    this.quill = new Quill(this._targetElement.nativeElement, this._editorOptions);

    if (this._editorOptions.image && this._editorOptions.image.upload) {
      this.quill.getModule('toolbar').addHandler('image', () => {
        this._selectImage();
      });
    }

    this._initLink();
    this._initVideo();
    this._initClipboard();
    this._initBottomLine();

    this.initialized = true;
  }

  public destroy() {
    this.quill = null;
    this.initialized = false;
  }

  public ngOnDestroy(): void {
    if (this._clipboard) {
      this._clipboard.destroy();
    }

    this._destroy$.next();
    this._destroy$.complete();
  }

  private _initClipboard() {
    this._clipboard = new ClipboardPaste(this._targetElement.nativeElement);
    this._clipboard.subscribe();

    this._clipboard.imagePasted$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((file: Blob) => {
        this._uploadToServer(file);
      });
  }

  private _selectImage() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();

    // Listen upload local image and save to server
    input.onchange = () => {
      const file = input.files[0];

      // file type is only image.
      if (/^image\//.test(file.type)) {
        this._uploadToServer(file);
      }
    };
  }

  private _uploadToServer(file) {
    this._editorOptions.image.upload(file)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((url) => {
        let index = this.quill.getLength();
        if (this.quill.getSelection()) {
          index = this.quill.getSelection().index;
        }

        this.quill.insertEmbed(index, 'image', url);
      });
  }

  private _initBottomLine() {
    const newNode = document.createElement('div');
    newNode.className = 'bottom-line';
    (this.quill as any).container.appendChild(newNode);
  }

  private _initIcons() {
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

  private _initImage() {

    if (this._editorOptions.image) {
      return;
    }

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

  private _initLink() {
    this.quill.getModule('toolbar').addHandler('link', (value) => {

      const selection = this.quill.getSelection();

      const text = this.quill.getText(selection.index, selection.length);

      this._prompt.input({
        label: 'Link URL',
        title: 'Create Link',
        commitLabel: 'Create',
        required: true
      })
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((url: string) => {

        if (url) {
          if (!url.match(/^http/)) {
            url = 'http://'.concat(url);
          }

          if (selection.index) {
            this.quill.deleteText(selection.index, selection.length);
          }

          this.quill.insertText(selection.index || 0, text || url, 'link', url);
        }
      });
    });
  }

  private _initVideo() {

    Quill.register(Video);

    this.quill.getModule('toolbar').addHandler('video', (value) => {

      this._prompt.input({
        label: 'YouTube URL',
        title: 'Insert Video',
        commitLabel: 'Insert',
        required: true
      })
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((url: string) => {

        if (url) {
          const index = this.quill.getSelection().index || 0;
          this.quill.insertEmbed(index, 'video', url)
        }
      });
    });
  }


}
