package com.example.boafaqchatbot.rpa;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "uipath")
public class UiPathProperties {
    private boolean enabled;
    private String baseUrl;
    private String account;
    private String tenant;
    private String clientId;
    private String clientSecret;
    private String folderId;
    private String releaseKey;

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public String getBaseUrl() { return baseUrl; }
    public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }

    public String getAccount() { return account; }
    public void setAccount(String account) { this.account = account; }

    public String getTenant() { return tenant; }
    public void setTenant(String tenant) { this.tenant = tenant; }

    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }

    public String getClientSecret() { return clientSecret; }
    public void setClientSecret(String clientSecret) { this.clientSecret = clientSecret; }

    public String getFolderId() { return folderId; }
    public void setFolderId(String folderId) { this.folderId = folderId; }

    public String getReleaseKey() { return releaseKey; }
    public void setReleaseKey(String releaseKey) { this.releaseKey = releaseKey; }
}

