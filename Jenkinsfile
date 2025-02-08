pipeline {
    agent any
    stages {
        stage('Clone Repository') {
            steps {
                deleteDir()  // Clean workspace before fetching
                git branch: 'main', url: 'https://github.com/Jayrane03/Task_Manager', credentialsId: 'Jayrane03'
            }
        }
        stage('Install Dependencies') {
            steps {
                bat 'npm install'  // Install dependencies
            }
        }
        stage('Build') {
            steps {
                bat 'npm run build'  // Build the project (if required)
            }
        }
        stage('Test') {
            steps {
                bat 'npm test'  // Run tests for MERN app (if applicable)
                // Uncomment if you also have Python tests
                // bat 'python -m unittest'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying the application...'
                // Add deployment steps here if needed
            }
        }
    }
}
