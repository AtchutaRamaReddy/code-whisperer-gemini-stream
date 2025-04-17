
import streamlit as st
import google.generativeai as genai
import re

# Configure the Gemini API
API_KEY = "AIzaSyBeIJxHAt9O9wnUzBejs8IFI2IDuALV060"  # In production, use environment variables
genai.configure(api_key=API_KEY)

# Set up the model
model = genai.GenerativeModel('gemini-pro')

def detect_language(code):
    """Detect the programming language from the code."""
    patterns = {
        'python': [r'def\s+\w+\s*\(', r'import\s+\w+', r'from\s+\w+\s+import'],
        'javascript': [r'function\s+\w+\s*\(', r'const\s+\w+\s*=', r'let\s+\w+\s*='],
        'java': [r'public\s+class', r'public\s+static\s+void\s+main'],
        'c': [r'#include', r'int\s+main\s*\('],
        'cpp': [r'#include\s*<\w+>', r'namespace', r'std::'],
        'html': [r'<html.*>', r'<body.*>', r'<div.*>'],
        'css': [r'\w+\s*{\s*\w+:', r'\.\w+\s*{'],
    }
    
    for lang, regex_list in patterns.items():
        for regex in regex_list:
            if re.search(regex, code, re.IGNORECASE):
                return lang
    
    return "unknown"

def generate_comments(code):
    """Generate user-friendly comments for the code."""
    language = detect_language(code)
    
    prompt = f"""
    I have this code in {language if language != 'unknown' else 'an unknown language'}:
    
    ```
    {code}
    ```
    
    Analyze this code and provide:
    1. Clear, simple comments that explain what the code does in terms that a non-programmer could understand
    2. Explain the purpose of key functions or code blocks
    3. Don't be overly technical, focus on the "what" and "why" not the "how"
    4. Format your response as code comments in the appropriate style for {language}
    """
    
    response = model.generate_content(prompt)
    return response.text

def generate_suggestions(code):
    """Generate improvement suggestions for the code."""
    language = detect_language(code)
    
    prompt = f"""
    I have this code in {language if language != 'unknown' else 'an unknown language'}:
    
    ```
    {code}
    ```
    
    Provide specific, actionable suggestions to improve this code in terms of:
    1. Readability and maintainability
    2. Potential bugs or edge cases
    3. Performance improvements 
    4. Best practices for {language}
    5. Format your response as a numbered list of suggestions with brief explanations
    """
    
    response = model.generate_content(prompt)
    return response.text

# Streamlit UI
st.set_page_config(
    page_title="Code Commenter AI",
    page_icon="💻",
    layout="wide"
)

# Custom CSS for a nicer appearance
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        margin-bottom: 0;
        color: #3B82F6;
    }
    .sub-header {
        font-size: 1.2rem;
        color: #6B7280;
        margin-top: 0;
    }
    .code-box {
        border-radius: 8px;
        border: 1px solid #E5E7EB;
    }
    .stButton>button {
        background-color: #3B82F6;
        color: white;
        border-radius: 6px;
        padding: 0.5rem 1rem;
        font-weight: 500;
    }
    .stButton>button:hover {
        background-color: #2563EB;
    }
</style>
""", unsafe_allow_html=True)

# Header
st.markdown('<p class="main-header">💻 Code Commenter AI</p>', unsafe_allow_html=True)
st.markdown('<p class="sub-header">Get understandable comments and helpful suggestions for your code</p>', unsafe_allow_html=True)

# Main interface
with st.container():
    # Code input
    st.markdown("### Enter your code")
    code = st.text_area("", height=300, placeholder="Paste your code here...", key="code_input")
    
    # Example buttons
    col1, col2, col3 = st.columns([1, 1, 2])
    with col1:
        if st.button("Python Example"):
            code = """def calculate_factorial(n):
    \"\"\"Calculate the factorial of a number.\"\"\"
    if n == 0 or n == 1:
        return 1
    else:
        return n * calculate_factorial(n-1)

# Calculate factorial of 5
result = calculate_factorial(5)
print(f"The factorial of 5 is {result}")"""
            st.session_state.code_input = code
            st.experimental_rerun()
            
    with col2:
        if st.button("JavaScript Example"):
            code = """function sortArray(arr) {
  // Implementation of quick sort
  if (arr.length <= 1) {
    return arr;
  }
  
  const pivot = arr[0];
  const left = [];
  const right = [];
  
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  
  return [...sortArray(left), pivot, ...sortArray(right)];
}

// Example usage
const unsortedArray = [5, 3, 7, 6, 2, 9];
console.log(sortArray(unsortedArray));"""
            st.session_state.code_input = code
            st.experimental_rerun()
    
    with col3:
        analyze_button = st.button("Analyze Code", type="primary")

# Process code
if analyze_button and code:
    with st.status("Analyzing your code...", expanded=True) as status:
        st.write("Detecting language...")
        language = detect_language(code)
        st.write(f"Detected language: {language.capitalize() if language != 'unknown' else 'Unknown'}")
        
        try:
            st.write("Generating comments...")
            comments = generate_comments(code)
            
            st.write("Generating suggestions...")
            suggestions = generate_suggestions(code)
            
            status.update(label="Analysis complete!", state="complete")
        except Exception as e:
            st.error(f"An error occurred: {str(e)}")
            st.stop()
    
    # Display results in tabs
    tab1, tab2 = st.tabs(["User-Friendly Comments", "Improvement Suggestions"])
    
    with tab1:
        st.subheader("Code Comments")
        st.code(comments, language=language if language != "unknown" else None)
        st.download_button(
            label="Download Comments",
            data=comments,
            file_name="code_comments.txt",
            mime="text/plain"
        )
        
    with tab2:
        st.subheader("Improvement Suggestions")
        st.markdown(suggestions)
        st.download_button(
            label="Download Suggestions",
            data=suggestions,
            file_name="code_suggestions.txt",
            mime="text/plain"
        )
elif analyze_button:
    st.error("Please enter some code to analyze.")

# Add help information
with st.expander("How to use this tool"):
    st.markdown("""
    1. **Paste your code** in the text area above
    2. Click **Analyze Code**
    3. View the comments that explain your code in simple terms
    4. Check the suggestions to improve your code
    5. Download results if needed
    
    This tool uses Google's Gemini AI to analyze your code and provide helpful comments 
    and suggestions in human-readable language.
    """)

# Footer
st.markdown("---")
st.markdown("""
**Note**: This is using the Gemini API to generate comments and suggestions. The quality of 
the analysis depends on the complexity and clarity of the code provided.
""")
