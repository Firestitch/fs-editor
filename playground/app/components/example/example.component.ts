import { Component } from '@angular/core';
import { FsEditorRichTextOptions } from '@firestitch/editor';
import { map } from 'rxjs/operators';
import { FsApi } from '@firestitch/api';
import { FsMessage } from '@firestitch/message';


@Component({
  selector: 'example',
  templateUrl: 'example.component.html'
})
export class ExampleComponent {
  public model = [ { "insert": "This is 1st level heading" }, { "attributes": { "header": 1 }, "insert": "\n" }, { "insert": "This is a test paragraph.\nThis is 2nd level heading" }, { "attributes": { "header": 2 }, "insert": "\n" }, { "insert": "This is a test paragraph.\nThis is 3rd level heading" }, { "attributes": { "header": 3 }, "insert": "\n" }, { "insert": "This is a test paragraph.\nThis is 4th level heading" }, { "attributes": { "header": 4 }, "insert": "\n" }, { "insert": "This is a test paragraph.\nThis is 5th level heading" }, { "attributes": { "header": 5 }, "insert": "\n" }, { "insert": "This is a test paragraph.\nThis is 6th level heading" }, { "attributes": { "header": 6 }, "insert": "\n" }, { "insert": "This is a test paragraph.\nBlockquote" }, { "attributes": { "header": 1 }, "insert": "\n" }, { "insert": "This is a block quotation containing a single paragraph. Well, not quite, since this is not " }, { "attributes": { "italic": true }, "insert": "really" }, { "insert": " quoted text, but I hope you understand the point. After all, this page does not use HTML markup very normally anyway." }, { "attributes": { "blockquote": true }, "insert": "\n" }, { "insert": "Code" }, { "attributes": { "header": 1 }, "insert": "\n" }, { "insert": "function hello() {" }, { "attributes": { "code-block": true }, "insert": "\n" }, { "insert": " alert(\"Hello\");" }, { "attributes": { "code-block": true }, "insert": "\n" }, { "insert": "}" }, { "attributes": { "code-block": true }, "insert": "\n" }, { "insert": "Lists" }, { "attributes": { "header": 1 }, "insert": "\n" }, { "insert": "This is a paragraph before an " }, { "attributes": { "bold": true }, "insert": "unnumbered" }, { "insert": " list (" }, { "attributes": { "code": true }, "insert": "ul" }, { "insert": "). Note that the spacing between a paragraph and a list before or after that is hard to tune in a user style sheet. You can't guess which paragraphs are logically related to a list, e.g. as a \"list header\".\nOne." }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "insert": "Two." }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "insert": "Three. Well, probably this list item should be longer. Note that for short items lists look better if they are compactly presented, whereas for long items, it would be better to have more vertical spacing between items." }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "insert": "Four. This is the last item in this list. Let us terminate the list now without making any more fuss about it." }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "insert": "\nOne." }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "insert": "Two." }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "insert": "Three. Well, probably this list item should be longer so that it will probably wrap to the next line in rendering." }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "insert": "This is a paragraph before a " }, { "attributes": { "bold": true }, "insert": "numbered" }, { "insert": " list (" }, { "attributes": { "code": true }, "insert": "ol" }, { "insert": "). Note that the spacing between a paragraph and a list before or after that is hard to tune in a user style sheet. You can't guess which paragraphs are logically related to a list, e.g. as a \"list header\"." }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "insert": "One." }, { "attributes": { "indent": 1, "list": "ordered" }, "insert": "\n" }, { "insert": "Two." }, { "attributes": { "indent": 1, "list": "ordered" }, "insert": "\n" }, { "insert": "Three. Well, probably this list item should be longer. Note that if items are short, lists look better if they are compactly presented, whereas for long items, it would be better to have more vertical spacing between items." }, { "attributes": { "indent": 1, "list": "ordered" }, "insert": "\n" }, { "insert": "Four. This is the last item in this list. Let us terminate the list now without making any more fuss about it." }, { "attributes": { "indent": 1, "list": "ordered" }, "insert": "\n" }, { "insert": "Styles" }, { "attributes": { "header": 1 }, "insert": "\n" }, { "attributes": { "bold": true }, "insert": "bolded" }, { "insert": " " }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "attributes": { "underline": true }, "insert": "underlined" }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "attributes": { "italic": true }, "insert": "italic" }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "attributes": { "strike": true }, "insert": "strikethrough" }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "insert": "Colors" }, { "attributes": { "header": 1 }, "insert": "\n" }, { "attributes": { "color": "#66a3e0" }, "insert": "Font Color" }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "attributes": { "background": "#c285ff" }, "insert": "Background Color" }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "insert": "Image" }, { "attributes": { "header": 1 }, "insert": "\n" }, { "insert": { "image": "https://i.picsum.photos/id/485/500/300.jpg" } }, { "attributes": { "header": 1 }, "insert": "\n" }, { "insert": "\n" } ];
  public html = '';
  public options: FsEditorRichTextOptions = {
    image: {
      upload: (file: Blob) => {
        const data = {
          file: file
        };

        return this._fsApi.post('https://boilerplate.firestitch.com/api/dummy/upload', data)
          .pipe(map((response) => response.data.url))
      }
    },
    maxLength: 100,
    placeholder: 'Placeholder Text...',
    change: (data) => {}
  };

  constructor(private _fsApi: FsApi,
              private _message: FsMessage) {}

  public save = () => {
    this._message.success('Saved Changes');
  }

  public set() {
    this.model = [ { insert: 'Hello World!\n' } ];
  }
}
