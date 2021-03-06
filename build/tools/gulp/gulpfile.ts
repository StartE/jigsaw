import {createPackageBuildTasks} from './packaging/build-tasks-gulp';

// Create gulp tasks to build the different packages in the project.
createPackageBuildTasks('jigsaw');

import './tasks/clean';
import './tasks/default';
//import './tasks/lint';
import './tasks/publish';
//import './tasks/aot';
import './tasks/jigsaw-release';
import './tasks/jigsaw-labs-release';
import './tasks/validate-release';

import './tasks/ensure-url-matches-path'
import './tasks/generate-demo-info'
