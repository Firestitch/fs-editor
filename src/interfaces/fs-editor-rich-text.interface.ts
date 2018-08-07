import { QuillOptionsStatic } from 'quill';


export interface FsEditorRichTextOptions extends QuillOptionsStatic {
  image?: FsEditorImageUploadInterface;
  modules?,
  theme?,
  change?: Function
}

export interface FsEditorImageUploadInterface {
  upload?: Function;
}
