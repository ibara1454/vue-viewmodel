import type { ComponentInternalInstance } from 'vue';
import {
  ViewModelStore,
  ViewModelProvider,
  ViewModelFactory,
  ViewModel,
  viewModels,
} from '@/viewmodel';
import { getNonNullCurrentInstance } from '@/util';
import TestViewModel from './helpers/TestViewModel';
import TestCustomCtorViewModel from './helpers/TestCustomCtorViewModel';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('ViewModelProvider', () => {
  describe('get', () => {
    it('creates new `ViewModel` if it does not exist in store', () => {
      // Mocks
      const originalViewModelStore = new ViewModelStore();
      const viewModelStoreGetSpy = jest.spyOn(originalViewModelStore, 'get');
      const viewModelStorePutSpy = jest.spyOn(originalViewModelStore, 'put');

      const ViewModelStoreOwner = jest.fn(() => {
        return {
          getViewModelStore(): ViewModelStore {
            return originalViewModelStore;
          },
        };
      });
      // Executions
      const owner = new ViewModelStoreOwner();
      const provider = new ViewModelProvider(owner);
      const returnValue = provider.get(TestViewModel);
      // Validation
      expect(viewModelStoreGetSpy).toHaveBeenCalledTimes(1);
      expect(viewModelStorePutSpy).toHaveBeenCalledTimes(1);
      const viewModel = new TestViewModel();
      expect(viewModelStorePutSpy).toHaveBeenCalledWith(
        TestViewModel.name,
        viewModel,
      );
      expect(returnValue).toEqual(viewModel);
    });

    it('reuses the existing `ViewModel` if it exists in store', () => {
      // Mocks
      const viewModel = new TestViewModel();
      const originalViewModelStore = new ViewModelStore();
      const viewModelStoreGetSpy = jest
        .spyOn(originalViewModelStore, 'get')
        .mockReturnValue(viewModel);
      const viewModelStorePutSpy = jest.spyOn(originalViewModelStore, 'put');
      const ViewModelStoreOwner = jest.fn(() => {
        return {
          getViewModelStore(): ViewModelStore {
            return originalViewModelStore;
          },
        };
      });
      // Executions
      const owner = new ViewModelStoreOwner();
      const provider = new ViewModelProvider(owner);
      const returnValue = provider.get(TestViewModel);
      // Validations
      expect(viewModelStoreGetSpy).toHaveBeenCalledTimes(1);
      expect(viewModelStorePutSpy).not.toHaveBeenCalled();
      expect(returnValue).toEqual(viewModel);
    });
  });
});

// Mocks entire util module.
jest.mock('@/util');
const getNonNullCurrentInstanceMock = getNonNullCurrentInstance as jest.Mock;

describe('viewModels(ViewModel)', () => {
  it('returns a `ViewModel` instance depends on existing current vue instace', () => {
    // Mocks getNonNullCurrentInstance function to return an empty object instead of vue instace.
    getNonNullCurrentInstanceMock.mockImplementation(() => new Object());
    const vm = viewModels(TestViewModel);
    // Validations
    expect(vm.constructor).toEqual(TestViewModel);
    expect(getNonNullCurrentInstanceMock).toHaveBeenCalledTimes(1);
  });

  it('throws exception if current vue instace does not exist', () => {
    // Mocks getNonNullCurrentInstance function throw exception.
    getNonNullCurrentInstanceMock.mockImplementation(() => {
      throw Error('Current instance does not exist');
    });
    // Validations
    expect(() => {
      viewModels(TestViewModel);
    }).toThrow();
    expect(getNonNullCurrentInstanceMock).toHaveBeenCalledTimes(1);
  });
});

describe('viewModels(ViewModel, ComponentInternalInstance)', () => {
  it('returns a `ViewModel` instance depends on the given vue instace', () => {
    // Mocks getNonNullCurrentInstance function throw exception.
    getNonNullCurrentInstanceMock.mockImplementation(() => {
      throw Error('Should not be called');
    });
    const getInstance = jest.fn(() => {
      return new Object() as ComponentInternalInstance;
    });
    const instance = getInstance();
    const vm = viewModels(TestViewModel, instance);
    // Validations
    expect(vm.constructor).toEqual(TestViewModel);
    expect(getNonNullCurrentInstanceMock).not.toHaveBeenCalled();
  });
});

describe('viewModels(ViewModel, ComponentInternalInstance, ViewModelFactory)', () => {
  it('returns a `ViewModel` which is created by the given `ViewModelFactory`', () => {
    // Mocks getNonNullCurrentInstance function throw exception.
    getNonNullCurrentInstanceMock.mockImplementation(() => {
      throw Error('Should not be called');
    });
    const getInstance = jest.fn(() => {
      return new Object() as ComponentInternalInstance;
    });
    const instance = getInstance();
    const Factory = class extends ViewModelFactory {
      create<VM extends ViewModel>(ctor: unknown): VM {
        if (ctor === TestCustomCtorViewModel.prototype.constructor) {
          const viewModel: ViewModel = new TestCustomCtorViewModel(0);
          return viewModel as VM;
        } else {
          throw Error('No matched ViewModel');
        }
      }
    };
    const factory = new Factory();
    const vm = viewModels(TestCustomCtorViewModel, instance, factory);
    // Validations
    expect(vm.constructor).toEqual(TestCustomCtorViewModel);
    expect(vm.count).toEqual(0);
    expect(getNonNullCurrentInstanceMock).not.toHaveBeenCalled();
  });
});
