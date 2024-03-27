import { polyfillRequestIdleCallBack } from "./polyfill.ts";
import {
  TEXT_ELEMENT,
  IElement,
  IFiberNode,
  EffectTag,
  MemorizedState,
  Updates,
} from "./typings.ts";

// 定义一个工作指针,指向下一个工作单元
let nextUnitOfWork: IFiberNode | undefined;
// 当前正在处理的根节点
let wipRoot: IFiberNode | undefined;
// 当前的FiberTree
let currentFiberTree: IFiberNode | undefined;
// 定义需要删除的Fiber节点list
let delection: IFiberNode[] = [];
// 是否第一次加载
let isMount = true;
let reRender: any;

// polyfill requestIdleCallback
polyfillRequestIdleCallBack();

// requestIdleCallback 工作流函数 [scheduler]
function workLoop(deadline: IdleDeadline) {
  while (deadline.timeRemaining() > 0 && nextUnitOfWork) {
    // 深度优先搜索，每次处理一个节点
    // 1. 创建dom节点 2.创建子节点的fiber 3.返回下一个处理节点
    nextUnitOfWork = performUnitOfWork();
  }
  if (!nextUnitOfWork && wipRoot) {
    // fiber树生成之后，提交生成dom
    commit();
    isMount =false
  }

  window.requestIdleCallback(workLoop);
}

// 根据IElement对象创建真实dom
function createDom(element: IElement) {
  const dom =
    element.type === TEXT_ELEMENT
      ? document.createTextNode("")
      : document.createElement(element.type as any);

  // 添加props
  updateDomProps(dom, {}, element?.props);
  return dom;
}

// 判断是否为事件 "onXXX"
const isEvent = (key: string) => key.startsWith("on");
// 排除children和event之后的props属性
const isProperty = (key) => key !== "children" && !isEvent(key);
// 找到删除的属性
const isGone = (newProps: Record<string, any>) => (key) => !(key in newProps);
// 找到变化（新增）的属性
const isChange =
  (prevProps: Record<string, any>, newProps: Record<string, any>) => (key) =>
    prevProps[key] !== newProps[key];

// 更新DOM节点的Props
function updateDomProps(
  dom: HTMLElement | Text,
  prevProps: Record<string, any>,
  nextProps: Record<string, any>
) {
  // 将旧节点中新增和删除的时间从旧的dom中注销
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(
      (key) => isGone(nextProps)(key) || isChange(prevProps, nextProps)(key)
    )
    .forEach((e) => {
      const eventType = e.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[e]);
    });
  // 将新节点中改变的属性重新注册
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isChange(prevProps, nextProps))
    .forEach((e) => {
      const eventType = e.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[e]);
    });

  // 处理新节点中删除的属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(nextProps))
    .forEach((key) => {
      dom[key] = "";
    });
  // 处理新节点中修改/新增的属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isChange(prevProps, nextProps))
    .forEach((key) => {
      dom[key] = nextProps[key];
    });
}

// 根据Fiber节点挂载节点
function mountDom(wipFiber: IFiberNode | undefined) {
  if (!wipFiber) {
    return;
  }

  if (wipFiber?.dom && wipFiber !== wipRoot) {
    let returnFiber = wipFiber.returns;
    while (!returnFiber?.dom) {
      // 如果没有dom节点 为函数组件 则找到其returns作为parents
      returnFiber = returnFiber?.returns;
    }

    /** 如果有父节点，则挂载 */
    if (returnFiber && returnFiber?.dom) {
      /** 处理节点挂载 */
      switch (wipFiber.effectTag) {
        case EffectTag.UPDATE:
          updateDomProps(
            wipFiber.dom,
            wipFiber?.alternate?.props || {},
            wipFiber?.props || {}
          );
          break;
        case EffectTag.PLACEMENT:
          returnFiber?.dom?.appendChild(wipFiber?.dom);
          break;
        default:
          break;
      }
    }
  }

  // /** 递归挂载子节点和兄弟节点 （深度优先遍历） */
  mountDom(wipFiber.child);
  mountDom(wipFiber.sibling);
}

// 提交dom更改
function commit() {
  // 先删除需要删除的节点
  delection.forEach((fiberNode) => {
    const parentFiberNode = fiberNode.returns;
    if (parentFiberNode) {
      parentFiberNode?.dom?.removeChild(fiberNode?.dom);
    }
  });
  mountDom(wipRoot);
  // 更新最新的FiberTree
  currentFiberTree = wipRoot;
  wipRoot = undefined;
}

