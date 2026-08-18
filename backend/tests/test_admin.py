"""Tests for protected admin endpoints."""

MESSAGE_PAYLOAD = {
    "sender": "Admin Test User",
    "channel": "admintest@example.com",
    "payload": "Testing the admin endpoints with this message payload.",
}


def test_admin_stats_requires_auth(client):
    response = client.get("/api/admin/stats")
    assert response.status_code == 403


def test_admin_messages_requires_auth(client):
    response = client.get("/api/messages")
    assert response.status_code == 403


def test_admin_stats_with_valid_token(client, auth_headers):
    response = client.get("/api/admin/stats", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "messages" in data
    assert "unread_messages" in data
    assert "database" in data
    assert data["database"]["type"] == "SQLite"


def test_admin_messages_list(client, auth_headers):
    # Submit a message first
    client.post("/api/messages", json=MESSAGE_PAYLOAD)
    response = client.get("/api/messages", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)
    assert data["total"] >= 1


def test_admin_message_get_detail(client, auth_headers):
    client.post("/api/messages", json=MESSAGE_PAYLOAD)
    msgs = client.get("/api/messages", headers=auth_headers).json()["data"]
    assert len(msgs) > 0
    msg_id = msgs[0]["id"]

    response = client.get(f"/api/messages/{msg_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["data"]["id"] == msg_id


def test_admin_mark_message_read(client, auth_headers):
    client.post("/api/messages", json=MESSAGE_PAYLOAD)
    msgs = client.get("/api/messages", headers=auth_headers).json()["data"]
    assert len(msgs) > 0
    msg_id = msgs[0]["id"]

    response = client.patch(
        f"/api/messages/{msg_id}",
        json={"read": True, "status": "reviewed"},
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["data"]["read"] is True
    assert response.json()["data"]["status"] == "reviewed"


def test_admin_delete_message(client, auth_headers):
    client.post("/api/messages", json=MESSAGE_PAYLOAD)
    msgs = client.get("/api/messages", headers=auth_headers).json()["data"]
    msg_id = msgs[0]["id"]

    response = client.delete(f"/api/messages/{msg_id}", headers=auth_headers)
    assert response.status_code in [200, 204]


def test_admin_invalid_token(client):
    response = client.get(
        "/api/admin/stats",
        headers={"Authorization": "Bearer invalid-token-here"},
    )
    assert response.status_code == 401


def test_admin_get_nonexistent_message(client, auth_headers):
    response = client.get("/api/messages/999999", headers=auth_headers)
    assert response.status_code == 404
