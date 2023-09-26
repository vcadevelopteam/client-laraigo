pipeline {
    agent any

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
                sh 'echo aqui va los test'
            }
        }
        stage ('Deploy') {
            steps {
                sh 'echo aqui prepararemos el deploy'
            }
        }
    }
}
