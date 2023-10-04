pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION="us-south"
    }
    
    tools {
        nodejs '14.21.3'
    }

    stages {
        stage ('Build') {
            steps {
                sh 'cd /home/client-laraigo'
                sh 'git pull feature/RLA386'
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Test'){
            steps {
                withCredentials([aws(accesskeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'cos-laraigo-dev', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY')]){
                    sh 'aws --version'
                    sh 'aws --endpoint-url https://s3.us-south.cloud-object-storage.appdomain.cloud s3 ls'
                }
            }
        }
        stage ('Deploy') {
            steps {
                withCredentials([aws(accesskeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'cos-laraigo-dev', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY')]){
                    sh 'aws --endpoint-url https://s3.us-south.cloud-object-storage.appdomain.cloud s3 rm s3://scanvirus-cos-static-web-hosting-w26/ --recursive'
                    sh 'aws --endpoint-url https://s3.us-south.cloud-object-storage.appdomain.cloud s3 cp /home/client-laraigo/build/ s3://scanvirus-cos-static-web-hosting-w26/ --recursive'
                }
            }
        }
    }
}
