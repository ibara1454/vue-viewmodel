import { ViewModel } from '@/index';

export default class TestCustomCtorViewModel extends ViewModel {
  constructor(readonly count: number) {
    super();
  }

  public clear(): void {
    super.clear();
    console.log('clear called');
  }
}
