pipeline {
    agent any
    parameters {
        string(name: 'USERNAME', defaultValue: 'defaultUser', description: 'Enter your username')
        password(name: 'PASSWORD', description: 'Enter your password')
    }
    stages {
        stage('Clone Repository') {
            steps {
                deleteDir()  // Clean workspace before fetching
                git branch: 'main', url: 'https://github.com/Jayrane03/Task_Manager', credentialsId: 'Jenkins-integration'
            }
        }
        stage('Install Dependencies') {
            steps {
                echo "Installing backend dependencies as user: ${params.USERNAME}"
                dir('backend') {
                    bat 'npm install'
                }
                echo "Installing frontend dependencies..."
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
        echo 'Skipping frontend tests (no test script defined)'
    }
}

        stage('Deploy') {
            steps {
                echo "Deploying the application with username: ${params.USERNAME}"
                // Add deployment commands if needed.
            }
        }
    }
}