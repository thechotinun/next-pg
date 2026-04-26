import {config} from "dotenv";
import {join} from "path";
import {readFileSync} from "fs";
import * as process from "node:process";

function loadPackageJson() {
  try {
    const packageJsonPath = join(process.cwd(), "package.json");
    const packageJsonContent = readFileSync(packageJsonPath, "utf8");
    return JSON.parse(packageJsonContent);
  } catch (error) {
    console.warn("Could not load package.json:", error);
  }
}

export interface AppConfig {
  NAME: string;
  VERSION: string;
  APP_URL: string;
  MODE: string;
  PORT: number;
  PER_PAGE: number;
  LOG_PRISMA: boolean;
  LOG_LEVEL: string;
}


export default function createConfig(): AppConfig {
  // Load environment variables
  const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
  const envPath = join(process.cwd(), envFile);

  // Load dotenv config
  config({path: envPath});

  // Load package.json
  const packageJson = loadPackageJson();

  return {
    NAME: packageJson.name,
    VERSION: packageJson.version,
    APP_URL: process.env.APP_URL || "http://localhost:3000",
    MODE: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.PORT || "3000", 10),
    PER_PAGE: parseInt(process.env.PER_PAGE || "10", 10),
    // Prisma
    LOG_PRISMA: process.env.LOG_PRISMA === "true",
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
  };
}