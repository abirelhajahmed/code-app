pipeline {
    agent any

    stages {
        stage('Checkout SCM') {
            steps {
                git branch: 'main', url: 'https://github.com/abirelhajahmed/code-app.git'
            }
        }

        stage('Build') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            environment {
                MONGO_URI = sh(script: 'echo $MONGO_URI', returnStdout: true).trim()
            }
            steps {
                sh 'npx mocha tests/user.test.js'
            }
        }
    }
}
