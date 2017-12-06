'use babel';

import annotationProvider from './annotationProvider';
import serviceProvider from './serviceProvider';

export default {

    config: {
        serviceRegistryLocation: {
            type: "string",
            default: "/houzz/jukwaa/apps/middle-layer/helpers/serviceRegistry.json"
        }
    },

    getProvider() {
        // return a single provider, or an array of providers to use together
        return [annotationProvider, serviceProvider];
    }
};
