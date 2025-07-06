const resetLocalStackInfra = async () => {
  try {
    const startTime = Date.now();

    const response = await fetch('http://localhost:4566/_localstack/health', {
      method: 'POST',
      body: JSON.stringify({ action: 'restart' }),
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      console.error(
        `LocalStack reset failed with status: ${response.status} ${response.statusText}`,
      );
    }

    console.log(`LocalStack infrastructure reset complete (${duration}ms)`);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Failed to connect to LocalStack');
    } else {
      console.error('LocalStack reset failed:', error);
    }
    throw error;
  }
};

export const setupInfraCleanup = () => {
  beforeEach(async () => {
    await resetLocalStackInfra();
  });
};
