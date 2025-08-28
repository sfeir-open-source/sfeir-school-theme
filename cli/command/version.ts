import packageJson from "../../package.json";

export function versionCommand() {
    console.log("Version: " + packageJson.version);
}
