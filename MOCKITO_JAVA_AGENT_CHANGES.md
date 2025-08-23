# Mockito Java Agent Configuration Changes

## Issue Description

Mockito was previously self-attaching to enable the inline-mock-maker. This behavior will no longer work in future releases of the JDK, as indicated by the following warnings:

```
WARNING: A Java agent has been loaded dynamically (C:\Users\donal\.m2\repository\net\bytebuddy\byte-buddy-agent\1.17.6\byte-buddy-agent-1.17.6.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
Java HotSpot(TM) 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
```

## Solution Implemented

To resolve this issue, we added Mockito as a Java agent to the Maven build configuration by adding the `maven-surefire-plugin` configuration to the project's `pom.xml`:

```xml
<!-- Surefire Plugin Configuration -->
<plugin>
    <artifactId>maven-surefire-plugin</artifactId>
    <configuration>
        <argLine>
            -javaagent:${settings.localRepository}/org/mockito/mockito-core/5.17.0/mockito-core-5.17.0.jar
        </argLine>
    </configuration>
</plugin>
```

This configuration specifies the path to the Mockito JAR file in the local Maven repository, using the same version (5.17.0) that is already a dependency in the project.

## Verification

After implementing this change, all tests were executed using `mvn test` and passed successfully without any warnings about dynamic Java agent loading.

## Why This Change Was Necessary

Future releases of the JDK will disallow dynamic loading of Java agents by default, which would cause Mockito's inline mock maker to fail. By explicitly configuring Mockito as a Java agent in the Maven build, we ensure compatibility with future JDK releases and prevent potential test failures or unexpected behavior.

This change follows the recommendation in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html#0.3