import Quill from 'quill';

import * as Parchment from 'parchment';
const BlockEmbed = Quill.import('blots/block/embed') as typeof Parchment.default.Embed;

export class Test extends BlockEmbed {
  static create() {
    return null
  }
}

Test.blotName = 'videos';
Test.tagName = 'div';
Test.className = 'videos';
