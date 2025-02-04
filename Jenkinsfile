pipeline {
    agent any
    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/Jayrane03/Task_Manager'
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
