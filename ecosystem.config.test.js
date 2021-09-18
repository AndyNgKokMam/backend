module.exports = {
    apps: [
        {
            name: 'backend-coding-test',
            script: ' -r dotenv/config index.dist.js dotenv_config_path=/.env.test',
            instances: '2',
            exec_mode : "cluster",
            env: {
                NODE_ENV: 'production'
            },
            error_file: 'logs/err.log',
            out_file: 'logs/out.log',
            log_file: 'logs/combined.log',
            time: true
        }
    ]
}
