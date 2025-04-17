
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CodeAnalyzer } from "@/components/CodeAnalyzer";
import { useToast } from "@/components/ui/use-toast";
import { InfoIcon, CopyIcon, Code2Icon } from "lucide-react";

// Spinner component for loading states
const Spinner = ({ className }: { className?: string }) => {
  return (
    <svg
      className={`animate-spin h-4 w-4 ${className || ""}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

const Index = () => {
  const [code, setCode] = useState("");
  const [analysis, setAnalysis] = useState<{ comments: string; suggestions: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("comments");
  const { toast } = useToast();

  const analyzeCode = async () => {
    if (!code.trim()) {
      toast({
        title: "No code provided",
        description: "Please enter some code to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // In a real application, this would be an API call to the Python backend
      // For now, we'll simulate the analysis with the CodeAnalyzer component
      const result = await CodeAnalyzer.analyze(code);
      setAnalysis(result);
      setActiveTab("comments");
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your code. Please try again.",
        variant: "destructive",
      });
      console.error("Error analyzing code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard.",
    });
  };

  const codeExamples = {
    python: `def calculate_factorial(n):
    """Calculate the factorial of a number."""
    if n == 0 or n == 1:
        return 1
    else:
        return n * calculate_factorial(n-1)

# Calculate factorial of 5
result = calculate_factorial(5)
print(f"The factorial of 5 is {result}")`,
    javascript: `function sortArray(arr) {
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
console.log(sortArray(unsortedArray));`
  };

  const loadExample = (language: keyof typeof codeExamples) => {
    setCode(codeExamples[language]);
    toast({
      title: `${language.charAt(0).toUpperCase() + language.slice(1)} example loaded`,
      description: "You can now analyze this example code.",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2 flex items-center justify-center">
            <Code2Icon className="mr-2" />
            Code Commenter AI
          </h1>
          <p className="text-lg text-muted-foreground">
            Get understandable comments and helpful suggestions for your code
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Code</CardTitle>
            <CardDescription>
              Paste your code below and our AI will analyze it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your code here..."
              className="min-h-[200px] font-mono text-sm"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <div className="mt-2 flex justify-start space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => loadExample('python')}
              >
                Python Example
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => loadExample('javascript')}
              >
                JavaScript Example
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              onClick={analyzeCode} 
              disabled={isLoading}
              size="lg"
              className="relative"
            >
              {isLoading && <Spinner className="mr-2" />}
              Analyze Code
            </Button>
          </CardFooter>
        </Card>

        {analysis && (
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                View the AI-generated comments and suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                </TabsList>
                <TabsContent value="comments" className="mt-4">
                  <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap">
                    {analysis.comments}
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => handleCopy(analysis.comments)}
                      size="sm"
                    >
                      <CopyIcon className="h-4 w-4 mr-2" />
                      Copy to Clipboard
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="suggestions" className="mt-4">
                  <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap">
                    {analysis.suggestions}
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => handleCopy(analysis.suggestions)}
                      size="sm"
                    >
                      <CopyIcon className="h-4 w-4 mr-2" />
                      Copy to Clipboard
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        <div className="mt-8">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              This is a frontend demo. In a production environment, the analysis would be performed 
              by a Python backend using the Google Gemini API. See the instructions in 
              the README to run the Python backend locally.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default Index;
