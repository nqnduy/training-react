import AppRoutes from 'modules/route/AppRoutes';

/**
 *
 * @param {string} name
 * @returns {number}
 */
export const getRouteIndexByName = (name) => {
    const index = AppRoutes.findIndex((x) => x.name == name);
    return index;
};

/**
 *
 * @param {string} name
 * @returns {string}
 */
export const getRoutePathByName = (name) => {
    const found = AppRoutes.find((x) => x.name == name);
    if (found) return found;
    return '/404';
};
