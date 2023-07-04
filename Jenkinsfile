pipeline {
    environment {
    backendImageName = "abirelhajahmed/backend"
    backendImageTag = "${BUILD_NUMBER}"
    frontendImageName = "abirelhajahmed/frontend"
    frontendImageTag = "${BUILD_NUMBER}"
  }

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

        stage('Backend Test') {
           steps {
               sh 'npm test'
           }
        }

        stage('Build Backend Docker Image') {
           steps {
             script {
                sh "docker build -t ${backendImageName}:${backendImageTag} ."
        }
      }
    }

    }
}
