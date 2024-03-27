/** element元素包含
 * type: 节点类型
 * props: 属性
 * key: 唯一的key值
 */
export interface IElement {
  type?: string | Function;
  props: Record<string, any>;
  key?: string;
}

export const TEXT_ELEMENT = "TEXT_ELEMENT";

export enum EffectTag {
  /** 放置节点 */
  "PLACEMENT" = "PLACEMENT",
  /** 更新节点 */
  "UPDATE" = "UPDATE",
  /** 删除节点 */
  "DELECTION" = "DELECTION",
}

export type Updates = {
  action: any;
  next: Updates|null;
};

export type MemorizedState = {
  memorizedState: any;
  queue: {
    pending: Updates | null;
  };
  next: MemorizedState | null;
};

export interface IFiberNode extends IElement {
  dom: HTMLElement | Text;
  props: Record<string, any>;
  returns?: IFiberNode;
  child?: IFiberNode;
  sibling?: IFiberNode;
  alternate?: IFiberNode;
  effectTag?: EffectTag;
  memorizedState?: null | MemorizedState;
}
