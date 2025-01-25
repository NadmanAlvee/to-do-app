const env = {};

env.staging = {
    port: 3000
};

env.production = {
    port: 80
};


// determine the environment
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
const envToExport = typeof(env[currentEnvironment]) === 'object' ? env[currentEnvironment] : env.staging;

module.exports = envToExport;
