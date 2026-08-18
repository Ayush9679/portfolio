"""Tests for the message submission endpoint (/api/messages and /api/contact)."""

VALID_PAYLOAD = {
    "sender": "Ayush Dubey",
    "channel": "ayush@example.com",
    "payload": "Testing the dispatch system with a valid message payload.",
}


def test_message_submission_success(client):
    response = client.post("/api/messages", json=VALID_PAYLOAD)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["sender"] == VALID_PAYLOAD["sender"]
    assert data["data"]["channel"] == VALID_PAYLOAD["channel"]
    assert data["data"]["payload"] == VALID_PAYLOAD["payload"]
    assert "id" in data["data"]
    assert data["data"]["status"] == "received"
    assert data["data"]["read"] is False


def test_contact_alias_submission_success(client):
    response = client.post("/api/contact", json=VALID_PAYLOAD)
    assert response.status_code == 201
    assert response.json()["success"] is True


def test_message_missing_sender(client):
    payload = {**VALID_PAYLOAD, "sender": ""}
    response = client.post("/api/messages", json=payload)
    assert response.status_code == 422


def test_message_missing_channel(client):
    payload = {**VALID_PAYLOAD, "channel": ""}
    response = client.post("/api/messages", json=payload)
    assert response.status_code == 422


def test_message_payload_too_short(client):
    payload = {**VALID_PAYLOAD, "payload": "Hi"}
    response = client.post("/api/messages", json=payload)
    assert response.status_code == 422


def test_message_missing_fields(client):
    response = client.post("/api/messages", json={})
    assert response.status_code == 422
