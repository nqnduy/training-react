import CONFIG, { Environment } from 'web.config';

export const ConfigLive = {
    /**
     *
     * @param {true} showCredit
     */
    consoleHandle: async (showCredit = true) => {
        const ConsoleHelper = (await import('plugins/utils/ConsoleHelper')).default;

        if (typeof window == 'undefined') {
            ConsoleHelper.disable();
        } else {
            if (IsProd()) {
                console.clear();
                if (showCredit) ConsoleHelper.showCredit();
                ConsoleHelper.disable();
            }
        }
    },
};

export const IsDev = function () {
    return CONFIG.environment == Environment.DEVELOPMENT;
};

export const IsStag = function () {
    return CONFIG.environment == Environment.STAGING;
};

export const IsProd = function () {
    return CONFIG.environment == Environment.PRODUCTION;
};

export const IsCanary = function () {
    return CONFIG.environment == Environment.CANARY;
};
