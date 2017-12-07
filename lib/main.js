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

        resolverMapEndpoint: {
            type: "string",
            default: "http://houzztest.com/j/graphql-resolverMap"
        }
    },

    getProvider() {
        // return a single provider, or an array of providers to use together
        return [annotationProvider, serviceProvider, connectProvider];
    }
};
