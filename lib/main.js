'use babel';

import annotationProvider from './annotationProvider';
import serviceProvider from './serviceProvider';
import connectProvider from './connectProvider';

export default {

    config: {
        serviceRegistryLocation: {
            type: "string",
            default: "/houzz/jukwaa/apps/middle-layer/helpers/serviceRegistry.json"
        },

        resolverMapLocation: {
            type: "string",
            default: "/houzz/jukwaa/apps/middle-layer/ResolverMap.js"
        }
    },

    getProvider() {
        // return a single provider, or an array of providers to use together
        return [annotationProvider, serviceProvider];
    }
};
