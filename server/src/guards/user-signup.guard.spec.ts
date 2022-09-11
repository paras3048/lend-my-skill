import { UserSignupGuard } from './user-signup.guard';

describe('UserSignupGuard', () => {
  it('should be defined', () => {
    expect(new UserSignupGuard()).toBeDefined();
  });
});
