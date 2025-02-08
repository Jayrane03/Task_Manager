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
                dir('backend') {
                    bat 'npm install'
                }
                echo 'Installing frontend dependencies...'
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }
        stage('Build') {
            steps {
                echo 'Building backend...'
                // Remove or comment out the backend build command if not needed:
                // dir('backend') {
                //     bat 'npm run build'
                // }
                echo 'Building frontend...'
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }
        stage('Test') {
            steps {
                echo 'Testing backend...'
                dir('backend') {
                    bat 'npm test'
                }
                echo 'Testing frontend...'
                dir('frontend') {
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
