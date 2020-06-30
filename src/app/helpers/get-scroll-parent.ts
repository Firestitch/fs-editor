export function getScrollParent(node: HTMLElement | null): HTMLElement {
  if (!node) {
    return document.documentElement;
  }

  const overflowY =
    (node instanceof HTMLElement && window.getComputedStyle(node).overflowY) ||
    '';
  const isScrollable = !(
    overflowY.includes('hidden') || overflowY.includes('visible')
  );

  if (isScrollable && node.scrollHeight >= node.clientHeight) {
    return node;
  }

  return getScrollParent(node.parentNode as HTMLElement | null);
}
