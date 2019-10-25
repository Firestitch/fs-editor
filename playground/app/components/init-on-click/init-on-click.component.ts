import { Component, ViewChild } from '@angular/core';
import { FsEditorRichTextOptions, FsEditorRendererComponent, FsEditorRichTextComponent } from '@firestitch/editor';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'init-on-click',
  templateUrl: 'init-on-click.component.html'
})
export class InitOnClickComponent {

  @ViewChild('editor') editor: FsEditorRichTextComponent;

  public model = [];
  public options: FsEditorRichTextOptions = {
    initOnClick: true,
    placeholder: 'Add Content...',
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

  public initialize() {
    this.editor.initalize();
  }

  public destroy() {
    this.editor.destroy();
  }
}
