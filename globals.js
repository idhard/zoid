/* @flow */
/* eslint import/no-commonjs: off */

const postRobotGlobals = require('post-robot/globals');

const pkg = require('./package.json');

const formatVersion = (version) => {
    return version.replace(/[^\d]+/g, '_');
};

module.exports = {
    __POST_ROBOT__: {
        ...postRobotGlobals.__POST_ROBOT__,
        __AUTO_SETUP__: false
    },
    __ZOID__: {
        __VERSION__:           formatVersion(pkg.version),
        __GLOBAL_KEY__:        `__zoid_${ formatVersion(pkg.version) }__`,
        __POPUP_SUPPORT__:     true,
        __FRAMEWORK_SUPPORT__: false,
        __DEFAULT_CONTAINER__: true,
        __DEFAULT_PRERENDER__: true
    }
};
