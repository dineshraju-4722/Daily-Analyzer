# -------- Stage 1: Build JAR with Gradle --------
FROM gradle:8.5-jdk21 AS build

WORKDIR /app

# Copy source code
COPY . .

# Build the project
RUN gradle build --no-daemon -x test

# -------- Stage 2: Run the JAR with OpenJDK --------
FROM eclipse-temurin:21-jdk
WORKDIR /app

# Copy JAR from previous stage
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]