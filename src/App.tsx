// // Save this as src/App.js in your React project
// import React, { useState, useRef } from 'react';
// import { Upload, MessageCircle, FileText, CheckCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

// const API_BASE = 'http://localhost:8000';

// // Define the message type
// interface Message {
//   type: 'user' | 'assistant' | 'system' | 'error';
//   content: string;
//   timestamp: Date;
// }

// export default function PDFQuestionApp() {
//   const [file, setFile] = useState<File | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isProcessed, setIsProcessed] = useState(false);
//   const [question, setQuestion] = useState('');
//   const [isAsking, setIsAsking] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [status, setStatus] = useState('');
//   const [error, setError] = useState('');
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = event.target.files?.[0];
//     if (selectedFile && selectedFile.type === 'application/pdf') {
//       setFile(selectedFile);
//       setError('');
//       setIsProcessed(false);
//       setMessages([]);
//     } else {
//       setError('Please select a valid PDF file');
//       setFile(null);
//     }
//   };

//   const uploadPDF = async () => {
//     if (!file) return;

//     setIsUploading(true);
//     setError('');
//     setStatus('Uploading and processing PDF...');

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await fetch(`${API_BASE}/upload`, {
//         method: 'POST',
//         body: formData,
//       });

//       const result = await response.json();

//       if (response.ok && result.success) {
//         setIsProcessed(true);
//         setStatus(result.message);
//         setMessages([{
//           type: 'system',
//           content: `✅ ${result.message}`,
//           timestamp: new Date()
//         }]);
//       } else {
//         setError(result.detail || 'Failed to process PDF');
//         setStatus('');
//       }
//     } catch (err) {
//       setError('Failed to connect to server. Make sure the API is running.');
//       setStatus('');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const askQuestion = async () => {
//     if (!question.trim() || !isProcessed) return;

//     setIsAsking(true);
//     const userQuestion = question.trim();
    
//     // Add user question to messages
//     setMessages(prev => [...prev, {
//       type: 'user',
//       content: userQuestion,
//       timestamp: new Date()
//     }]);

//     setQuestion('');

//     try {
//       const response = await fetch(`${API_BASE}/ask`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ question: userQuestion }),
//       });

//       const result = await response.json();

//       if (response.ok && result.success) {
//         setMessages(prev => [...prev, {
//           type: 'assistant',
//           content: result.answer,
//           timestamp: new Date()
//         }]);
//       } else {
//         setMessages(prev => [...prev, {
//           type: 'error',
//           content: result.error || 'Failed to get answer',
//           timestamp: new Date()
//         }]);
//       }
//     } catch (err) {
//       setMessages(prev => [...prev, {
//         type: 'error',
//         content: 'Failed to connect to server',
//         timestamp: new Date()
//       }]);
//     } finally {
//       setIsAsking(false);
//     }
//   };

//   const resetSystem = async () => {
//     try {
//       await fetch(`${API_BASE}/reset`, { method: 'DELETE' });
//       setFile(null);
//       setIsProcessed(false);
//       setMessages([]);
//       setStatus('');
//       setError('');
//       setQuestion('');
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//     } catch (err) {
//       setError('Failed to reset system');
//     }
//   };



//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       <div className=" mx-auto px-4 py-8 ">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">
//             📄 PDF Question Answering
//           </h1>
//           <p className="text-gray-600">
//             Upload a PDF and ask questions about its content using AI
//           </p>
//         </div>

//         {/* Main Content */}
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
//           {/* File Upload Section */}
//           <div className="mb-8">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//                 <Upload className="mr-2" size={20} />
//                 Upload PDF
//               </h2>
//               {isProcessed && (
//                 <button
//                   onClick={resetSystem}
//                   className="flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//                 >
//                   <RefreshCw size={14} className="mr-1" />
//                   Reset
//                 </button>
//               )}
//             </div>

//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
//               {!file ? (
//                 <>
//                   <FileText className="mx-auto mb-4 text-gray-400" size={48} />
//                   <p className="text-gray-600 mb-4">Choose a PDF file to analyze</p>
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept=".pdf"
//                     onChange={handleFileSelect}
//                     className="hidden"
//                     id="file-upload"
//                   />
//                   <label
//                     htmlFor="file-upload"
//                     className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
//                   >
//                     Select PDF File
//                   </label>
//                 </>
//               ) : (
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-center">
//                     {isProcessed ? (
//                       <CheckCircle className="text-green-500 mr-2" size={24} />
//                     ) : (
//                       <FileText className="text-blue-500 mr-2" size={24} />
//                     )}
//                     <span className="font-medium">{file.name}</span>
//                   </div>
                  
//                   {!isProcessed && (
//                     <button
//                       onClick={uploadPDF}
//                       disabled={isUploading}
//                       className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center mx-auto"
//                     >
//                       {isUploading ? (
//                         <>
//                           <Loader2 className="animate-spin mr-2" size={16} />
//                           Processing...
//                         </>
//                       ) : (
//                         'Process PDF'
//                       )}
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Status Messages */}
//             {status && (
//               <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                 <p className="text-blue-800">{status}</p>
//               </div>
//             )}

//             {error && (
//               <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
//                 <AlertCircle className="text-red-500 mr-2" size={16} />
//                 <p className="text-red-800">{error}</p>
//               </div>
//             )}
//           </div>

//           {/* Question Section */}
//           {isProcessed && (
//             <div className="border-t pt-8">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
//                 <MessageCircle className="mr-2" size={20} />
//                 Ask Questions
//               </h2>

//               <div className="mb-6">
//                 <div className="flex space-x-2">
//                   <input
//                     type="text"
//                     value={question}
//                     onChange={(e) => setQuestion(e.target.value)}
//                     placeholder="Ask a question about the PDF content..."
//                     className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-600"
//                     disabled={isAsking}
//                     onKeyPress={(e) => e.key === 'Enter' && !isAsking && question.trim() && askQuestion()}
//                   />
//                   <button
//                     onClick={askQuestion}
//                     disabled={isAsking || !question.trim()}
//                     className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
//                   >
//                     {isAsking ? (
//                       <Loader2 className="animate-spin" size={16} />
//                     ) : (
//                       'Ask'
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Messages */}
//               <div className="space-y-4 max-h-96 overflow-y-auto">
//                 {messages.map((message, index) => (
//                   <div
//                     key={index}
//                     className={`p-4 rounded-lg ${
//                       message.type === 'user'
//                         ? 'bg-blue-50 border-l-4 border-blue-500 ml-12'
//                         : message.type === 'assistant'
//                         ? 'bg-gray-50 border-l-4 border-gray-500 mr-12'
//                         : message.type === 'system'
//                         ? 'bg-green-50 border-l-4 border-green-500'
//                         : 'bg-red-50 border-l-4 border-red-500'
//                     }`}
//                   >
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <p className={`${
//                           message.type === 'user' ? 'text-blue-800' :
//                           message.type === 'assistant' ? 'text-gray-800' :
//                           message.type === 'system' ? 'text-green-800' :
//                           'text-red-800'
//                         }`}>
//                           {message.content}
//                         </p>
//                       </div>
//                       <span className="text-xs text-gray-500 ml-2">
//                         {message.timestamp.toLocaleTimeString()}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Instructions */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-3">📋 How to Use</h3>
//           <ol className="list-decimal list-inside space-y-2 text-gray-600">
//             <li>Make sure your FastAPI backend is running on localhost:8000</li>
//             <li>Ensure Ollama is running with required models (llama3.1, nomic-embed-text)</li>
//             <li>Upload a PDF file using the upload section above</li>
//             <li>Wait for the PDF to be processed and embeddings to be created</li>
//             <li>Ask questions about the PDF content in natural language</li>
//             <li>Get AI-powered answers based on the document content</li>
//           </ol>
//         </div>
//       </div>
//     </div>
//   );
// }

