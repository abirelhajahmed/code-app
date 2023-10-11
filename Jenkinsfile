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
            def backendImageTag = "${BUILD_NUMBER}"
            def newImageTag = "${backendImageName}:${backendImageTag}"

            // Clone the external repository
            sh 'git clone https://github.com/abirelhajahmed/Gitops-project.git Gitops-project '

            dir("Gitops-project") {
                dir("app") {
                    // Update the image tag in the 'backend-deployment.yaml' file
                    sh "sed -i 's#image: abirelhajahmed/backend.*#image: ${newImageTag}#g' backend-deployement.yaml"
                }

                withCredentials([usernamePassword(credentialsId: 'github', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
                    sh 'git config --global user.email "abirelhajahmed@gmail.com"'
                    sh 'git config --global user.name "abirelhajahmed"'
                    sh 'git add app/backend-deployement.yaml'
                    sh 'git commit -m "Update image tag"'

                    // Pull the latest changes from the remote 'main' branch
                    sh 'git pull origin main'

                    // Push the changes to the remote repository
                    sh "git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/abirelhajahmed/Gitops-project.git main"
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
