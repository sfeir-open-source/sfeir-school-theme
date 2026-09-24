import { CheckCommand } from '../../cli';
import { checkLabs } from './check-labs';
import { checkRootDir } from './check-root-dir';
import { checkSlides } from './check-slides';
import { getProjectConfig } from '../../utils/config.utils';

export async function checkCommandInternal(command: CheckCommand) {
    checkRootDir(command);
    const config = getProjectConfig(command.rootDir);
    await checkSlides(command.rootDir, config);
    checkLabs(command.rootDir, config);
}
