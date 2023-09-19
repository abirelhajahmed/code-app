pipeline {
  environment {
    backendImageName = "abirelhajahmed/backend"
    backendImageTag = "${BUILD_NUMBER}"
  }

  agent any

  stages {
    stage('Checkout SCM') {
      steps {
        git branch: 'back', url: 'https://github.com/abirelhajahmed/code-app.git'
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'npm install'
      }
    }
    
    stage('Sonarqube code analysis') {
      steps {
        sh 'npm run sonar'
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
            def newImageTag = "${backendImageName}:${backendImageTag}"
            sh "sed -i 's#image: abirelhajahmed/backend.*#image: ${newImageTag}#g' backend-deployement.yaml"

            // Commit and push the changes using the git credentials
            withCredentials([usernamePassword(credentialsId: 'github', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
              sh 'git config --global user.email "abirelhajahmed@gmail.com"'
              sh 'git config --global user.name "abirelhajahmed"'
              sh 'git add backend-deployement.yaml'
              sh 'git commit -m "Update image tag"'
               // Pull the latest changes from the remote 'main' branch
              sh 'git pull origin main'
              sh "git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/abirelhajahmed/deployement-files.git main"
            }
          }
        }
      }
    }
  }

  post {
    always {
      // This block will be executed regardless of the build result
      echo 'Pipeline completed'
    }
    
    success {
      // This block will be executed if the pipeline succeeds
      script {
        sendEmailNotification('SUCCESSFUL')
      }
    }
    
    failure {
      // This block will be executed if the pipeline fails
      script {
        sendEmailNotification('FAILED')
      }
    }
  }
}

def sendEmailNotification(buildStatus) {
  emailext (
    subject: "CI Pipeline Execution Result",
    body: """${buildStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':
    Check console output at ${env.BUILD_URL}""",
    to: 'abirelhajahmed@gmail.com', 
    attachLog: true 
  )
}
