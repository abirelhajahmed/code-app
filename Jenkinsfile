pipeline {
  environment {
    backendImageName = "abirelhajahmed/backend"
    backendImageTag = "${BUILD_NUMBER}"
  }

  agent any

  stages {
    stage('Checkout SCM') {
      steps {
        git branch: 'master', url: 'https://github.com/abirelhajahmed/code-app.git'
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


    stage('Remove backend Docker Image') {
      steps {
        sh "docker rmi ${backendImageName}:${backendImageTag}"
      }
    }

    stage('Update Deployment Files') {
        steps {
            git branch: 'main', url: 'https://github.com/abirelhajahmed/deployment-files.git'
            sh "sed -i 's|{backend_image_name}:{backend_image_tag}|${backendImageName}:${backendImageTag}|' backend-deployment.yaml"
           
  }
}

    stage('Push Deployment Files to Git') {
       steps {
        script {
            git add backend-deployment.yaml
            git commit -m "Update deployment files"
            git push origin main
    }
  }
}

  }
}
