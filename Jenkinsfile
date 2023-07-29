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

        stage('Remove Frontend Image') {
            steps {
                sh "docker rmi ${frontendImageName}:${frontendImageTag}"
            }
        }

        stage('Update Image Tag in External Repo') {
            steps {
                script {
                    // Check if the external repository is already cloned
                    if (!fileExists("deployement-files")) {
                        sh 'git clone https://github.com/abirelhajahmed/deployement-files.git deployement-files'
                    }
                    dir("deployement-files") {
                        // Replace the image tag in the YAML file
                        def newImageTag = "${frontendImageName}:${frontendImageTag}"
                        sh "sed -i 's#image: abirelhajahmed/frontend.*#image: ${newImageTag}#g' front-deployement.yaml"

                        // Configure Git user for the local repository
                        sh 'git config user.email "abirelhajahmed@gmail.com"'
                        sh 'git config user.name "abirelhajahmed"'

                        // Commit the changes
                        sh 'git add front-deployement.yaml'
                        sh 'git commit -m "Update image tag"'

                        // Fetch the latest changes from the remote 'main' branch
                        sh 'git fetch origin'

                        // Rebase the current branch on top of the latest 'main'
                        def rebaseResult = sh(script: 'git rebase origin/main', returnStatus: true)

                        // Handle conflicts automatically by force-pushing
                        if (rebaseResult != 0) {
                            sh 'git rebase --abort' // Abort the failed rebase
                            sh 'git pull --rebase origin main' // Pull the latest changes
                            sh 'git push -f origin HEAD:main' // Force-push the changes
                        } else {
                            // Push the changes to the remote repository
                            withCredentials([usernamePassword(credentialsId: 'github', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD')]) {
                                sh "git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/abirelhajahmed/deployement-files.git main"
                            }
                        }
                    }
                }
            }
        }
    }
}
