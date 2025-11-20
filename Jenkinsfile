pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'divyanshidetroja'  // Docker Hub username
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Backend Image') {
            steps {
                script {
                    dir('backend') {
                        sh '''
                            docker build -t ${DOCKER_REGISTRY}/hw3-survey-backend:${IMAGE_TAG} .
                            docker tag ${DOCKER_REGISTRY}/hw3-survey-backend:${IMAGE_TAG} ${DOCKER_REGISTRY}/hw3-survey-backend:latest
                        '''
                    }
                }
            }
        }
        
        stage('Build Frontend Image') {
            steps {
                script {
                    dir('frontend') {
                        sh '''
                            docker build -t ${DOCKER_REGISTRY}/hw3-survey-frontend:${IMAGE_TAG} .
                            docker tag ${DOCKER_REGISTRY}/hw3-survey-frontend:${IMAGE_TAG} ${DOCKER_REGISTRY}/hw3-survey-frontend:latest
                        '''
                    }
                }
            }
        }
        
        stage('Push Images') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh '''
                            echo ${DOCKER_PASS} | docker login docker.io -u ${DOCKER_USER} --password-stdin
                            docker push ${DOCKER_REGISTRY}/hw3-survey-backend:${IMAGE_TAG}
                            docker push ${DOCKER_REGISTRY}/hw3-survey-backend:latest
                            docker push ${DOCKER_REGISTRY}/hw3-survey-frontend:${IMAGE_TAG}
                            docker push ${DOCKER_REGISTRY}/hw3-survey-frontend:latest
                        '''
                    }
                }
            }
        }
        
        stage('Update Kubernetes Manifests') {
            steps {
                script {
                    sh '''
                        # Update image tags in Kubernetes manifests
                        sed -i "s|divyanshidetroja/hw3-survey-backend:latest|${DOCKER_REGISTRY}/hw3-survey-backend:${IMAGE_TAG}|g" k8s/backend-deployment.yaml
                        sed -i "s|divyanshidetroja/hw3-survey-frontend:latest|${DOCKER_REGISTRY}/hw3-survey-frontend:${IMAGE_TAG}|g" k8s/frontend-deployment.yaml
                    '''
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                        withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                            sh '''
                                export KUBECONFIG=${KUBECONFIG}
                                # Apply Kubernetes manifests
                                kubectl apply -f k8s/namespace.yaml
                                kubectl apply -f k8s/secrets.yaml
                                kubectl apply -f k8s/mysql-deployment.yaml
                                kubectl apply -f k8s/backend-deployment.yaml
                                kubectl apply -f k8s/frontend-deployment.yaml
                                
                                # Wait for deployments to be ready
                                kubectl wait --for=condition=available --timeout=300s deployment/backend-deployment -n survey-app
                                kubectl wait --for=condition=available --timeout=300s deployment/frontend-deployment -n survey-app
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                        withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                            sh '''
                                export KUBECONFIG=${KUBECONFIG}
                                # Check if pods are running
                                kubectl get pods -n survey-app
                                
                                # Check services
                                kubectl get svc -n survey-app
                            '''
                        }
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline succeeded!'
            // Add notification here (email, Slack, etc.)
        }
        failure {
            echo 'Pipeline failed!'
            // Add notification here
        }
    }
}

