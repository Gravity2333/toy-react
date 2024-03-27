import { TEXT_ELEMENT, IElement } from "./typings.ts";

function render(element: IElement, container: HTMLElement | Text) {
  const dom =
    element.type === TEXT_ELEMENT
      ? document.createTextNode("")
      : document.createElement(element.type as any);

  Object.keys(element?.props || {})
    .filter((k) => k !== "children")
    .forEach((key) => {
      dom[key] = element?.props[key];
    });

  (element.props?.children || []).forEach((child) => render(child, dom));

  container.appendChild(dom);
}

export default render
