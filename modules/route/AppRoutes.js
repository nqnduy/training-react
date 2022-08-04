class RouteData {
    /**
     *
     * @param {string} path
     * @param {*} props
     */
    constructor(path, props) {
        Object.assign(this, props);

        this.path = path;
    }
}

export const RouteName = {
    HOMEPAGE: 'homepage',
    COMPONENT_COLLECTION: 'component_collection',
    EXAMPLES: 'examples',
};

const AppRoutes = [
    new RouteData('/', {
        name: RouteName.HOMEPAGE,
    }),
    new RouteData('/components/components', {
        name: RouteName.COMPONENT_COLLECTION,
    }),
    new RouteData('/examples', {
        name: RouteName.EXAMPLES,
    }),
];

export default AppRoutes;

/* 
HOW TO USE WITHOUT HELL LOOP:

import { useMemo } from "react";
import { getRoutePathByName } from "modules/route/RouteHelper";
import { RouteName } from "modules/route/AppRoutes";

export default function Demo(props) {

    const homepage_path = useMemo(() => {
        return getRoutePathByName(RouteName.HOMEPAGE)
    }, [])

    const component_collection_path = useMemo(() => {
        return getRoutePathByName(RouteName.COMPONENT_COLLECTION)
    }, [])

    const examples_path = useMemo(() => {
        return getRoutePathByName(RouteName.EXAMPLES)
    }, [])

    return (
        <>
            <AppLink href={homepage_path}>{RouteName.HOMEPAGE}</AppLink>
            <AppLink href={component_collection_path}>{RouteName.COMPONENT_COLLECTION}</AppLink>
            <AppLink href={examples_path}>{RouteName.EXAMPLES}</AppLink>
        </>
    );
}

*/
