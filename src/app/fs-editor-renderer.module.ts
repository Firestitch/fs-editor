import { NgModule, ModuleWithProviders } from '@angular/core';
import { FsEditorRendererComponent } from './components/fs-editor-renderer/fs-editor-renderer.component';

@NgModule({
  exports: [
    FsEditorRendererComponent,
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
