import { QuillOptionsStatic } from 'quill';

import { Observable } from 'rxjs';

import { DeltaInsertOp } from 'quill-delta-to-html';


export interface FsEditorRichTextOptions extends QuillOptionsStatic {
  image?: FsEditorImageUploadInterface;
  modules?;
  theme?;
  label?: string;
  hint?: string;
  change?: Function;
  initOnClick?: boolean;
  placeholder?: string;
  maxLength?: number;
  keyboard?: any;
  handlers?: any;
  autofocus?: boolean;
  renderCustomBlot?: (customOp: DeltaInsertOp, contextOp: DeltaInsertOp) => string;
}

export interface FsEditorImageUploadInterface {
  upload?: (file: Blob) => Observable<string>;
}
