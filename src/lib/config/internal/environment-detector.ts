import fs from 'fs';

enum HostLocation {
  Local = 'localhost',
  Cloud = 'cloud',
}
enum InfrastructureTarget {
  Localstack = 'localstack',
  Aws = 'aws',
}

export class EnvironmentDetector {
  public static willTargetLocalstackEndpoints(): boolean {
    return this.getInfrastructureTarget() === InfrastructureTarget.Localstack;
  }
  public static willTargetAwsEndpoints(): boolean {
    return this.getInfrastructureTarget() === InfrastructureTarget.Aws;
  }

  private static getHostLocation(): HostLocation {
    return process.env.AWS_LAMBDA_FUNCTION_NAME
      ? HostLocation.Cloud
      : HostLocation.Local;
  }

  public static isDockerContainer(): boolean {
    if (
      process.env.DOCKER_CONTAINER === 'true' ||
      process.env.KUBERNETES_SERVICE_HOST
    )
      return true;
    try {
      return fs.existsSync('/.dockerenv');
    } catch {
      return false;
    }
  }
  private static getInfrastructureTarget(): InfrastructureTarget {
    const location = this.getHostLocation();

    if (location === HostLocation.Cloud || process.env.TARGET_ENV === 'aws') {
      return InfrastructureTarget.Aws;
    }

    return InfrastructureTarget.Localstack;
  }
}
