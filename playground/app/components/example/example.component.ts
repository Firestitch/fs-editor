import { Component } from '@angular/core';
import { FsEditorRichTextOptions } from '../../../../src/interfaces';


@Component({
  selector: 'example',
  templateUrl: 'example.component.html'
})
export class ExampleComponent {
  public options: FsEditorRichTextOptions = {
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        ['image', 'code-block']
      ]
    },
    image: {
      upload: (file, cb) => {
        setTimeout(() => {
          cb('https://sun1-5.userapi.com/c543101/v543101664/4e104/qws0SPFDbLo.jpg');
        }, 1000);
      }
    },
    theme: 'snow'
  };

  public model = '';
}
