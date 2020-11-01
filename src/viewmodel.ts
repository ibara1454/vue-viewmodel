import type { ComponentInternalInstance } from 'vue';
import { getNonNullCurrentInstance } from './util';

/**
 * The abstruct ViewModel class.
 * ViewModel is a class that is responsible for managing executions and states.
 * The method `clear` which is the method for releasing all resources that used
 * in the ViewModel.
 */
export abstract class ViewModel {
  /**
   * This method will be called when the ViewModel is no longer needed and will
   * be destroyed. You should override this method to release resources.
   */
  clear(): void {
    // The empty implementation for the case the
    // derived class didn't override `clear` method.
  }
}

/**
 * The type alias represents the variadic constructor function of Klass.
 * @typeParam Klass - The type of class itself.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConstructorType<Klass> = new (...args: any[]) => Klass;

/**
 * The storage for ViewModels.
 */
export class ViewModelStore {
  // Use map to store ViewModels.
  // The equality of keys is using the Same-value-zero equality algorithm.
  // For more information, see
  // https://developer.mozilla.org/ja/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality
  private store = new Map<string, ViewModel>();

  /**
   * Gets a instance of the given ViewModel class if it exists in store, otherwise
   * returns undefined.
   *
   * @param key - The instance of the ViewModel class itself.
   * @returns The instance of the given ViewModel class or undefined.
   */
  public get(key: string): ViewModel | undefined {
    return this.store.get(key);
  }

  /**
   * Puts a instance of the given ViewModel class.
   *
   * @param key - The ViewModel class itself.
   * @param value - The instance of the ViewModel.
   */
  public put<VM extends ViewModel>(key: string, value: VM): void {
    this.store.set(key, value);
  }

  public keys(): IterableIterator<string> {
    return this.store.keys();
  }

  public values(): IterableIterator<ViewModel> {
    return this.store.values();
  }

  /**
   * Clear the storage.
   */
  public clear(): void {
    this.store.clear();
  }
}

/**
 * The class which provides a method for obtaining ViewModelStores.
 */
export abstract class ViewModelStoreOwner {
  /**
   * Returns a ViewModelStore.
   * This should always return the same ViewModelStore for a same scope.
   *
   * @returns A ViewModelStore instance.
   */
  abstract getViewModelStore(): ViewModelStore;
}

/**
 * The factory which is responsible to instantiate ViewModels.
 */
export abstract class ViewModelFactory {
  /**
   * Creates a new instance of given ViewModel class.
   *
   * @param ctor - A ViewModel class whose instance is requested.
   * @returns A new instance of ViewModel.
   */
  abstract create<VM extends ViewModel>(ctor: ConstructorType<VM>): VM;
}

/**
 * The default implementation of ViewModelFactory.
 * This factory could only be used for creating the ViewModels with 0 param
 * constructor.
 */
class DefaultViewModelFactory extends ViewModelFactory {
  /**
   * Creates a new instance of given ViewModel class.
   *
   * @param ctor - A ViewModel class whose instance is requested.
   * @returns A new instance of ViewModel.
   */
  // eslint-disable-next-line class-methods-use-this
  public create<VM extends ViewModel>(ctor: ConstructorType<VM>): VM {
    // This instantiation may crash when the constructor has more than one argument.
    return new ctor();
  }
}

/**
 * ViewModelProvider is responsible for providing ViewModels for a scope.
 */
export class ViewModelProvider {
  /**
   * The store for saving instantiated ViewModels.
   */
  private readonly viewModelStore: ViewModelStore;

  /**
   * The factory for creating ViewModels.
   */
  private readonly factory: ViewModelFactory;

  /**
   * Create a `ViewModelProvider`, which will create ViewModels via the given factory
   * and retains them in a store of the given `ViewModelStoreOwner`.
   *
   * @param owner - A `ViewModelStoreOwner` which will be used to get `ViewModelStore`.
   * @param factory - A factory which will be used to create ViewModels.
   */
  constructor(owner: ViewModelStoreOwner, factory?: ViewModelFactory) {
    this.viewModelStore = owner.getViewModelStore();
    if (!factory) {
      this.factory = new DefaultViewModelFactory();
    } else {
      this.factory = factory;
    }
  }

  /**
   * Returns an exising `ViewModel` or creates a new instance in the scope.
   *
   * @param ctor - A ViewModel class whose instance is requested.
   * @returns The instance of ViewModel.
   */
  public get<VM extends ViewModel>(ctor: ConstructorType<VM>): VM {
    // Get the unique key name from constructor (class).
    const key = ctor.name;
    let viewModel = this.viewModelStore.get(key);

    // If the viewmodel doesn't exist, then create a new one and retain it in the store.'
    if (!viewModel) {
      viewModel = this.factory.create(ctor);
      this.viewModelStore.put(key, viewModel);
    }
    return viewModel as VM;
  }
}

