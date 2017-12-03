const INIT = Symbol('INIT');
const RUNNING = Symbol('RUNNING');
const RUNNING_WITH_PENDING = Symbol('RUNNING_WITH_PENDING');

export class SingletonWorker {
  constructor(name, f, init = true) {
    this.name = name;
    this.cxt = new SingletonContext(init);
    // 任务函数
    this.f = f;
  }

  async start() {
    if (this.cxt.start()) {
      do {
        const r = this.f();
        if (r instanceof Promise) {
          try {
            await r;
          } catch (err) {
            console.error(`SingletonWorker: ${this.name}, ${err}`);
          }
        }
      } while (this.cxt.is_pending());
    }
  }
}

const singletonContexts = {};

export function newSingletonContext(name, ...args) {
  let ctx = singletonContexts[name];
  if (!ctx) {
    ctx = new SingletonContext(...args);
    ctx.destroy = destroy(name);
    singletonContexts[name] = ctx;
  }
  return ctx;

  function destroy(name) {
    return () => {
      delete singletonContexts[name];
    };
  }
}

export class SingletonContext {
  constructor(init = true) {
    // 是否已经初始化完成
    this._init = init;
    this._pending = false;
    // 状态
    this.status = INIT;
  }

  // 设置初始化完成
  init() {
    this._init = true;
    if (this._pending) {
      this._pending = false;
      this.start();
    }
  }

  // 反初始化完成
  uninit() {
    this._init = false;
  }

  __cmpAndSetStatus(expect, target) {
    if (expect === this.status) {
      this.status = target;
      return true;
    }
    return false;
  }

  start() {
    if (this._init) {
      if (this.__cmpAndSetStatus(INIT, RUNNING)) {
        return true;
      }
      this.__cmpAndSetStatus(RUNNING, RUNNING_WITH_PENDING);
    } else {
      this._pending = true;
    }
    return false;
  }

  stop() {
    this.status = INIT;
  }

  done() {
    this.__cmpAndSetStatus(RUNNING_WITH_PENDING, RUNNING);
    return this.__cmpAndSetStatus(RUNNING, INIT);
  }

  is_pending() {
    return !this.done();
  }

  run(f) {
    if (this.start()) {
      do {
        try {
          f();
        } catch(err) {
          this.stop();
          throw err;
        }
      } while(this.is_pending());
    }
  }
}
