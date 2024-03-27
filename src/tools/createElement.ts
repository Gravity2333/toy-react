import { IElement, TEXT_ELEMENT } from "./typings.ts";

function createTextElement(text: string): IElement {
  return {
    type: TEXT_ELEMENT,
    props: {
      nodeValue: text,
    },
  };
}

/** createElement函数用来包装元素 */
function createElement(
  type: any,
  props: Record<string, any> = {},
  children: (IElement | string)[] = []
): IElement {
  return {
    type,
    props: {
      ...props,
      /** 处理children
       * 注意：children可以是字符串，也可以是element节点
       */
      children: children.map((child) => {
        if (typeof child === "object") {
          return child;
        } else {
          return createTextElement(child);
        }
      }),
    },
  };
}

export default createElement;
