import Quill from 'quill';

const BlockEmbed = (Quill as any).imports['blots/block/embed'];

class DividerBlot extends BlockEmbed { }
(DividerBlot as any).blotName = 'divider';
(DividerBlot as any).tagName = 'hr';

export default DividerBlot;
