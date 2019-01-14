import Quill from 'quill';

import Parchment from 'parchment';
import { Observable } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
const BlockEmbed = Quill.import('blots/block/embed') as typeof Parchment.Embed;

function watchAndUpdate(node: Node, value: Observable<any>) {
  const progress = document.createElement('div');
  progress.classList.add('progress');
  progress.innerText = 'Uploading: 0%';

  value.subscribe({
    next: (event) => {
      if (event.type === HttpEventType.Sent) {
        node.appendChild(progress);
      }

      if (event.type === HttpEventType.UploadProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);

        progress.textContent = `Uploading: ${percent}%`;
      }
    },
    complete: () => {
      node.removeChild(progress);
    }
  })
}

export class ImageLoading extends BlockEmbed {
  static create(value) {
    const node = super.create(Parchment.Scope.INLINE) as any;
    watchAndUpdate(node, value);
    return node;
  }

  static formats(node) {
    // We will only be called with a node already
    // determined to be a Link blot, so we do
    // not need to check ourselves
    return node.getAttribute('href');
  }

  constructor(domNode: Node) {
    super(domNode);
  }
}

ImageLoading.blotName = 'image-loader';
ImageLoading.tagName = 'div';
ImageLoading.className = 'uploading';
