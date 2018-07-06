import { QuillOptionsStatic } from 'quill';


export interface FsEditorRichTextOptions extends QuillOptionsStatic {
  image?: FsEditorImageUploadInterface;
}

export interface FsEditorImageUploadInterface {
  upload?: Function;
}
