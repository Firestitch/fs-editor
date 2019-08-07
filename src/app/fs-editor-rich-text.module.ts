import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FsEditorRichTextComponent } from './components/fs-editor-rich-text/fs-editor-rich-text.component';
import { FS_EDITOR_RICH_TEXT_CONFIG } from './fs-editor-rich-text.providers';
import { FsEditorRichTextOptions } from './interfaces/fs-editor-rich-text.interface';
import { FsPromptModule } from '@firestitch/prompt';


@NgModule({
  imports: [
    CommonModule,
    FsPromptModule
  ],
  exports: [
    FsEditorRichTextComponent,
  ],
  entryComponents: [
  ],
  declarations: [
    FsEditorRichTextComponent,
  ]
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
