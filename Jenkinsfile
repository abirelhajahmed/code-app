pipeline {
  environment {
    frontendImageName = "abirelhajahmed/frontend"
  }

  agent any

  stages {
    stage('Checkout Code') {
      steps {
        git branch: 'front', url: 'https://github.com/abirelhajahmed/code-app.git'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Build and Push Frontend Docker Image') {
      steps {
        dir('client') {
          script {
            def frontendImageTag = env.BUILD_NUMBER ?: 'latest'
            def frontendImageFullName = "${frontendImageName}:${frontendImageTag}"
            sh "docker build -t ${frontendImageFullName} ."
            withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
              sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
              sh "docker push ${frontendImageFullName}"
            }
          }
        }
      }
    }

    stage('Update Deployment Files') {
      steps {
        git branch: 'main', url: 'https://github.com/abirelhajahmed/deployment-files.git'
        script {
          sh "sed -i 's|{frontend_image_name}:{frontend_image_tag}|${frontendImageName}:${env.BUILD_NUMBER}|' frontend-deployment.yaml"
        }
      }
    }

    stage('Push Deployment Files to Git') {
      steps {
        script {
          git add 'frontend-deployment.yaml'
          git commit -m "Update deployment files for frontend image - ${env.BUILD_NUMBER}"
          git push origin main
        }
      }
    }
  }
}
