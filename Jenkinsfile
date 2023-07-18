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

    stage('Push Backend Docker Image') {
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
            sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
            sh "docker push ${backendImageName}:${backendImageTag}"
          }
        }
      }
    }

    stage('Build frontend Docker Image') {
      steps {
        dir('client') {
          script {
            sh "docker build -t ${frontendImageName}:${frontendImageTag} ."
          }
        }
      }
    }

    stage('Push frontend Docker Image') {
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
            sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
            sh "docker push ${frontendImageName}:${frontendImageTag}"
          }
        }
      }
    }

    stage('Remove frontend and backend Docker Images') {
      steps {
        sh "docker rmi ${backendImageName}:${backendImageTag}"
        sh "docker rmi ${frontendImageName}:${frontendImageTag}"
      }
    }

    stage('Update Deployment Files') {
      steps {
        script {
          git branch: 'main', url: 'https://github.com/abirelhajahmed/deployment-files.git'

          sh "sed -i 's|{backend_image_name}:{backend_image_tag}|${backendImageName}:${backendImageTag}|' backend-deployment.yaml"

          sh "sed -i 's|{frontend_image_name}:{frontend_image_tag}|${frontendImageName}:${frontendImageTag}|' frontend-deployment.yaml"
        }
      }
    }

    stage('Push Deployment Files to Git') {
      steps {
        script {
          git config --global user.name "abirelhajahmed"
          git config --global user.email "abirelhajahmed@gmail.com"
          git add backend-deployment.yaml frontend-deployment.yaml
          git commit -m "Update deployment files"
          git push origin main
        }
      }
    }
  }
}