// Save this as src/App.js in your React project
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, RotateCcw, Bot, User } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

// Define the message type
interface Message {
  type: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: Date;
}

export default function PDFQuestionApp() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
      setIsProcessed(false);
      setMessages([]);
    } else {
      setError('Please select a valid PDF file');
      setFile(null);
    }
  };

  const uploadPDF = async () => {
    if (!file) return;
    setIsUploading(true);
    setError('');
    setStatus('Uploading and processing PDF...');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setIsProcessed(true);
        setStatus(result.message);
        setMessages([{
          type: 'system',
          content: `✅ PDF processed successfully. You can now ask questions about "${file.name}"`,
          timestamp: new Date()
        }]);
      } else {
        setError(result.detail || 'Failed to process PDF');
        setStatus('');
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure the API is running.');
      setStatus('');
    } finally {
      setIsUploading(false);
    }
  };

  const askQuestion = async () => {
    if (!question.trim() || !isProcessed) return;
    setIsAsking(true);
    const userQuestion = question.trim();
    // Add user question to messages
    setMessages(prev => [...prev, {
      type: 'user',
      content: userQuestion,
      timestamp: new Date()
    }]);
    setQuestion('');
    try {
      const response = await fetch(`${API_BASE}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userQuestion }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setMessages(prev => [...prev, {
          type: 'assistant',
          content: result.answer,
          timestamp: new Date()
        }]);
      } else {
        setMessages(prev => [...prev, {
          type: 'error',
          content: result.error || 'Failed to get answer',
          timestamp: new Date()
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Failed to connect to server',
        timestamp: new Date()
      }]);
    } finally {
      setIsAsking(false);
    }
  };

  const resetSystem = async () => {
    try {
      await fetch(`${API_BASE}/reset`, { method: 'DELETE' });
      setFile(null);
      setIsProcessed(false);
      setMessages([]);
      setStatus('');
      setError('');
      setQuestion('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError('Failed to reset system');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800">
      {/* Header */}
      <header className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Paperclip className="mr-2" size={24} />
          <h1 className="text-xl font-semibold">PDF Chat</h1>
        </div>
        {isProcessed && (
          <button
            onClick={resetSystem}
            className="flex items-center text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg transition-colors"
          >
            <RotateCcw size={16} className="mr-1" />
            New Chat
          </button>
        )}
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 text-white p-4 flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Upload PDF</h2>
            <div className="space-y-3">
              {!file ? (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="block w-full text-center py-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition-colors"
                  >
                    Select PDF
                  </label>
                </>
              ) : (
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-sm truncate">{file.name}</p>
                  {!isProcessed && (
                    <button
                      onClick={uploadPDF}
                      disabled={isUploading}
                      className="mt-2 w-full py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded text-sm"
                    >
                      {isUploading ? 'Processing...' : 'Process'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {status && (
            <div className="mb-4 p-2 bg-blue-900 rounded text-sm">
              {status}
            </div>
          )}
          {error && (
            <div className="mb-4 p-2 bg-red-900 rounded text-sm">
              {error}
            </div>
          )}

          <div className="mt-auto text-xs text-gray-400">
            <p>Upload a PDF and ask questions about its content</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-700">
          {isProcessed ? (
            <>
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-3xl mx-auto space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type !== 'user' && (
                        <div className="flex-shrink-0 mr-3 mt-1">
                          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                            {message.type === 'assistant' ? (
                              <Bot size={20} className="text-white" />
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                            )}
                          </div>
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] rounded-lg px-4 py-3 ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : message.type === 'assistant'
                            ? 'bg-gray-600 text-white rounded-tl-none'
                            : message.type === 'system'
                            ? 'bg-green-900 text-green-200 mx-auto text-center'
                            : 'bg-red-900 text-red-200 mx-auto text-center'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {message.type === 'user' && (
                        <div className="flex-shrink-0 ml-3 mt-1">
                          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                            <User size={20} className="text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {isAsking && (
                    <div className="flex justify-start">
                      <div className="flex-shrink-0 mr-3 mt-1">
                        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                          <Bot size={20} className="text-white" />
                        </div>
                      </div>
                      <div className="bg-gray-600 text-white rounded-lg rounded-tl-none px-4 py-3">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-600 p-4 bg-gray-800">
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Message PDF..."
                      className="flex-1 bg-gray-700 text-white rounded-l-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={isAsking}
                      onKeyPress={(e) => e.key === 'Enter' && !isAsking && question.trim() && askQuestion()}
                    />
                    <button
                      onClick={askQuestion}
                      disabled={isAsking || !question.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-3 rounded-r-lg"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 mt-2 text-center">
                    PDF Chat can make mistakes. Consider checking important information.
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Welcome Screen
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
              <div className="max-w-2xl">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Paperclip size={32} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">PDF Question Answering</h1>
                <p className="text-gray-300 mb-8">
                  Upload a PDF document and start asking questions about its content. 
                  Our AI will analyze the document and provide answers.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-white mb-2">1. Upload PDF</h3>
                    <p className="text-gray-400 text-sm">Select and process your document</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-white mb-2">2. Ask Questions</h3>
                    <p className="text-gray-400 text-sm">Type questions about the content</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-white mb-2">3. Get Answers</h3>
                    <p className="text-gray-400 text-sm">Receive AI-powered responses</p>
                  </div>
                </div>
                
                {!file ? (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload-main"
                    />
                    <label
                      htmlFor="file-upload-main"
                      className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors"
                    >
                      Upload PDF to Start
                    </label>
                  </div>
                ) : (
                  <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
                    <p className="text-white mb-3">{file.name}</p>
                    <button
                      onClick={uploadPDF}
                      disabled={isUploading}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg"
                    >
                      {isUploading ? 'Processing...' : 'Process PDF'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}