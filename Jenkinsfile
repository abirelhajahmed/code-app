pipeline {
    environment {
        frontendImageName = "abirelhajahmed/frontend"
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

                    if (!fileExists("deployment-files")) {
                        sh 'git clone https://github.com/abirelhajahmed/deployment-files.git deployment-files'
                    }

                    dir("deployment-files") {
                        sh 'ls -la'
                        sh "sed -i 's#image: abirelhajahmed/frontend.*#image: ${newImageTag}#g' front-deployment.yaml"

                        withCredentials([usernamePassword(credentialsId: 'github', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
                            sh 'git config --global user.email "abirelhajahmed@gmail.com"'
                            sh 'git config --global user.name "abirelhajahmed"'
                            sh 'git add front-deployment.yaml'
                            sh 'git commit -m "Update image tag"'
                            sh 'git pull origin main'
                            sh "git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/abirelhajahmed/deployment-files.git main"
                        }
                    }
                }
            }
        }
    }
}
