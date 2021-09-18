module.exports = {
    apps: [
        {
            name: 'backend-coding-test',
            script: 'index.dist.js',
            instances: '2',
            exec_mode : "cluster",
            env: {
                NODE_ENV: 'production',
                PORT: '8010'
            },
            error_file: 'logs/err.log',
            out_file: 'logs/out.log',
            log_file: 'logs/combined.log',
            time: true
        }
    ]
}
