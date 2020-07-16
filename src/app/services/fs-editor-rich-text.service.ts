import { ElementRef, Inject, Injectable, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { cloneDeep, remove } from 'lodash-es';

import { FsPrompt } from '@firestitch/prompt';

import { FsEditorRichTextOptions } from '../interfaces/fs-editor-rich-text.interface';
import { FS_EDITOR_RICH_TEXT_CONFIG, FS_EDITOR_DEBUG_LEVEL } from '../fs-editor-rich-text.providers';
import { ClipboardPaste } from '../classes/clipboard-paste';
import { DEFAULT_TOOLBAR_CONFIG } from '../consts/default-toolbar-config';
import VideoBlot from '../blots/video.blot'
import DividerBlot from '../blots/divider.blot';
import { getScrollParent } from '../helpers/get-scroll-parent';

import Quill from 'quill';


@Injectable()
export class FsEditorRichTextService implements OnDestroy {

  public quill: Quill;
  public initialized = false;

  private _editorOptions: FsEditorRichTextOptions;
  private _targetElement: ElementRef;
  private _clipboard: ClipboardPaste;
  private _destroy$ = new Subject<void>();

  constructor(@Inject(FS_EDITOR_RICH_TEXT_CONFIG) private _defaultEditorOptions,
              @Inject(FS_EDITOR_DEBUG_LEVEL) private _debugLevel,
              private _prompt: FsPrompt) {
    Quill.debug(this._debugLevel);
    this._editorOptions = cloneDeep(this._defaultEditorOptions);
  }

  public setOptions(options: FsEditorRichTextOptions = {}) {
    this._editorOptions = Object.assign(this._editorOptions, options);

    // Default options
    if (!this._editorOptions.modules) {
      this._editorOptions.modules = {};
    }

    this._editorOptions.modules.toolbar = {
      container: DEFAULT_TOOLBAR_CONFIG,
      handlers: {},
      ...this._editorOptions.modules.toolbar
    };

    if (!this._editorOptions.theme) {
      this._editorOptions.theme = 'snow';
    }
  }

  public setTargetElement(el: ElementRef) {
    this._targetElement = el;
    this._editorOptions.bounds = this._targetElement.nativeElement;
  }

  public initEditor() {

    this._initIcons();
    this._initImage();

    const modules = this._editorOptions.modules;

    if (!modules.keyboard) {
      modules.keyboard = {};
    }

    if (!modules.keyboard.bindings) {
      modules.keyboard.bindings = {};
    }

    // Used for capture shift + tab to prevent scrolling to top
    modules.keyboard.bindings.shiftTab = {
      key: 'tab',
      shiftKey: true,
      handler: (range, context) => {
        return false;
      }
    };

    Object.keys(modules).forEach(name => {
      if (modules[name].register) {
        Quill.register(`modules/${name}`, modules[name].register);
      }
    });

    this._editorOptions.modules = modules;

    this._initDivider();

    this.quill = new Quill(this.element, this._editorOptions);

    if (this._editorOptions.image && this._editorOptions.image.upload) {
      this._addToolbarHandler('image', () => {
        this._selectImage();
      });
    }

    this._initLink();
    this._initVideo();
    this._initClipboard();
    this._initBottomLine();
    this._updateScrollContainer();

    this.initialized = true;
  }

  public get element() {
    return this._targetElement.nativeElement;
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

        this.quill.insertEmbed(index, 'image', url, 'user');
      });
  }

  private _initBottomLine() {
    const newNode = document.createElement('div');
    newNode.className = 'bottom-line';
    (this.quill as any).container.appendChild(newNode);
  }

  private _initIcons() {
    const icons = (Quill as any).imports['ui/icons'];

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
    icons['divider'] = '<i class="material-icons">remove</i>';
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
    this._addToolbarHandler('link', (value) => {

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

          this.quill.insertText(selection.index || 0, text || url, 'link', url, 'user');
        }
      });
    });
  }

  private _addToolbarHandler(name, func) {
    this.quill.getModule('toolbar')
      .addHandler(name, func);
  }

  private _initDivider() {
    Quill.register(DividerBlot);

    this._editorOptions.modules.toolbar.handlers = {
      divider: () => {
        const index = this.quill.getSelection().index || 0;
        this.quill.insertEmbed(index, 'divider', '', (Quill as any).sources.USER);
        this.quill.setSelection(index + 2, 0, (Quill as any).sources.SILENT);
      }
    }
  }

  private _initVideo() {
    Quill.register(VideoBlot);

    this._addToolbarHandler('video', () => {
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
          this.quill.insertEmbed(index, 'video', url, 'user');
        }
      });
    });
  }

  // fix for scroll jumps when toolbar option clicked (in scope of S-T1086)
  private _updateScrollContainer() {
    setTimeout(() => {
      (this.quill as any).scrollingContainer = getScrollParent(this._targetElement.nativeElement);
    });
  }
}
