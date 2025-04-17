
# Code Commenter AI

This project provides an automatic code commenter that generates understandable comments and useful suggestions for your code. It uses Google's Gemini AI API to analyze code and provide insights in a way that's easy for everyone to understand.

## Features

- 🔍 **Automatic language detection** - Works with Python, JavaScript, Java, C++, and more
- 💬 **User-friendly code comments** - Explains what the code does in simple terms
- 💡 **Improvement suggestions** - Provides actionable tips to make your code better
- 🎨 **Clean, modern UI** - Easy-to-use interface for both developers and non-developers
- 📋 **Copy-to-clipboard** - Easily copy results to use in your projects
- 📱 **Responsive design** - Works on desktop and mobile devices

## Project Structure

This project has two main components:

1. **Frontend React Application**: A demo UI that shows how the application works
2. **Python Backend**: The actual code analysis engine using Streamlit and Google's Gemini API

## Running the Python Backend

To run the actual code commenting system:

1. Navigate to the `src/python-backend` directory
2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the Streamlit app:
   ```
   streamlit run app.py
   ```
4. Open your browser to the URL provided by Streamlit (typically http://localhost:8501)

## How It Works

1. **Language Detection**: The system detects the programming language of your code
2. **AI Analysis**: Google's Gemini API analyzes the code structure and patterns
3. **Comment Generation**: AI generates clear, human-readable comments that explain what the code does
4. **Suggestion Creation**: The system provides useful suggestions to improve code quality

## API Key Security

The Gemini API key in this demo is for demonstration purposes only. In a production environment:

- Store API keys as environment variables
- Use secure vaults or secret management systems
- Consider implementing a server-side API to protect your keys

## Limitations

- The quality of analysis depends on the complexity and clarity of the provided code
- Very large code files may need to be analyzed in smaller sections
- Some language-specific optimizations might not be detected

## Future Improvements

- Add support for more programming languages
- Implement full code refactoring suggestions
- Create a VSCode extension for direct editor integration
