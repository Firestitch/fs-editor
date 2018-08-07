import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FsEditorRendererComponent } from './components/fs-editor-renderer';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    FsEditorRendererComponent,
  ],
  entryComponents: [
  ],
  declarations: [
    FsEditorRendererComponent,
  ]
})
export class FsEditorRendererModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsEditorRendererModule
    };
  }
}
