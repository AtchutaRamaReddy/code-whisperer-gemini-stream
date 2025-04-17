
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeAnalyzer } from "@/components/CodeAnalyzer";
import { useToast } from "@/hooks/use-toast";
import { CodeIcon, CopyIcon, Code2Icon, LightbulbIcon, TerminalIcon, CheckIcon } from "lucide-react";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [code, setCode] = useState("");
  const [analysis, setAnalysis] = useState<{ comments: string; suggestions: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("comments");
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
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
      
      // Detect language from code patterns
      const language = detectLanguage(code);
      setDetectedLanguage(language);
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

  const detectLanguage = (code: string): string => {
    // Simple language detection based on patterns
    if (code.includes('function') || code.includes('const') || code.includes('let')) {
      return 'JavaScript';
    } else if (code.includes('def ') || code.includes('import ') || code.includes('class ')) {
      return 'Python';
    } else if (code.includes('public class') || code.includes('public static void main')) {
      return 'Java';
    } else if (code.includes('#include') || code.includes('std::')) {
      return 'C++';
    }
    return 'Unknown';
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
    setDetectedLanguage(language.charAt(0).toUpperCase() + language.slice(1));
    toast({
      title: `${language.charAt(0).toUpperCase() + language.slice(1)} example loaded`,
      description: "You can now analyze this example code.",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen bg-gradient-to-b from-background to-secondary/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2 flex items-center justify-center animate-fade-in">
            <Code2Icon className="mr-2" />
            Code Commenter AI
          </h1>
          <p className="text-lg text-muted-foreground">
            Get understandable comments embedded directly in your code
          </p>
        </div>

        <Card className="mb-8 shadow-lg border-primary/10 hover-scale">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CodeIcon className="h-5 w-5" />
              Your Code
            </CardTitle>
            <CardDescription>
              Paste your code below and our AI will analyze it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Textarea
                placeholder="Paste your code here..."
                className="min-h-[200px] font-mono text-sm resize-y"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              {detectedLanguage && (
                <Badge 
                  variant="outline" 
                  className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                >
                  <TerminalIcon className="h-3 w-3 mr-1" />
                  {detectedLanguage}
                </Badge>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => loadExample('python')}
                className="flex items-center gap-1"
              >
                <CodeIcon className="h-4 w-4" />
                Python Example
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => loadExample('javascript')}
                className="flex items-center gap-1"
              >
                <CodeIcon className="h-4 w-4" />
                JavaScript Example
              </Button>
            </div>
          </CardContent>
          <CardFooter className="pt-2 flex justify-end">
            <Button 
              onClick={analyzeCode} 
              disabled={isLoading}
              size="lg"
              className="relative"
            >
              {isLoading ? <Spinner className="mr-2" /> : <LightbulbIcon className="h-4 w-4 mr-2" />}
              Analyze Code
            </Button>
          </CardFooter>
        </Card>

        {analysis && (
          <Card className="shadow-lg border-primary/10 animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <LightbulbIcon className="h-5 w-5" />
                Analysis Results
              </CardTitle>
              <CardDescription>
                View the code with embedded comments and suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="comments" className="flex items-center gap-1">
                    <CodeIcon className="h-4 w-4" />
                    Commented Code
                  </TabsTrigger>
                  <TabsTrigger value="suggestions" className="flex items-center gap-1">
                    <LightbulbIcon className="h-4 w-4" />
                    Suggestions
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="comments" className="mt-0">
                  <div className="bg-muted/50 p-4 rounded-md font-mono text-sm whitespace-pre-wrap border border-border overflow-auto max-h-[400px] shadow-inner">
                    {analysis.comments}
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => handleCopy(analysis.comments)}
                      size="sm"
                      className="hover:bg-primary/10"
                    >
                      <CopyIcon className="h-4 w-4 mr-2" />
                      Copy to Clipboard
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="suggestions" className="mt-0">
                  <div className="bg-muted/50 p-4 rounded-md text-sm whitespace-pre-wrap border border-border overflow-auto max-h-[400px] shadow-inner">
                    <h3 className="text-lg font-medium mb-3">Improvement Suggestions</h3>
                    <ul className="space-y-2 list-none">
                      {analysis.suggestions.split('\n').filter(line => line.trim() && !line.includes('Suggestions for improvement')).map((suggestion, index) => {
                        // Extract the number if it exists and the text content
                        const match = suggestion.match(/^(\d+)\.\s+(.+)$/);
                        if (match) {
                          return (
                            <li key={index} className="flex items-start gap-2">
                              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 w-6 h-6 text-primary text-xs font-medium">
                                {match[1]}
                              </span>
                              <span className="flex-1">{match[2]}</span>
                            </li>
                          );
                        } else {
                          return (
                            <li key={index} className="pl-8">
                              {suggestion}
                            </li>
                          );
                        }
                      })}
                    </ul>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => handleCopy(analysis.suggestions)}
                      size="sm"
                      className="hover:bg-primary/10"
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
      </div>
    </div>
  );
};

export default Index;
