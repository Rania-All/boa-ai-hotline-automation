package com.example.boafaqchatbot.rpa;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
public class UiPathOrchestratorClient {

    private final UiPathProperties props;
    private final WebClient web;

    public UiPathOrchestratorClient(UiPathProperties props, WebClient.Builder builder) {
        this.props = props;
        this.web = builder
                .baseUrl(props.getBaseUrl() == null ? "" : props.getBaseUrl())
                .build();
    }

    public record StartJobResult(String jobKey, String state, String message) {}

    /**
     * Cloud Orchestrator: expects baseUrl like:
     * https://cloud.uipath.com/{account}/{tenant}/orchestrator_
     *
     * Token endpoint (cloud): https://cloud.uipath.com/identity_/connect/token
     */
    public StartJobResult startJob(Map<String, Object> inputArguments) {
        if (!props.isEnabled()) {
            return new StartJobResult(null, "DISABLED", "UiPath est désactivé (uipath.enabled=false).");
        }

        String token = fetchAccessToken();

        Map<String, Object> body = Map.of(
                "startInfo", Map.of(
                        "ReleaseKey", props.getReleaseKey(),
                        "Strategy", "Specific",
                        "RobotIds", List.of(),
                        "NoOfRobots", 0,
                        "InputArguments", JsonMini.stringify(inputArguments),
                        "JobsCount", 1
                )
        );

        // Folder header for modern Orchestrator
        String folderId = props.getFolderId();

        Map<?, ?> res = web.post()
                .uri("/odata/Jobs/UiPath.Server.Configuration.OData.StartJobs")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .header("X-UIPATH-OrganizationUnitId", folderId == null ? "" : folderId)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .block(Duration.ofSeconds(20));

        // Best-effort parsing (schema differs by version)
        String jobKey = null;
        String state = "STARTED";
        if (res != null && res.get("value") instanceof List<?> list && !list.isEmpty() && list.get(0) instanceof Map<?, ?> first) {
            Object key = first.get("Key");
            if (key != null) jobKey = key.toString();
            Object s = first.get("State");
            if (s != null) state = s.toString();
        }

        return new StartJobResult(jobKey, state, "Job démarré");
    }

    public Map<?, ?> getJobStatus(String jobKey) {
        if (!props.isEnabled()) {
            return Map.of("enabled", false, "state", "DISABLED");
        }
        String token = fetchAccessToken();
        String folderId = props.getFolderId();
        return web.get()
                .uri("/odata/Jobs?$filter=Key eq " + quote(jobKey))
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .header("X-UIPATH-OrganizationUnitId", folderId == null ? "" : folderId)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(Map.class)
                .block(Duration.ofSeconds(20));
    }

    private String fetchAccessToken() {
        // Cloud identity service
        WebClient identity = WebClient.builder()
                .baseUrl("https://cloud.uipath.com")
                .build();

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "client_credentials");
        form.add("client_id", props.getClientId());
        form.add("client_secret", props.getClientSecret());
        form.add("scope", "OR.Folders OR.Jobs");

        Map<?, ?> tokenRes = identity.post()
                .uri("/identity_/connect/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(form)
                .retrieve()
                .bodyToMono(Map.class)
                .block(Duration.ofSeconds(20));

        if (tokenRes == null || tokenRes.get("access_token") == null) {
            throw new IllegalStateException("Impossible d'obtenir un access_token UiPath. Vérifie client-id/client-secret.");
        }
        return tokenRes.get("access_token").toString();
    }

    private static String quote(String s) {
        if (s == null) return "''";
        return "'" + s.replace("'", "''") + "'";
    }

    /**
     * Mini JSON stringifier for InputArguments (UiPath expects a JSON string).
     * Avoids adding a new dependency.
     */
    static class JsonMini {
        static String stringify(Object o) {
            if (o == null) return "null";
            if (o instanceof String s) return "\"" + escape(s) + "\"";
            if (o instanceof Number || o instanceof Boolean) return o.toString();
            if (o instanceof Map<?, ?> m) {
                StringBuilder sb = new StringBuilder();
                sb.append("{");
                boolean first = true;
                for (var e : m.entrySet()) {
                    if (!first) sb.append(",");
                    first = false;
                    sb.append(stringify(String.valueOf(e.getKey()))).append(":").append(stringify(e.getValue()));
                }
                sb.append("}");
                return sb.toString();
            }
            if (o instanceof Iterable<?> it) {
                StringBuilder sb = new StringBuilder();
                sb.append("[");
                boolean first = true;
                for (Object v : it) {
                    if (!first) sb.append(",");
                    first = false;
                    sb.append(stringify(v));
                }
                sb.append("]");
                return sb.toString();
            }
            return stringify(o.toString());
        }

        static String escape(String s) {
            return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
        }
    }
}