// 调和子节点
function reconcileChildren(wipFiber: IFiberNode, elements: IElement[]) {
  // 找到旧fiber树的第一个子节点
  let oldChild = wipFiber?.alternate?.child;
  // elements索引
  let index: number = 0;
  // 记录之前的FiberNode,用来连接sibling
  let previousFiberNode: IFiberNode | undefined = undefined;

  while (index < elements?.length || !!oldChild) {
    // 当前要创建Fiber的Element对象
    const childElement = elements[index];
    // 新的Fiber节点
    let newFiber: IFiberNode | undefined;
    // 判断三种情况
    // 1. 如果element和老fiber节点类型一样，则重复使用dom节点
    const reusable =
      childElement && oldChild && childElement.type === oldChild.type;
    if (reusable) {
      newFiber = {
        type: childElement.type,
        key: childElement.key,
        props: childElement.props,
        memorizedState: oldChild?.memorizedState,
        returns: wipFiber,
        dom: oldChild?.dom!,
        effectTag: EffectTag.UPDATE,
        alternate: oldChild,
      };
    }
    // 2. 如果不可复用，并且存在当前element节点，则新增
    if (!reusable && childElement) {
      newFiber = {
        type: childElement.type,
        key: childElement.key,
        props: childElement.props,
        returns: wipFiber,
        effectTag: EffectTag.PLACEMENT,
        alternate: undefined,
      } as IFiberNode;
    }

    // 3.如果不可复用，并且存在旧节点，则删除旧节点
    if (!reusable && oldChild) {
      oldChild.effectTag = EffectTag.DELECTION;
      // 加入待删除列表
      delection.push(oldChild);
    }

    // 挂载newFiber
    if (index === 0) {
      // 连接child
      wipFiber.child = newFiber;
    } else {
      // 连接sibling
      if (previousFiberNode) {
        //这一步是为了处理删除多余的oldChold节点
        previousFiberNode.sibling = newFiber;
      }
    }
    previousFiberNode = newFiber;
    // 更新index和oldChild
    index++;
    if (oldChild) {
      oldChild = oldChild.sibling;
    }
  }
}

function updateHostComponent() {
  // 创建当前节点的真实DOM
  if (!nextUnitOfWork?.dom) {
    nextUnitOfWork!.dom = createDom(nextUnitOfWork!);
  }
  // 根据子节点的element节点，生成Fiber节点
  const elements = nextUnitOfWork?.props?.children || [];
  reconcileChildren(nextUnitOfWork!, elements);
}

function debounce(func, delay) {
  let timeObj: any = null
  return function (...args) {
      timeObj = setTimeout(() => {
          func(...args)
      }, delay);
  }
}
const debouncedSchedule = debounce(()=>{
  reRender()
},500)


function dispatchAction(hook: MemorizedState, action: any) {
  let update: Updates;
  if (typeof action === "function") {
    update = {
      action: action,
      next: null,
    };
  } else {
    update = {
      action: () => action,
      next: null,
    };
  }

  // 创建环形链表
  if (!hook.queue.pending) {
    hook.queue.pending = update.next = update;
  } else {
    update.next = hook.queue.pending.next;
    hook.queue.pending = hook.queue.pending.next = update;
  }

  reRender()
}


let wipHook: MemorizedState | null = null;
export function useState<T>(initialState: T) {
  // 拿到hook
  let hook;
  if(!nextUnitOfWork?.memorizedState){
    nextUnitOfWork!.memorizedState = nextUnitOfWork?.alternate?.memorizedState
  }
  if (isMount) {
    // 第一次加载
    hook = {
      memorizedState: initialState,
      queue: { pending: null },
      next: null,
    } as MemorizedState;
    if (!  nextUnitOfWork?.memorizedState) {
      wipHook = nextUnitOfWork!.memorizedState = hook;
    } else {
      wipHook = wipHook!.next = hook;
    }
  } else {
    if(!wipHook){
      wipHook = nextUnitOfWork?.memorizedState as any;
    }
    // 更新
    hook =  wipHook
    wipHook = hook.next;
  }

  let baseState: T = hook.memorizedState;
  // 开始计算新值
  if (hook.queue.pending) {
    let wipUpdates: Updates = hook.queue.pending.next; // 从环形链表中找到第一个
    do {
      baseState = wipUpdates.action(baseState);
      wipUpdates = wipUpdates.next!;
    } while (wipUpdates !== hook.queue.pending.next);
    hook.memorizedState = baseState;
    hook.queue.pending = null;
  }
  return [baseState, dispatchAction.bind(null, hook)];
}

function updateFunctionComponent() {
  if (nextUnitOfWork) {
    nextUnitOfWork.memorizedState = null;
  }
  wipHook = null
  const elements = [(nextUnitOfWork!.type as Function)(nextUnitOfWork?.props)];
  reconcileChildren(nextUnitOfWork!, elements);
}

// 执行任务单元
function performUnitOfWork() {
  if (!nextUnitOfWork) {
    return undefined;
  }

  const isFunctionComponent = typeof nextUnitOfWork.type === "function";
  if (isFunctionComponent) {
    // 处理函数组件
    updateFunctionComponent();
  } else {
    updateHostComponent();
  }

  // 返回下一个要创建的单元
  if (nextUnitOfWork?.child) {
    // 如果有子节点，则返回子节点为nextUnitOfWork
    return nextUnitOfWork?.child;
  }
  // 没有子节点，找当前节点的兄弟节点
  let nextFiber: IFiberNode | undefined = nextUnitOfWork;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    //如果没有兄弟节点，找父节点
    nextFiber = nextFiber?.returns;
  }
}



function render(element: IElement, container: HTMLElement | Text) {
  reRender = render.bind(null,element,container)
  // 创建根fiber对象，并且生成根节点
  wipRoot = nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
    /** 旧的fiberTree，初始为空 */
    alternate: currentFiberTree,
  };
  // 待删除列表置空
  delection = [];
}


// 开启调度
window.requestIdleCallback(workLoop);
export default render;
