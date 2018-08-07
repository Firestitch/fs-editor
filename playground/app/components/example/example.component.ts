import { Component } from '@angular/core';
import { FsEditorRichTextOptions } from '../../../../src/interfaces';
import { Subject } from 'rxjs/Subject';
import { map } from 'rxjs/operators';


@Component({
  selector: 'example',
  templateUrl: 'example.component.html'
})
export class ExampleComponent {
  public model = { ops: [ { insert: 'Default' } ] };
  public html = '';
  public options: FsEditorRichTextOptions = {
    image: {
      upload: (file) => {
        const API = new Subject();

        setTimeout(() => {
          API.next({
            data: {
              url: 'https://sun1-5.userapi.com/c543101/v543101664/4e104/qws0SPFDbLo.jpg'
            }
          });
        }, 1000);

        return API.pipe(
          map((response: any) => {
            return response.data.url;
          })
        );
      }
    },
    change: (data) => {

    }
  };

  public set() {
    this.model = { ops: [ { insert: 'Hello World!\n' } ] };
  }
}