/**
 * Returns a ViewModel instance which is scoped to the given `instance`.
 *
 * Usage for getting a `ViewModel` in current component scope:
 * ```typescript
 * import { defineComponent, ref } from 'vue';
 * import { viewModels, ViewModel } from 'vue-viewmodel';
 *
 * class MyViewModel extends ViewModel {
 *   count = ref(0);
 *
 *   clear() {
 *     super.clear();
 *     // ...
 *   }
 * }
 *
 * export default defineComponent({
 *   setup() {
 *     const viewModel = viewModels(MyViewModel);
 *     return { count: viewModel.count };
 *   }
 * });
 * ```
 *
 * Usage for getting a `ViewModel` in specific component scope:
 * ```typescript
 * import { defineComponent, ref } from 'vue';
 * import { viewModels, ViewModel } from 'vue-viewmodel';
 *
 * class MyViewModel extends ViewModel {
 *   count = ref(0);
 *
 *   clear() {
 *     super.clear();
 *     // ...
 *   }
 * }
 *
 * export default defineComponent({
 *   setup() {
 *     // Get a ViewModel which is scoped to the parent component.
 *     const viewModel = viewModels(MyViewModel, ins.parent!);
 *     return { count: viewModel.count };
 *   }
 * });
 * ```
 *
 * Usage for getting a `ViewModel` with arbitrary constructor:
 * ```typescript
 * import { defineComponent, ref, getCurrentInstance } from 'vue';
 * import { viewModels, ViewModel, ViewModelFactory } from 'vue-viewmodel';
 *
 * class MyViewModel extends ViewModel {
 *   count: number;
 *
 *   constructor(initCount: number) {
 *     super();
 *     this.count = initCount;
 *   }
 *
 *   clear() {
 *     super.clear();
 *     // ...
 *   }
 * }
 *
 * class MyFactory extends ViewModelFactory {
 *   create<VM extends ViewModel>(ctor: unknown): VM {
 *     if (ctor === MyViewModel.prototype.constructor) {
 *       const viewModel: ViewModel = new MyViewModel(0);
 *       return viewModel as VM;
 *     } else {
 *       throw Error('No matched ViewModel');
 *     }
 *   }
 * }
 *
 * export default defineComponent({
 *   setup() {
 *     const factory = new MyFactory();
 *     const viewModel = viewModels(MyViewModel, getCurrentInstance(), factory);
 *     return { count: viewModel.count };
 *   }
 * });
 * ```
 *
 * @param ctor - The constructor function to create a new ViewModel.
 * @param instance - (Optional) The vue instance which the generated ViewModel depends on.
 * @typeParam VM - The type of ViewModel.
 * @returns The ViewModel scoped to the given `instance`.
 */
export function viewModels<VM extends ViewModel>(
  ctor: ConstructorType<VM>,
  instance?: ComponentInternalInstance,
  factory?: ViewModelFactory,
): VM {
  const owner = getViewModelStoreOwner(
    // If the second argument is not given,
    // then use the current instance (the caller instance) instead.
    instance ?? getNonNullCurrentInstance(),
  );
  const provider = factory
    ? new ViewModelProvider(owner, factory)
    : new ViewModelProvider(owner);
  // Get existing viewModel instance or create a new viewModel via viewmodel provider.
  return provider.get(ctor);
}

/**
 * Transforms the given ComponentInternalInstance to ViewModelStoreOwner.
 *
 * Note that this function will inject a `getViewModelStore` function on the given
 * ComponentInternalInstance if `getViewModelStore` does not exist.
 *
 * @param instance - The vue instance which the generated ViewModel depends on.
 * @returns The ViewModelStoreOwner instance.
 *  (Exactly, the ViewModelStoreOwner is the same instance as the given ComponentInternalInstance)
 */
function getViewModelStoreOwner(
  instance: ComponentInternalInstance & Partial<ViewModelStoreOwner>,
): ViewModelStoreOwner {
  // If `getViewModelStore` does not exist on the instance, then inject which method on it.
  if (instance.getViewModelStore === undefined) {
    const viewModelStore = new ViewModelStore();
    instance.getViewModelStore = () => viewModelStore;
  }
  // const mergeStrategy = ins.appContext.app.config.optionMergeStrategies;
  // // The proxy is set before setup.
  // // https://github.com/vuejs/vue-next/blob/master/packages/runtime-core/src/component.ts#L555
  // const { beforeUnmount } = ins.proxy!.$options;
  return instance as ViewModelStoreOwner;
}
