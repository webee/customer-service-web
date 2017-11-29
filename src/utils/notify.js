const INIT = Symbol('INIT');
const RUNNING = Symbol('RUNNING');
const RUNNING_WITH_PENDING = Symbol('RUNNING_WITH_PENDING');

export class SingletonWorker {
  constructor(name, f, init = true) {
    this.name = name;
    // 是否已经初始化完成
    this._init = init;
    this._pending = false;
    // 状态
    this.status = INIT;
    // 任务函数
    this.f = f;
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

  _try_start() {
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

  _done() {
    this.__cmpAndSetStatus(RUNNING_WITH_PENDING, RUNNING);
    return this.__cmpAndSetStatus(RUNNING, INIT);
  }

  async start() {
    if (this._try_start()) {
      do {
        const r = this.f();
        if (r instanceof Promise) {
          try {
            console.log('start await: ', this.name, r);
            await r;
            console.log('done await: ', this.name);
          } catch (err) {
            console.error("SingletonWorker", err);
          }
        }
      } while (!this._done());
    }
  }
}
