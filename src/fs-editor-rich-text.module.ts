import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FsEditorRichTextComponent } from './components/fs-editor-rich-text';
import { FS_EDITOR_RICH_TEXT_CONFIG } from './fs-editor-rich-text.providers';
import { FsEditorRichTextOptions } from './interfaces';
// import { FsComponentService } from './services';
import './styles.scss';


@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    FsEditorRichTextComponent,
  ],
  entryComponents: [
  ],
  declarations: [
    FsEditorRichTextComponent,
  ],
  providers: [
    // FsComponentService,
  ],
})
export class FsEditorRichTextModule {
  static forRoot(config: FsEditorRichTextOptions = {}): ModuleWithProviders {
    return {
      ngModule: FsEditorRichTextModule,
      providers: [
        {
          provide: FS_EDITOR_RICH_TEXT_CONFIG,
          useValue: config || {}
        }
      ]
    };
  }
}
