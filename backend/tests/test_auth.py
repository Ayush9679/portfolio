"""Tests for admin authentication."""


def test_login_success(client):
    response = client.post(
        "/api/admin/login",
        json={"username": "testadmin", "password": "testpassword123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_alias_success(client):
    response = client.post(
        "/admin/login",
        json={"username": "testadmin", "password": "testpassword123"},
    )
    assert response.status_code == 200


def test_login_wrong_password(client):
    response = client.post(
        "/api/admin/login",
        json={"username": "testadmin", "password": "wrongpassword"},
    )
    assert response.status_code == 401


def test_login_wrong_username(client):
    response = client.post(
        "/api/admin/login",
        json={"username": "notreal", "password": "testpassword123"},
    )
    assert response.status_code == 401


def test_login_missing_fields(client):
    response = client.post("/api/admin/login", json={})
    assert response.status_code == 422
