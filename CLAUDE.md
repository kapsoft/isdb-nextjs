# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build production version
- `npm run start` - Start production server  
- `npm run lint` - Run ESLint for code quality checks

## Project Architecture

### Core Technology Stack
- **Next.js 14** with App Router architecture
- **React 18** with client-side components
- **Three.js** for 3D graphics and animations
- **React Three Fiber** for React-Three.js integration
- **Tailwind CSS** for styling
- **ESLint** for code quality

### Application Structure

**ISDB** (Internet Sports Data Base) is a sports data visualization platform featuring interactive 3D elements.

#### Key Components Architecture
- `app/layout.js` - Root layout with Inter font and metadata for "ISDB - Internet Sports Data Base"
- `app/page.js` - Main homepage assembling all sections (Hero, About, DataVisualization)
- `components/Navigation.js` - Fixed navigation with scroll-based styling and links to /explore, /about, /api-docs
- `components/ThreeAnimation.js` - Complex 3D physics simulation with multiple sports ball types

#### Three.js Implementation Details
The `ThreeAnimation.js` component creates a sophisticated 3D sports scene:
- **Physics Engine**: Custom ball physics with gravity, collisions, and realistic bouncing
- **Sports Balls**: Basketball, football, baseball, and hockey puck with accurate textures
- **Basketball Court**: Custom-rendered parquet floor with court markings and ISDB blue paint areas
- **Lighting**: Multi-directional lighting setup with shadows
- **Performance**: 60 ball limit with staggered creation timing

#### Component Patterns
- All interactive components use `'use client'` directive
- Components follow functional React patterns with hooks
- Navigation uses scroll-based state management
- Three.js components handle their own cleanup and resize logic

#### Styling Approach
- Tailwind CSS with custom responsive design
- Color scheme: White background, gray text, blue accents (#1d4ed8 ISDB blue)
- Navigation has backdrop blur and transparency effects
- Components are fully responsive

#### API Structure
- `app/api/` directory prepared for API routes
- Links to `/api-docs` suggest OpenAPI/documentation planned

### Development Notes
- No test framework currently configured
- TypeScript not enabled (using .js files)
- Three.js animations are performance-optimized with proper cleanup
- Custom texture generation for realistic sports equipment rendering