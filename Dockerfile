FROM openjdk:8-jdk

COPY target/*.jar app.jar

ENTRYPOINT ["java","-jar","app.jar"]