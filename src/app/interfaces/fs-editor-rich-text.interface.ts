import { QuillOptionsStatic } from 'quill';
import { Observable } from 'rxjs';


export interface FsEditorRichTextOptions extends QuillOptionsStatic {
  image?: FsEditorImageUploadInterface;
  modules?,
  theme?,
  label?: string,
  hint?: string,
  change?: Function,
  initOnClick?: boolean,
  placeholder?: string,
  maxLength?: number,
  keyboard?: any
}

export interface FsEditorImageUploadInterface {
  upload?: (file: Blob) => Observable<string>;
}
