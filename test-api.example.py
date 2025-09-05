#!/usr/bin/env python3
"""
Example test script for DeepSeek API
Copy this to test-api.py and add your actual API key
"""

from openai import OpenAI

def test_deepseek_api(api_key):
    """Test DeepSeek API with provided key"""
    try:
        client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")
        
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "You are a helpful assistant"},
                {"role": "user", "content": "Hello, can you help me test this API?"},
            ],
            stream=False
        )
        
        print("✅ API test successful!")
        print(f"Response: {response.choices[0].message.content}")
        print(f"Usage: {response.usage}")
        return True
        
    except Exception as e:
        print(f"❌ API test failed: {e}")
        return False

if __name__ == "__main__":
    print("Please create test-api.py with your actual API key:")
    print("""
# test-api.py
from openai import OpenAI

API_KEY = "your_actual_api_key_here"

# ... rest of the test code
""")