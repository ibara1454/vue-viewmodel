import { ViewModel } from '@/index';

export default class TestCustomCtorViewModel extends ViewModel {
  constructor(readonly count: number) {
    super();
  }

  public clear(): void {
    console.log('clear called');
  }
}
