pipeline{

    agent any

    stages{
        stage('Checkout SCM'){
            steps {
                git branch: 'main', url: 'https://github.com/abirelhajahmed/code-app.git'
            }
        }
        stage('Build') {
            steps {
                sh 'npm install' 
            }
         }
    }
}