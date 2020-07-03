
var Quill: any = undefined;
declare var require: any;
Quill = require('quill');

const BlockEmbed = Quill.import('blots/block/embed');
class DividerBlot extends BlockEmbed { }
DividerBlot.blotName = 'divider';
DividerBlot.tagName = 'hr';

export default DividerBlot;
