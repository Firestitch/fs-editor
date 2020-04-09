var Quill: any = undefined;
declare var require: any;
Quill = require('quill');

const Break = Quill.import('blots/break');
const Embed = Quill.import('blots/embed');

export class SmartBreak extends Break {

  length() {
    return 1;
  }
  value() {
    return '\n';
  }

  insertInto(parent, ref) {
    Embed.prototype.insertInto.call(this, parent, ref);
  }
}

SmartBreak.blotName = 'break';
SmartBreak.tagName = 'BR';
