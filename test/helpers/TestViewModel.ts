import { ViewModel } from '@/index';

export default class TestViewModel extends ViewModel {
  public count = 0;

  public clear(): void {
    super.clear();
    console.log('clear called');
  }
}
