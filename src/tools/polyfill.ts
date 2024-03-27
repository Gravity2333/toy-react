import { v4 as uuidv4 } from 'uuid';

function getFunctionStore(): [
  getFunction: (key: string) => IdleRequestCallback,
  addFunction: (key: string, func: any) => any,
  clearStore: () => void,
] {
  let functionStore: Record<string, IdleRequestCallback> = {};
  function getFunction(key: string) {
    const f = functionStore[key];
    delete functionStore[key];
    return f;
  }
  function addFunction(key: string, func: any) {
    return (functionStore[key] = func);
  }
  function clearStore() {
    functionStore = {};
  }
  return [getFunction, addFunction, clearStore];
}

/**
 * 使用monkey patch的方式polyfill requestIdleCallback
 * 旧版本浏览器中可能不兼容次方法，为了保证正常使用，这里给window提供一个requestIdleCallback方法
 * 支持情况见: https://caniuse.com/?search=requestIdleCallback
 */
export function polyfillRequestIdleCallBack() {
  if (!window.requestIdleCallback) {
    const messageChannel = new MessageChannel();
    const port1 = messageChannel.port1;
    const port2 = messageChannel.port2;
    port2.onmessage = performWorkUntilDeadline;
    const [getFunction, addFunction, clearStore] = getFunctionStore();

    function performWorkUntilDeadline({
      data: { frameEnd, id },
    }: {
      data: { frameEnd: number; id: string };
    }) {
      const timeRemaining = () => frameEnd - performance.now();
      const remainingTime = timeRemaining();
      const cb = getFunction(id);
      if (cb) {
        cb({
          timeRemaining,
          didTimeout: remainingTime <= 0,
        });
      }
    }
    // patch覆盖requestIdleCallback
    window.requestIdleCallback = ((callback: IdleRequestCallback) => {
      return requestAnimationFrame((DomHighResTimeStamp) => {
        const id = uuidv4();
        addFunction(id, callback);
        port1.postMessage({
          frameEnd: DomHighResTimeStamp + 16.7,
          id,
        });
      });
    }) as any;
    // patch 覆盖cancelIdleCallback
    window.cancelIdleCallback = function (id: number) {
      clearStore();
      window.cancelAnimationFrame(id);
    };
  }
}
