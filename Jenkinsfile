pipeline {
    agent any
    
    tools {
        nodejs '14.21.3'
    }

    stages {
        stage ('Build') {
            steps {
                sh 'cd /home/client-laraigo'
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Test'){
            steps {
                sh 'aws --endpoint-url https://s3.us-south.cloud-object-storage.appdomain.cloud s3 ls'
            }
        }
        stage ('Deploy') {
            steps {
                sh 'echo aqui prepararemos el deploy'
            }
        }
    }
}
