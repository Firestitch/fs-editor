import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { FsEditorRichTextModule, FsEditorRendererModule } from '@firestitch/editor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './material.module';
import { FsExampleModule } from '@firestitch/example';
import {  ExampleComponent,
          ExamplesComponent,
          MinimalComponent } from './components';
import { FsApiModule } from '@firestitch/api';


const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    BrowserModule,
    FsEditorRichTextModule.forRoot(),
    FsEditorRendererModule.forRoot(),
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsExampleModule,
    RouterModule.forRoot(routes),
    FsApiModule.forRoot(),
  ],
  entryComponents: [
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    ExampleComponent,
    MinimalComponent
  ],
  providers: [
  ],
})
export class PlaygroundModule {
}
