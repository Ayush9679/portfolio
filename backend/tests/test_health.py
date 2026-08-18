"""Tests for the health endpoint."""


def test_health_returns_ok(client):
    response = client.get("/api/health")
    assert response.status_code == 200


def test_health_response_structure(client):
    response = client.get("/api/health")
    data = response.json()
    assert "status" in data
    assert "api" in data
    assert "database" in data
    assert "version" in data
    assert "uptime_seconds" in data
    assert "records" in data


def test_health_status_is_ok(client):
    response = client.get("/api/health")
    assert response.json()["status"] == "ok"
    assert response.json()["api"] == "online"


def test_health_database_connected(client):
    response = client.get("/api/health")
    assert response.json()["database"] == "connected"


def test_health_uptime_is_positive(client):
    response = client.get("/api/health")
    assert response.json()["uptime_seconds"] >= 0
