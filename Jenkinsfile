pipeline {
    agent any
    environment {
        NETLIFY_SITE_ID = '58b26e18-fc1e-454b-9032-d9bacd707429'
        NETLIFY_AUTH_TOKEN = credentials('netlify-token')
        REACT_APP_VERSION = "1.0.${BUILD_NUMBER}"
    }

    stages {
        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/2AnkitMishra/learn-jenkins-app.git'
            }
        }

        stage('Build') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    ls -la
                    node --version
                    npm --version
                    npm ci
                    npm run build
                    ls -la
                '''
            }
        }
        stage ('Tests') {
            parallel {
                stage('Unit Test') {
                    agent {
                        docker {
                            image 'node:18-alpine'
                            reuseNode true
                        }
                    }
                    steps {
                        sh '''
                        test -f build/index.html
                        npm  test
                        '''
                    }
                    post {
                        always {
                            junit 'jest-results/junit.xml'
                        }
                    }
                }
                stage('E2E') {
                    agent {
                        docker {
                            image 'my-playwright'
                            reuseNode true
                        }
                    }
                    steps {
                        sh '''
                            serve -s build &
                            sleep 10
                            npx playwright test --reporter=html
                        '''
                    }
                    post {
                        always {
                            publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, icon: '', keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Playwright local', reportTitles: '', useWrapperFileDirectly: true])
                        }
                    }
                }
            }
        }
        stage('Deploy staging') {
            agent {
                docker {
                    image 'my-playwright'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    set -e

                    netlify --version
                    echo "Deploying to staging..."

                    # IMPORTANT: non-interactive deploy
                    netlify deploy \
                    --dir=build \
                    --site=$NETLIFY_SITE_ID \
                    --auth=$NETLIFY_AUTH_TOKEN \
                    --json > staging-deploy-output.json

                    # extract URL
                    export CI_ENVIRONMENT_URL=$(jq -r '.deploy_url' staging-deploy-output.json)
                    echo "Staging URL: $CI_ENVIRONMENT_URL"

                    # run tests against deployed URL
                    npx playwright test \
                    --base-url=$CI_ENVIRONMENT_URL \
                    --reporter=html \
                    --workers=1 \
                    --timeout=60000
                '''
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        keepAll: false,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright E2E staging'
                    ])
                }
            }
        }

        stage('Deploy Prod') {
            agent {
                docker {
                    image 'my-playwright'
                    reuseNode true
                }
            }
            environment {
                CI_ENVIRONMENT_URL = 'https://catchthatbug.netlify.app'
            }
            steps {
                sh '''
                    netlify --version
                    echo "Deploying to production Site ID : $NETLIFY_SITE_ID"
                    netlify status
                    netlify deploy --dir=build --prod
                    npx playwright test --reporter=html
                '''
            }
            post {
                always {
                    publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, icon: '', keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Playwright E2E Prod', reportTitles: '', useWrapperFileDirectly: true])
                }
            }
        }
    }

}
