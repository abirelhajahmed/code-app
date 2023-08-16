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
                sh 'npm install'
            }
        }

        stage('Sonarqube code analysis') {
            steps {
                dir('client') {
                    sh 'npm run sonar'
                }
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                dir('client') {
                    script {
                        def frontendImageTag = "${BUILD_NUMBER}"
                        def dockerImage = "${frontendImageName}:${frontendImageTag}"
                        
                        sh "docker build -t ${dockerImage} ."
                        withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                            sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                            sh "docker push ${dockerImage}"
                        }
                    }
                }
            }
        }

        stage('Update Image Tag in External Repo') {
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
