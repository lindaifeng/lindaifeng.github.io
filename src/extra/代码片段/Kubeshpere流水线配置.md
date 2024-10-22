---
title: Kubeshpere流水线配置
---


```yaml
    pipeline {
        agent {
        node {
        label 'maven'
        }
    
    }
        stages {
        stage('代码检出') {
        agent none
        steps {
    git(branch: 'dev', url: 'http://47.110.61.65/devops-studio/gateway-hub.git', credentialsId: 'github-id', changelog: true, poll: false)
    }
    }
        
        stage('集成测试环境制品构建') {
        agent none
        steps {
        container('maven') {
    withCredentials([usernamePassword(credentialsId : 'dockerhub-id' ,passwordVariable : 'DOCKER_PASSWORD' ,usernameVariable : 'DOCKER_USERNAME' ,)]) {
                                                                                             sh 'echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin'
    }
        
        sh 'mvn clean package  -P k8s -Dmaven.test.skip=true  dockerfile:build dockerfile:push'
    }
    
    }
    }
        
        stage('发布测试环境') {
        agent none
        steps {
        container('maven') {
        withCredentials([
        kubeconfigFile(
    credentialsId: env.KUBECONFIG_CREDENTIAL_ID,
    variable: 'KUBECONFIG')
    ]) {
        sh 'kubectl rollout restart deployments/devops-system-v1 -n $ENV_NUMBER'
        sh 'kubectl rollout restart deployments/devops-workflow-core-v1 -n $ENV_NUMBER'
        sh 'kubectl rollout restart deployments/gateway-main-service-v1 -n $ENV_NUMBER'
        sh 'kubectl rollout restart deployments/gateway-api-service-v1 -n $ENV_NUMBER'
        sh 'kubectl rollout restart deployments/gateway-app-service-v1 -n $ENV_NUMBER'
        sh 'kubectl rollout restart deployments/gateway-business-v1 -n $ENV_NUMBER'
        sh 'kubectl rollout restart deployments/gateway-bootstrap-v1 -n $ENV_NUMBER'
        sh 'kubectl rollout restart deployments/gateway-upstream-service-v1 -n $ENV_NUMBER'
    }
    
    }
    
    }
    }
    
    }
        environment {
        DOCKER_CREDENTIAL_ID = 'dockerhub-id'
        KUBECONFIG_CREDENTIAL_ID = 'kubeconfig-id'
        REGISTRY = '192.168.179.188:8080'
        DOCKERHUB_NAMESPACE = 'zhongzhi'
        DOCKER_USERNAME = 'admin'
        DOCKER_PASSWORD = 'Basedept8023.'
        ENV_NUMBER = 'gateway-new'
    }
    }
```

