import { EnvironmentDetector } from './internal/environment-detector';

export function getLocalStackEndpoints() {
  if (EnvironmentDetector.willTargetLocalstackEndpoints()) {
    if (EnvironmentDetector.isDockerContainer())
      return 'http://localstack:4566';
    return 'http://localhost:4566';
  }
}
