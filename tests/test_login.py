import requests

def test_login():
    url = "http://localhost:8000/auth/login"
    # Test with form data (correct way)
    data = {
        "username": "testuser",
        "password": "password123"
    }
    
    try:
        # First register
        reg_url = "http://localhost:8000/auth/register"
        reg_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "password123"
        }
        res = requests.post(reg_url, json=reg_data)
        print(f"Register status: {res.status_code}")
        print(f"Register response: {res.text}")
    except Exception as e:
        print(f"Registration skipped or failed: {e}")

    # Now Login
    try:
        response = requests.post(url, data=data)
        print(f"Login Status: {response.status_code}")
        print(f"Login Response: {response.json()}")
    except Exception as e:
        print(f"Login failed: {e}")

if __name__ == "__main__":
    test_login()
