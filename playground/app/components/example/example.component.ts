import { Component } from '@angular/core';
import { FsEditorRichTextOptions } from '../../../../src/interfaces';


@Component({
  selector: 'example',
  templateUrl: 'example.component.html'
})
export class ExampleComponent {

  public toolbarOptions = [
    [
      {'font': ['sans-serif']},
      {'size': ['']},
    ],
    [
      'bold',
      'italic',
      'underline',
      'strike',
    ],
    [
      'color',
      'background'
    ],
    [
      'blockquote',
      'code-block',
    ],
    [
      {'list': 'ordered'},
      {'list': 'bullet'},
      {'indent': -1},
      {'indent': +1},
    ],
    [
      'align'
    ],
    [
      'link',
      'image',
      'video',
    ]
  ];


  public options: FsEditorRichTextOptions = {
    modules: {
      toolbar: this.toolbarOptions
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
