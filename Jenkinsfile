pipeline {
  agent any
  stages {
    stage('Build') {
      parallel {
        stage('Build on Prod') {
          steps {
            build 'michael-bruno-fyi-prod-build'
          }
        }
        stage('Build on Jenkins') {
          steps {
            sh 'yarn install; ng build --prod --build-optimizer'
          }
        }
      }
    }
    stage('Deploy') {
      steps {
        build 'michael-bruno-fyi-prod-deploy'
      }
    }
  }
}
