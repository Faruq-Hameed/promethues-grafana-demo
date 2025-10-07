import client from 'prom-client';

//create a Registry to register the metrics
const register = new client.Registry();

//Collect default metrics like CPU and memory usage
client.collectDefaultMetrics({ register });

//My custom metric to track the number of requests

export const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: "Duration of HTTP requests in seconds",
    labelNames:['method', 'route', 'status_code'],
})

export const httpRequestCount = new client.Counter({
    name: 'http_request_count',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
})

export const dbQueryDuration = new client.Counter({
    name: 'db_query_duration_seconds',
    help: 'Duration of database queries in seconds',
    labelNames: ['success']
})

export const dbQueryCounter = new client.Counter({
    name: 'db_query_count',
    help: 'Total number of database queries',
    labelNames: ['success']
})
export const numOfUsers = new client.Gauge({
    name: 'num_of_users',
    help: 'Number of users in the system'
})

//register the custom metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestCount);
register.registerMetric(dbQueryDuration);
register.registerMetric(dbQueryCounter);
register.registerMetric(numOfUsers);

export default register;