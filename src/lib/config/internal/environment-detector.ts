import fs from 'fs';
import { getEnvVar } from '../env';

enum HostLocation {
  Local = 'localhost',
  Cloud = 'cloud',
}
enum LocalHostRuntime {
  Host = 'host',
  Container = 'container',
}
enum InfrastructureTarget {
  Localstack = 'localstack',
  Aws = 'aws',
}
enum Environment {
  Local = 'local',
  Dev = 'dev',
  Prod = 'prod',
}
interface EnvironmentContext {
  location: HostLocation;
  runtime: LocalHostRuntime | 'lambda';
  infrastructure: InfrastructureTarget;
  environment: Environment;
  isLocalhost: boolean;
  isCloud: boolean;
  isContainer: boolean;
  isLocalStack: boolean;
  isAWS: boolean;
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
  public static getContext(): EnvironmentContext {
    const location = this.getHostLocation();
    const infrastructure = this.getInfrastructureTarget();
    const environment = this.getEnvironment();
    const runtime =
      location === HostLocation.Local ? this.getLocalhostRuntime() : 'lambda';

    return {
      location,
      runtime,
      infrastructure,
      environment,
      isLocalhost: location === HostLocation.Local,
      isCloud: location === HostLocation.Cloud,
      isContainer: runtime === LocalHostRuntime.Container,
      isLocalStack: infrastructure === InfrastructureTarget.Localstack,
      isAWS: infrastructure === InfrastructureTarget.Aws,
    };
  }
  private static getEnvironment(): Environment {
    const location = this.getHostLocation();

    if (location === HostLocation.Local) {
      return Environment.Local;
    }

    const envVar = getEnvVar('ENVIRONMENT');

    switch (envVar) {
      case 'prod':
      case 'production':
        return Environment.Prod;
      case 'dev':
      case 'development':
        return Environment.Dev;
      default:
        return Environment.Dev;
    }
  }

  private static getLocalhostRuntime(): LocalHostRuntime {
    if (this.isDockerContainer()) return LocalHostRuntime.Container;
    return LocalHostRuntime.Host;
  }

  private static isDockerContainer(): boolean {
    if (
      process.env.DOCKER_CONTAINER === 'true' ||
      process.env.KUBERNETES_SERVICE_HOST ||
      process.env.AWS_EXECUTION_ENV
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

    if (location === HostLocation.Cloud || getEnvVar('USE_AWS') === 'true') {
      return InfrastructureTarget.Aws;
    }

    return InfrastructureTarget.Localstack;
  }
}
