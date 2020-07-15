import Quill from 'quill';

const BlockEmbed = (Quill as any).imports['blots/block/embed'];
const Link = (Quill as any).imports['formats/link'];

const ATTRIBUTES = ['height', 'width'];

class VideoBlot extends BlockEmbed {
  static create(value) {
    const node = super.create(value);

    const url = `https://www.youtube.com/embed/${this.parse(value)}?rel=0`;

    node.setAttribute('src', this.sanitize(url));
    node.setAttribute('allowfullscreen', 'true');
    node.setAttribute('frameborder', '0');
    node.setAttribute('width', '500');
    node.setAttribute('height', '280');
    return node;
  }

  static formats(domNode) {
    return ATTRIBUTES.reduce((formats, attribute) => {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  static parse(url) {
    let ID = '';
    url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_\-]/i);
      ID = ID[0];
    }
    else {
      ID = url;
    }
      return ID;
  }

  static sanitize(url) {
    return Link.sanitize(url); // eslint-disable-line import/no-named-as-default-member
  }

  static value(domNode) {
    return domNode.getAttribute('src');
  }

  format(name, value) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        (this as any).domNode.setAttribute(name, value);
      } else {
        (this as any).domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }

  html() {
    const { video } = (this as any).value();
    return `<a href="${video}">${video}</a>`;
  }
}

(VideoBlot as any).blotName = 'video';
(VideoBlot as any).className = 'ql-video';
(VideoBlot as any).tagName = 'IFRAME';

export default VideoBlot;
