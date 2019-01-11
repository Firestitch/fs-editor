import { Component } from '@angular/core';
import { FsEditorRichTextOptions } from '@firestitch/editor';
import { Subject } from 'rxjs/Subject';
import { map } from 'rxjs/operators';


@Component({
  selector: 'minimal',
  templateUrl: 'minimal.component.html'
})
export class MinimalComponent {
  public model = [ { insert: 'Default' } ];
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
    modules: {
      toolbar: [
          [{ header: [1, 2, 3, false] }],
          [
            'bold',
            'italic',
            'underline',
            'strike',
            'blockquote'
          ],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
          ],
          [
            { align: [] }
          ],
          [
            'link',
            'image'
          ]
        ]
    }
  };
}
