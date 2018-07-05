import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FsEditorRichTextComponent } from './components/fs-component/fs-component.component';
// import { FsComponentService } from './services';

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
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsEditorRichTextModule,
      // providers: [FsComponentService]
    };
  }
}
