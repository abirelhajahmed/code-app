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
                script {
                    sh "docker build -t ${frontendImageName}:${frontendImageTag} ."
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
                    if (!fileExists("deployment-files")) {
                        sh 'git clone https://github.com/abirelhajahmed/deployement-files.git deployment-files'
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
                            sh "git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/abirelhajahmed/deployement-files.git main"
                        }
                    }
                }
            }
        }
    }
}
