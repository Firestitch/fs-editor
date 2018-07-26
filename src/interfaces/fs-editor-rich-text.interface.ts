import { QuillOptionsStatic } from 'quill';


export interface FsEditorRichTextOptions extends QuillOptionsStatic {
  image?: FsEditorImageUploadInterface;
  modules?,
  theme?
}

export interface FsEditorImageUploadInterface {
  upload?: Function;
}
