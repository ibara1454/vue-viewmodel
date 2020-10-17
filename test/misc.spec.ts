import { shallowMount } from '@vue/test-utils';
import Plugin from '@/plugin';
import TestComponent from './helpers/TestComponent.vue';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Plugin', () => {
  describe('tearDown', () => {
    it('is called after components destroyed', () => {
      const spy = jest.spyOn(Plugin, 'tearDown').mockReturnValue();
      const plugin = new Plugin();
      const wrapper = shallowMount(TestComponent, {
        global: {
          plugins: [plugin],
        },
      });
      expect(spy).not.toHaveBeenCalled();
      // Unmount component explicitly to trigger beforeUnmount / unmounted hooks.
      // Note that `beforeUnmount` and `unmounted` will not be triggered
      // unless the component is manually destroyed.
      wrapper.unmount();
      expect(spy).toHaveBeenCalled();
    });
  });
});
