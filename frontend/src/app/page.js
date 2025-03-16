// pages/index.js
"use client";
// pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle clicks outside of suggestions dropdown
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Fetch suggestions when prompt changes
  useEffect(() => {
    const getSuggestions = async () => {
      if (prompt.trim().length > 2) {
        setSuggestionsLoading(true);
        try {
          const response = await fetch('http://localhost:8000/suggest-prompts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              keyword: prompt.trim()
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setSuggestions(data.suggestions);
            setShowSuggestions(data.suggestions.length > 0);
          }
        } catch (err) {
          console.error('Error fetching suggestions:', err);
        } finally {
          setSuggestionsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    // Debounce suggestion requests
    const timeoutId = setTimeout(() => {
      getSuggestions();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [prompt]);

  const generateImage = async (selectedPrompt = prompt) => {
    setLoading(true);
    setError('');
    setShowSuggestions(false); // Explicitly hide suggestions when generating
    
    try {
      const response = await fetch('http://localhost:8000/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          prompt: selectedPrompt,
          height: 512,
          width: 512,
          num_inference_steps: 30,
          guidance_scale: 7.5
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setImage(data.image);
    } catch (err) {
      setError(err.message);
      console.error('Error generating image:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (e, suggestion) => {
    e.stopPropagation(); // Prevent the document click handler from firing
    setPrompt(suggestion);
    generateImage(suggestion);
    setShowSuggestions(false); // Hide suggestions after selection
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateImage();
    setShowSuggestions(false); // Hide suggestions after form submission
  };

  // Handle input focus to show suggestions again if there are any
  const handleInputFocus = () => {
    if (suggestions.length > 0 && prompt.trim().length > 2) {
      setShowSuggestions(true);
    }
  };

  // Handle input click to prevent document click from closing suggestions
  const handleInputClick = (e) => {
    e.stopPropagation();
    handleInputFocus();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>AI Image Generator with Suggestions</title>
        <meta name="description" content="Generate images using AI with prompt suggestions" />
      </Head>

      <main className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8">🚀✨ PromptMap: AI Image Generator 🎨🖌️</h1>
        
        <div className="w-full max-w-md relative">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                Enter your prompt:
              </label>
              <input
                type="text"
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={handleInputFocus}
                onClick={handleInputClick}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Try typing: car, landscape, portrait..."
                autoComplete="off"
              />
              {suggestionsLoading && (
                <div className="mt-2 text-sm text-gray-500">Loading suggestions...</div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:bg-gray-400"
            >
              {loading ? 'Generating...' : 'Generate Image'}
            </button>
          </form>

          {/* Suggestions dropdown - only shown when showSuggestions is true */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
              <ul className="max-h-60 overflow-auto py-1">
                {suggestions.map((suggestion, index) => (
                  <li 
                    key={index} 
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                    onClick={(e) => handleSuggestionClick(e, suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded w-full max-w-md">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="mt-8 flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
            <p>Generating your image, please wait...</p>
          </div>
        )}

        {image && (
          <div className="mt-8 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Generated Image:</h2>
            <div className="border border-gray-300 p-2 rounded">
              <img
                src={`data:image/png;base64,${image}`}
                alt="Generated image"
                className="max-w-full h-auto"
              />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p className="font-medium">Prompt used:</p>
              <p className="italic">{prompt}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}