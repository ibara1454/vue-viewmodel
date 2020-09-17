import { VueComponentInstance } from './types';

class ContextManager {
  static currentContext = null as VueComponentInstance | null;

  static setCurrentContext(instance: VueComponentInstance | null): void {
    // console.log('current context:', instance);
    this.currentContext = instance;
  }

  static getCurrentContext(): VueComponentInstance | null {
    return this.currentContext;
  }

  static fooCurrentContext(): VueComponentInstance {
    const context = this.getCurrentContext();
    if (!context) {
      throw new Error(
        "Current vue instance is null. Did you called method before 'setup'?",
      );
    }
    return context;
  }

  static withContext<T>(vm: VueComponentInstance, fn: () => T): T {
    const context = ContextManager.getCurrentContext();
    ContextManager.setCurrentContext(vm);
    try {
      return fn();
    } finally {
      ContextManager.setCurrentContext(context);
    }
  }
}

export default ContextManager;
