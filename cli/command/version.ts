import { VersionCommand } from "../cli";
import packageJson from "../../package.json";

export function versionCommand(command: VersionCommand) {
    console.log("Version: " + packageJson.version);
}
