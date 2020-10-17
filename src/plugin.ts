import type { ComponentInternalInstance, App } from 'vue';
import type { ViewModelStoreOwner } from './viewmodel';
import { getNonNullCurrentInstance } from './util';

export default class Plugin {
  /**
   * The install method for registering the plugin.
   *
   * To apply the plugin:
   * ```typescript
   * import { createApp } from 'vue';
   * import Plugin from 'vue-viewmodel';
   * import App from './App.vue'
   *
   * const app = createApp(App);
   * app.use(Plugin);
   * app.mount('#app');
   * ```
   *
   * For more information, see https://v3.vuejs.org/guide/plugins.html#using-a-plugin.
   *
   * @param Vue - The vue application instance.
   */
  install(Vue: App): void {
    Vue.mixin({
      beforeUnmount() {
        const instance = getNonNullCurrentInstance();
        Plugin.tearDown(instance);
      },
    });
  }

  /**
   * The tear down execution.
   * This execution cleans up all ViewModelStores on the given component.
   * @param instance - The vue instance.
   */
  static tearDown(
    instance: ComponentInternalInstance & Partial<ViewModelStoreOwner>,
  ): void {
    // Get ViewModelStore from vue instance if exists.
    const viewModelStore = instance.getViewModelStore
      ? instance.getViewModelStore()
      : undefined;
    // Do the tear down task only if the viewModelStore exists.
    if (viewModelStore) {
      const vms = Array.from(viewModelStore.values());
      // Clear all existing viewModels.
      vms.forEach((vm) => {
        vm.clear();
      });
      viewModelStore.clear();
    }
  }
}
