const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const modulePaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
  process.env.NODE_PATH,
].filter(Boolean);

process.env.NODE_PATH = modulePaths.join(path.delimiter);
require("module").Module._initPaths();

const config = getDefaultConfig(projectRoot);
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules")
];
const existingBlockList = Array.isArray(config.resolver.blockList)
  ? config.resolver.blockList
  : [config.resolver.blockList].filter(Boolean);

config.resolver.blockList = [
  /.*[/\\]apps[/\\]api[/\\]node_modules[/\\].*/,
  /.*[/\\]apps[/\\]web[/\\]node_modules[/\\].*/,
  /.*[/\\]apps[/\\]mobile[/\\]dist-web.*/,
  /.*[/\\]apps[/\\]web[/\\]\.next.*/,
  /.*[/\\]apps[/\\]web[/\\]\.next-fitplanner.*/,
  /.*[/\\]apps[/\\]web[/\\]\.next-fitplanner-build.*/,
  /.*[/\\]node_modules[/\\]\.playwright[^/\\]*/,
  /.*[/\\]output[/\\].*/,
  /.*[/\\]screenshots[/\\].*/,
  ...existingBlockList,
];

const nativeWindConfig = withNativeWind(config, { input: "./global.css" });
const upstreamResolveRequest = nativeWindConfig.resolver.resolveRequest;

nativeWindConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  // Expo web requests the router entry as ./node_modules/... even when npm hoists
  // dependencies to the monorepo root.
  if (moduleName.startsWith("./node_modules/")) {
    const hoistedModulePath = path.join(workspaceRoot, moduleName.slice(2));
    try {
      return {
        type: "sourceFile",
        filePath: require.resolve(hoistedModulePath),
      };
    } catch {}
  }

  if (upstreamResolveRequest) {
    return upstreamResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = nativeWindConfig;
