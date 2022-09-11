import { ProfileBioUpdateMiddleware } from './profile-bio-update.middleware';

describe('ProfileBioUpdateMiddleware', () => {
  it('should be defined', () => {
    expect(new ProfileBioUpdateMiddleware()).toBeDefined();
  });
});
