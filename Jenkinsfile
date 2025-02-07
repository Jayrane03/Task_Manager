pipeline {
    agent any
    stages {
        stage('Clone Repository') {
    steps {
        deleteDir()  // Clean workspace before fetching
        git branch: 'main', url: 'https://github.com/Jayrane03/Task_Manager', credentialsId: 'your-credential-id'
    }
}
        stage('Build') {
            steps {
                bat 'mvn clean package'  // For Java
                bat 'npm install'  // For Web
                bat 'python -m unittest'  // For Python
            }
        }
        stage('Test') {
            steps {
                bat 'mvn test'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying the application...'
            }
        }
    }
}
