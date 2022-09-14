import { UserSignupMiddleware } from './user-signup.middleware';

describe('UserSignupMiddleware', () => {
  it('should be defined', () => {
    expect(new UserSignupMiddleware()).toBeDefined();
  });
});
