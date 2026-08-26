# Sorting Visualizer

An interactive browser-based visualizer for Bubble, Selection, Insertion, Merge and Quick Sort.

## Features
- Real-time algorithm animation
- Adjustable array size and speed
- Operation and elapsed-time counters
- Complexity and stability information
- Responsive desktop/mobile UI
- No backend or build step required

## Run locally

Serve the repository with any static HTTP server:

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Deployment

This is a static site and can be deployed directly to Vercel, Netlify, or GitHub Pages.

## Algorithms

| Algorithm | Average | Best | Stable |
|---|---|---|---|
| Bubble Sort | O(n²) | O(n) | Yes |
| Selection Sort | O(n²) | O(n²) | No |
| Insertion Sort | O(n²) | O(n) | Yes |
| Merge Sort | O(n log n) | O(n log n) | Yes |
| Quick Sort | O(n log n) | O(n log n) | No |

## License
MIT
