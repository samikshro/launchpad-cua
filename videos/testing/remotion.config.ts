import { Config } from "@remotion/cli/config";
import { webpackOverride } from "./src/remotion/webpack-override.mjs";

Config.setVideoImageFormat("jpeg");
Config.overrideWebpackConfig(webpackOverride);
