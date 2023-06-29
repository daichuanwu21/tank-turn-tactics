import AppError from "./error/app.error";
import handleError from "./error/handle-error.function";

interface IConfigElement {
  envionmentVariableName: string;
  configName: string;
  type: "number" | "boolean" | "string";
}

const configElements: IConfigElement[] = [
  {
    envionmentVariableName: "LISTEN_PORT",
    configName: "listenPort",
    type: "number",
  },
  {
    envionmentVariableName: "DEBUG",
    configName: "debug",
    type: "boolean",
  },
  {
    envionmentVariableName: "CORS_ORIGIN",
    configName: "corsOrigin",
    type: "string",
  },
  {
    envionmentVariableName: "GRID_X_SIZE",
    configName: "gridXSize",
    type: "number",
  },
  {
    envionmentVariableName: "GRID_Y_SIZE",
    configName: "gridYSize",
    type: "number",
  },
];

interface IConfig {
  listenPort: string;
  debug: boolean;
  corsOrigin: string;
  gridXSize: number;
  gridYSize: number;
}

interface IParseEnvConfigByType {
  [type: string]: (envConfig: string, envVarName: string) => any;
}

const parseEnvConfigByType: IParseEnvConfigByType = {
  number: (envConfig: string, envVarName: string): number => {
    if (isNaN(+envConfig))
      throw new AppError(
        `Config option ${envVarName} is not a valid number`,
        false
      );
    return parseInt(envConfig);
  },
  boolean: (envConfig: string, envVarName: string): boolean => {
    if (envConfig !== "YES" && envConfig !== "NO")
      throw new AppError(
        `Config option ${envVarName} is not either "YES" or "NO"`,
        false
      );
    return envConfig === "YES" ? true : false;
  },
  string: (envConfig: string, envVarName: string): string => envConfig,
};

const getNormalizedConfig = (): IConfig => {
  const normalizedConfig: any = {};

  try {
    const missingConfigElements: string[] = [];
    for (const configElement of configElements) {
      if (process.env[configElement.envionmentVariableName] === undefined) {
        missingConfigElements.push(configElement.envionmentVariableName);
      }
    }
    if (missingConfigElements.length !== 0)
      throw new AppError(
        `Missing config option(s): ${missingConfigElements.join(", ")} in .env`,
        false
      );

    for (const configElement of configElements) {
      // Can safely assume all environment variables defined with previous check
      const envConfig = process.env[
        configElement.envionmentVariableName
      ] as string;

      normalizedConfig[configElement.configName] = parseEnvConfigByType[
        configElement.type
      ](envConfig, configElement.configName);
    }
  } catch (err) {
    handleError(err);
  }
  return normalizedConfig as IConfig;
};

const config: IConfig = getNormalizedConfig();

export default config;
