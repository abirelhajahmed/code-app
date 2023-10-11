pipeline {
    environment {
        frontendImageName = "abirelhajahmed/frontend"
        frontendImageTag = "${BUILD_NUMBER}"
    }

    agent any

    stages {
        stage('Checkout SCM') {
            steps {
                git branch: 'front', url: 'https://github.com/abirelhajahmed/code-app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('client') {
                    sh 'npm install'
                }
            }
        }

        stage('Sonarqube Code Analysis') {
            steps {
                dir('client') {
                    sh 'npm run sonar'
                }
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

        stage('Remove Frontend Docker Image') {
            steps {
                sh "docker rmi ${frontendImageName}:${frontendImageTag}"
            }
        }

        stage('Update Image Tag in Frontend External Repo') {
            steps {
                script {
                    def frontendImageTag = "${BUILD_NUMBER}"
                    def newImageTag = "${frontendImageName}:${frontendImageTag}"

                    // Check if the external repository is already cloned
                    if (!fileExists("Gitops-project")) {
                        sh 'git clone https://github.com/abirelhajahmed/Gitops-project.gitt Gitops-project'
                    }

                    dir("deployment-files") {
                        sh "sed -i 's#image: abirelhajahmed/frontend.*#image: ${newImageTag}#g' front-deployement.yaml"

                        withCredentials([usernamePassword(credentialsId: 'github', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
                            sh 'git config --global user.email "abirelhajahmed@gmail.com"'
                            sh 'git config --global user.name "abirelhajahmed"'
                            sh 'git add front-deployement.yaml'
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


