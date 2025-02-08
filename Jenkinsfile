pipeline {
    agent any
    stages {
        stage('Clone Repository') {
            steps {
                deleteDir()  // Clean workspace before fetching
                git branch: 'main', url: 'https://github.com/Jayrane03/Task_Manager', credentialsId: 'your-correct-credential-id'
            }
        }
        stage('Install Dependencies') {
            steps {
                echo 'Installing backend dependencies...'
                dir('bakend') {
                    // Install backend dependencies
                    bat 'npm install'
                }
                echo 'Installing frontend dependencies...'
                dir('frontned') {
                    // Install frontend dependencies
                    bat 'npm install'
                }
            }
        }
        stage('Build') {
            steps {
                echo 'Building backend...'
                dir('bakend') {
                    // Run backend build command if available
                    bat 'npm run build'
                }
                echo 'Building frontend...'
                dir('frontned') {
                    // Run frontend build command if available
                    bat 'npm run build'
                }
            }
        }
        stage('Test') {
            steps {
                echo 'Testing backend...'
                dir('bakend') {
                    // Run backend tests
                    bat 'npm test'
                }
                echo 'Testing frontend...'
                dir('frontned') {
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
