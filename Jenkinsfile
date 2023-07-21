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
            sh "sed -i 's#image: abirelhajahmed/frontend.*#image: ${newImageTag}#g' backend-deployement.yaml"

            // Commit and push the changes using the git credentials
            withCredentials([usernamePassword(credentialsId: 'github', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
              sh 'git config --global user.email "abirelhajahmed@gmail.com"'
              sh 'git config --global user.name "abirelhajahmed"'
              sh 'git add backend-deployement.yaml'
              sh 'git commit -m "Update image tag"'
              sh "git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/abirelhajahmed/deployement-files.git main"
            }
          }
        }
      }

  }
}
