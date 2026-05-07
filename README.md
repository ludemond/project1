# Wordly Dictionary Pro

A modern, responsive Single Page Application (SPA) dictionary that provides comprehensive word definitions, pronunciations, and linguistic information using the free Dictionary API.

## Features

- **Word Search**: Search for any English word with real-time validation
- **Comprehensive Definitions**: Display multiple definitions per part of speech
- **Pronunciation Guide**: Phonetic spelling for correct pronunciation
- **Audio Playback**: Listen to word pronunciations (when available)
- **Text-to-Speech**: Fallback speech synthesis for words without audio
- **Examples**: Contextual usage examples for definitions
- **Synonyms & Antonyms**: Related words for better understanding
- **Word Origin**: Etymological information when available
- **Word of the Day**: Discover random interesting words
- **Search History**: View and revisit previously searched words
- **Favorites**: Save and manage favorite words
- **Smart Background**: Dynamic gradient colors that change based on the searched word
- **Dark Mode**: Toggle between light and dark themes with smooth transitions
- **Error Handling**: Robust error messages for network issues, invalid input, and missing words
- **Loading States**: Visual feedback during API requests
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technologies Used

- **HTML5**: Semantic markup for accessibility
- **CSS3**: Modern styling with gradients and responsive design
- **JavaScript (ES6+)**: Async/await for API calls, DOM manipulation
- **Dictionary API**: https://api.dictionaryapi.dev/ (free, no API key required)

## How to Run

1. **Clone or Download**: Get the project files to your local machine
2. **Open in Browser**: Simply open `index.html` in any modern web browser
3. **Start Searching**: Type a word in the search box and click "Search" or press Enter

No installation or build process required - it's a pure client-side application!

## Input Validation

- Accepts letters, spaces, and hyphens only
- Maximum word length: 50 characters
- Automatic trimming and lowercasing
- Real-time error feedback

## Error Handling

- Network connectivity issues
- API server errors
- Invalid or non-existent words
- Request timeouts (10 seconds)
- Malformed input validation

## Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript features
- Fetch API
- CSS Grid and Flexbox

## API Usage

This app uses the free Dictionary API (https://api.dictionaryapi.dev/) which provides:
- Word definitions and parts of speech
- Phonetic transcriptions
- Audio pronunciation files
- Synonyms and antonyms
- Usage examples
- Word origins

No API key required, but be mindful of rate limits for heavy usage.

## Future Enhancements

- Voice search input
- Word games and quizzes
- Offline caching for frequently used words
- Integration with images or related media
- Multi-language support
- Advanced search filters

## License

MIT License - feel free to use and modify for your own projects.

## Contributing

Feel free to submit issues or pull requests to improve the application!