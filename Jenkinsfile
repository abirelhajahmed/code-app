pipeline {
    agent any

    stages {
        stage('Checkout SCM') {
            steps {
                git branch: 'main', url: 'https://github.com/abirelhajahmed/code-app.git'
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Backend Tests') {
           steps {
               sh 'npm test'
           }
        }

    }
}
