# OrbitBio - Space Biology Research Library

A stunning, production-quality single-page application for exploring space biology publications and datasets. Built with React 18, TypeScript, and Tailwind CSS.

## Features

- **Stunning Landing Page**: Cosmic-themed hero with animated DNA helix, glass morphism effects, and orbital motion
- **Advanced Dashboard**: Faceted search with DSL support, saved views, keyboard navigation
- **Publication Detail Pages**: Full publication information with related recommendations
- **Authentication System**: Client-side mock authentication with persistent sessions
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Accessibility**: Full keyboard navigation and ARIA labels
- **Search DSL**: Support for `organism:`, `assay:`, `mission:`, `source:`, `year>=`, `year<=` syntax

## Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests with coverage
npm test:coverage
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.tsx   # Main navigation header
│   ├── ResultCard.tsx   # Publication card component
│   ├── Inspector.tsx    # Publication detail panel
│   ├── Sidebar.tsx      # Filters and saved views
│   ├── AuthModal.tsx    # Authentication modal
│   └── LoadingSpinner.tsx
├── pages/               # Main route components
│   ├── Landing.tsx      # Cosmic-themed landing page
│   ├── Dashboard.tsx    # Main search interface
│   ├── PublicationDetail.tsx # Full publication view
│   ├── Profile.tsx      # User profile and saved items
│   └── Login.tsx        # Authentication page
├── lib/                 # Business logic and utilities
│   ├── searchEngine.ts  # Search DSL parser and filtering
│   └── auth.tsx         # Authentication context and logic
├── data/
│   └── publications.json # Sample publication data (BioC format)
├── styles/
│   └── global.css       # Global styles and animations
└── tests/               # Jest + Testing Library tests
    ├── setupTests.ts    # Test configuration
    ├── searchEngine.test.ts # Search engine tests
    └── ResultCard.test.tsx  # Component tests
```

## Key Features Implemented

### 1. Advanced Search DSL
The dashboard supports a powerful search syntax:
- `organism:"Mus musculus"` - Filter by organism
- `assay:proteomics` - Filter by assay type  
- `mission:"ISS Expedition"` - Filter by mission
- `year>=2020` - Publications from 2020 onwards
- `year<=2015` - Publications up to 2015
- Free text combined with filters: `protein expression organism:human year>=2018`

### 2. Authentication Flow
- Client-side mock authentication (no backend required)
- Persistent sessions using localStorage
- Auth-gated features: save, star, download
- Login modal for unauthenticated actions

### 3. Publication Data
Sample data includes 6 realistic publications with:
- BioC-compatible structure (PMC, PMID, DOI identifiers)
- Space biology focus (ISS, Bion-M missions)
- Various organisms (mice, humans, plants, microbes)
- Different assay types (proteomics, behavioral, growth analysis)
- Realistic metadata and abstracts

### 4. Interactive Features
- **Star**: Add to favorites (requires auth)
- **Save**: Add to personal library (requires auth)  
- **Download**: Download PDF if available (requires auth)
- **Inspect**: Open detailed view panel
- **Full View**: Navigate to dedicated detail page

### 5. Design System
- **Colors**: Cosmic (blues), Bio (greens), Neon accents
- **Typography**: Orbitron for headings, Inter for body text
- **Glass morphism**: Frosted glass panels with subtle borders
- **Animations**: Framer Motion for smooth transitions
- **Responsive**: Mobile-first design with proper breakpoints

## Testing

The project includes comprehensive tests for critical components:

- **Search Engine Tests**: DSL parsing, filtering, facet generation
- **Component Tests**: ResultCard behavior, authentication flows
- **Coverage**: Run `npm run test:coverage` for detailed coverage report

## Architecture Decisions

### State Management
- React Context for authentication state
- Local component state for UI interactions
- localStorage for persistence (favorites, saved items, user sessions)

### Routing
- React Router for client-side navigation
- Lazy loading for code splitting
- Deep linking support for all routes

### Search Implementation
- Client-side search with JSON data source
- Advanced query parser with regex-based tokenization
- Faceted search with real-time result counts
- Pagination and configurable page sizes

### Styling Approach
- Tailwind CSS for utility-first styling
- Custom CSS for complex animations
- Design tokens through Tailwind config
- Consistent spacing (8px grid system)

## Browser Support

- Chrome 90+
- Firefox 88+  
- Safari 14+
- Edge 90+

## Demo Authentication

For demo purposes, use any email address and a password with 6+ characters. User data persists in localStorage between sessions.

## Performance Optimizations

- Code splitting with React.lazy()
- Optimized re-renders with useCallback/useMemo
- Efficient search algorithm with early returns
- Image optimization recommendations in place
- Font preloading in HTML head

## License

MIT License - see LICENSE file for details.

---

Built with modern web technologies and attention to production-quality details. The codebase demonstrates advanced React patterns, TypeScript usage, and comprehensive testing practices suitable for professional development environments.