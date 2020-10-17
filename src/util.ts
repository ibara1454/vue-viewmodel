import { getCurrentInstance } from 'vue';
import type { ComponentInternalInstance } from 'vue';

/**
 * The getCurrentInstance function with null check.
 *
 * @throws Error - if the current instance is null.
 * @returns The current vue instance.
 */
export function getNonNullCurrentInstance(): ComponentInternalInstance {
  const instance = getCurrentInstance();
  if (instance === null) {
    throw new Error(
      'The current vue instance is null. ' +
        `Please ensure you are using the instance inside 'setup' function.`,
    );
  }
  return instance;
}
