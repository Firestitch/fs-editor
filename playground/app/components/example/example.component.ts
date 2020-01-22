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
  public model = [ { insert: 'Default' } ];
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
