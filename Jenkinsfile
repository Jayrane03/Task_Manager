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
                echo 'Installing backend dependencies...'
                dir('backend') {
                    // Install backend dependencies
                    bat 'npm install'
                }
                echo 'Installing frontend dependencies...'
                dir('frontend') {
                    // Install frontend dependencies
                    bat 'npm install'
                }
            }
        }
        stage('Build') {
            steps {
                echo 'Building backend...'
                dir('backend') {
                    // Run backend build command if available
                    bat 'npm run build'
                }
                echo 'Building frontend...'
                dir('frontend') {
                    // Run frontend build command if available
                    bat 'npm run build'
                }
            }
        }
        stage('Test') {
            steps {
                echo 'Testing backend...'
                dir('backend') {
                    // Run backend tests
                    bat 'npm test'
                }
                echo 'Testing frontend...'
                dir('frontend') {
                    // Run frontend tests
                    bat 'npm test'
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying the application...'
                // Add deployment commands if needed.
            }
        }
    }
}
