const resetLocalStackInfra = async () => {
  try {
    await fetch('http://localhost:4566/_localstack/state/reset', {
      method: 'POST',
    });

    console.log('LocalStack infrastructure reset complete');
  } catch (error) {
    console.error('Failed to reset LocalStack:', error);
    throw error;
  }
};

export const setupInfraCleanup = () => {
  afterEach(async () => {
    await resetLocalStackInfra();
  });
};
