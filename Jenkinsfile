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

    stage('Update Image Tag in External Repo') {
      steps {
        script {
          // Print the current working directory
          sh 'pwd'
      
          // Check if the external repository is already cloned
          if (!fileExists("deployement-files")) {
            sh 'git clone https://github.com/abirelhajahmed/deployement-files.git deployement-files'
          }
          dir("deployement-files") {
            // Print the contents of the directory to verify if the file exists
            sh 'ls -la'
            
            // Replace the image tag in the YAML file
            def newImageTag = "${frontendImageName}:${frontendImageTag}"
            sh "sed -i 's#image: abirelhajahmed/frontend.*#image: ${newImageTag}#g' front-deployement.yaml"

            // Commit and push the changes
            sh 'git config --global user.email "abirelhajahmed@gmail.com"'
            sh 'git config --global user.name "abirelhajahmed"'
            sh 'git add front-deployement.yaml'
            sh 'git commit -m "Update image tag"'
            sh 'git push origin main'
          }
        }
      }
    }
  }
}
