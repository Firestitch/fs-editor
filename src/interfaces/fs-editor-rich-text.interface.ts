import { QuillOptionsStatic } from 'quill';
import { Observable } from 'rxjs';


export interface FsEditorRichTextOptions extends QuillOptionsStatic {
  image?: FsEditorImageUploadInterface;
  modules?,
  theme?,
  change?: Function
}

export interface FsEditorImageUploadInterface {
  upload?: (file: Blob) => Observable<string>;
}
