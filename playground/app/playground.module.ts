import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FsExampleModule } from '@firestitch/example';

import { FsEditorRendererModule, FsEditorRichTextModule } from '@firestitch/editor';
import { FsApiModule } from '@firestitch/api';
import { FsMessageModule } from '@firestitch/message';
import { FsFormModule } from '@firestitch/form';

import { ToastrModule } from 'ngx-toastr';

import { ExampleComponent, ExamplesComponent, MinimalComponent } from './components';
import { AppMaterialModule } from './material.module';
import { InitOnClickComponent } from './components/init-on-click';


const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    FsEditorRichTextModule.forRoot(),
    FsEditorRendererModule.forRoot(),
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsExampleModule.forRoot(),
    FsFormModule.forRoot(),
    FsMessageModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }),
    RouterModule.forRoot(routes),
    FsApiModule.forRoot(),
  ],
  entryComponents: [],
  declarations: [
    AppComponent,
    ExamplesComponent,
    ExampleComponent,
    MinimalComponent,
    InitOnClickComponent
  ],
  providers: [],
})
export class PlaygroundModule {
}
