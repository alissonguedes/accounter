import { toast } from './toast';

describe('toast', () => {
  it('should create an instance', () => {
    expect(toast('teste')).toBeTruthy();
  });
});
