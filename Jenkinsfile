pipeline {
  environment {
    frontendImageName = "abirelhajahmed/frontend"
    frontendImageTag = "${BUILD_NUMBER}"
  }

  agent any

  stages {
    // ... (Previous stages remain unchanged)

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
            
            // Attempt to read the contents of front-deployment.yaml
            sh 'cat front-deployment.yaml'
            
            // Replace the image tag in the YAML file
            def newImageTag = "${frontendImageName}:${frontendImageTag}"
            sh "sed -i 's#image: abirelhajahmed/frontend.*#image: ${newImageTag}#g' front-deployment.yaml"

            // Commit and push the changes
            sh 'git config --global user.email "abirelhajahmed@gmail.com"'
            sh 'git config --global user.name "abirelhajahmed"'
            sh 'git add front-deployment.yaml'
            sh 'git commit -m "Update image tag"'
            sh 'git push origin main'
          }
        }
      }
    }
  }
}
