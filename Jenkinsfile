pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION="us-south"
        MY_BUCKET = 'bucket name'
    }
    
    tools {
        nodejs '14.21.3'
    }

    stages {
        stage ('Build') {
            steps {
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
                    sh 'aws --endpoint-url https://s3.us-south.cloud-object-storage.appdomain.cloud s3 rm s3://${env.MY_BUCKET}/ --recursive'
                    sh 'aws --endpoint-url https://s3.us-south.cloud-object-storage.appdomain.cloud s3 cp ./build/ s3://${env.MY_BUCKET}/ --recursive'
                }
            }
        }
    }
}
