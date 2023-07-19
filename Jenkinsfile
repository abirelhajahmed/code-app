pipeline {
  environment {
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

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Build Frontend Docker Image') {
      steps {
        dir('client') {
          script {
            sh "docker build -t ${frontendImageName}:${frontendImageTag} ."
          }
        }
      }
    }

    stage('Push Frontend Docker Image') {
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
            sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
            sh "docker push ${frontendImageName}:${frontendImageTag}"
          }
        }
      }
    }

    stage('Remove Frontend and Backend Docker Images') {
      steps {
        sh "docker rmi ${frontendImageName}:${frontendImageTag}"
      }
    }

  }
}