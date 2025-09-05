#!/usr/bin/env python3
"""
Test script to verify your DeepSeek API key works
Install: pip3 install openai
"""

from openai import OpenAI

# Replace with your actual API key
API_KEY = "sk-aa145a037ec640689c92c09e38c24af0"

def test_deepseek_api():
    try:
        client = OpenAI(api_key=API_KEY, base_url="https://api.deepseek.com")
        
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
    test_deepseek_api()