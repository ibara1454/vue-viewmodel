/* eslint-disable max-classes-per-file */
import { VueComponentInstance } from './types';
import Plugin from '.';

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
  // eslint-disable-next-line class-methods-use-this
  public clear(): void {
    // Empty implementation.
  }
}

/**
 * The type alias returns a variadic constructor function.
 */
type ConstructorType<Klass> = new (...args: unknown[]) => Klass;

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

  /**
   * Clear the storage.
   */
  public clear(): void {
    this.store.clear();
  }
}

/**
 * The interface which provides a method for obtaining ViewModelStores.
 */
export interface ViewModelStoreOwner {
  /**
   * Returns a ViewModelStore.
   * This should always return the same ViewModelStore for a same scope.
   *
   * @returns A ViewModelStore instance.
   */
  getViewModelStore(): ViewModelStore;

  $viewModelStore?: ViewModelStore;
}

/**
 * The factory which is responsible to instantiate ViewModels.
 */
export interface ViewModelFactory {
  /**
   * Creates a new instance of given ViewModel class.
   *
   * @param ctor - A ViewModel class whose instance is requested.
   * @returns A new instance of ViewModel.
   */
  create<VM extends ViewModel>(ctor: ConstructorType<VM>): VM;
}

/**
 * The default implementation of ViewModelFactory.
 * This factory could only be used for creating the ViewModels with 0 param
 * constructor.
 */
class DefaultViewModelFactory implements ViewModelFactory {
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
   * Create a `ViewModelProvider`, which will create ViewModels via default factory
   * and retain them in a store of the given `ViewModelStoreOwner`.
   *
   * @param owner - A `ViewModelStoreOwner` which will be used to get `ViewModelStore`.
   */
  constructor(owner: ViewModelStoreOwner);

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
 * Foo
 *
 * @param ctor - The constructor function to create a new viewmodel.
 * @param instance - The vue instance which the generated viewmodel depends on.
 * @returns
 */
export function viewModels<VM extends ViewModel>(
  ctor: ConstructorType<VM>,
  instance?: VueComponentInstance,
): VM {
  const contextManager = Plugin.contextManager;
  // If the second argument is undefined.
  const owner = instance ?? contextManager.fooCurrentContext();
  // Get existing viewModel instance or create a new viewModel via the provider.
  const provider = new ViewModelProvider(owner);
  return provider.get(ctor);
}
