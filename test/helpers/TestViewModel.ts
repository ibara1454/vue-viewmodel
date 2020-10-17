import { ViewModel } from '@/index';

export default class TestViewModel extends ViewModel {
  public count = 0;

  public clear(): void {
    console.log('clear called');
  }
}
