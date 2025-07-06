import { setupInfraCleanup } from 'tests/setup/infrastructure-cleanup';

describe('Hello world', () => {
  setupInfraCleanup();
  it.only('should say hello', async () => {
    console.log('hello');
  }, 60_000);
});
