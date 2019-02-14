import { Component } from '@angular/core';
import { FsEditorRichTextOptions } from '@firestitch/editor';
import { map } from 'rxjs/operators';
import { FsApi } from '@firestitch/api';


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
    change: (data) => {}
  };

  constructor(private _fsApi: FsApi) {

  }

  public set() {
    this.model = [ { insert: 'Hello World!\n' } ];
  }
}
