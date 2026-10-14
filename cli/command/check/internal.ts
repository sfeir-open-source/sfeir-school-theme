import { checkProjectConfig, checkRootDir } from './check-root-dir';
import { CheckCommand } from '../../cli';
import { checkLabs } from './check-labs';
import { checkSlides } from './check-slides';
import { getProjectConfig } from '../../utils/config.utils';
import { hasLabsDirectory } from '../../utils/labs.utils';

export async function checkCommandInternal(command: CheckCommand) {
    checkRootDir(command);
    checkProjectConfig(command.rootDir);
    const config = getProjectConfig(command.rootDir);
    await checkSlides(command.rootDir, config);
    if (hasLabsDirectory(command.rootDir)) {
        checkLabs(command.rootDir, config);
    }
}
