# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Causeway Design Pro** is a comprehensive full-stack web application for professional causeway design, analysis, and documentation. It's built with Node.js/Express backend and vanilla JavaScript frontend, providing civil engineering solutions with Excel integration, 2D drawing capabilities, 3D visualization, and comprehensive PDF report generation.

## Common Development Commands

### Quick Start (For Users)
```bash
# Double-click these batch files (Windows)
START_APP.bat          # Start the application
INSTALL_DEPS.bat       # First-time dependency installation

# Or use npm commands directly
npm install            # Install dependencies
npm start              # Start the application on http://localhost:3000
npm run dev            # Development mode with nodemon
```

### Development Commands
```bash
# Development server with auto-reload
npm run dev

# Build for production (if webpack configured)
npm run build

# Development build with watch
npm run dev-build

# Test the application
node server.js         # Direct server start
```

### Batch File Commands (Windows)
- `START_APP.bat` - One-click startup with dependency checking
- `INSTALL_DEPS.bat` - Clean installation of all dependencies

## Architecture Overview

### Backend Architecture (server.js)
- **Express.js** server with comprehensive middleware stack
- **Excel Processing**: XLSX library for parsing uploaded Excel files
- **Security**: Helmet, CORS, compression middleware
- **File Upload**: Multer with memory storage for Excel files
- **PDF Generation**: Server-side HTML template generation for reports

### Key API Endpoints
- `GET /` - Serve main application
- `POST /upload-excel` - Parse Excel files and extract design parameters
- `POST /calculate-causeway` - Perform structural engineering calculations
- `POST /generate-pdf-report` - Generate comprehensive PDF design reports

### Frontend Architecture (public/)
- **Modular JavaScript Class**: `CausewayDesignApp` with tab-based navigation
- **Drawing System**: Fabric.js canvas for 2D technical drawings
- **3D Visualization**: Three.js for interactive 3D causeway models
- **Charts**: Chart.js for load distribution and material quantity visualization
- **Excel Integration**: File upload and parameter extraction

### Frontend Components
- **Design Tab**: Parameter input, Excel upload, calculation results
- **Drawing Tab**: 2D drawing tools (line, rectangle, circle, text)
- **3D View Tab**: Interactive 3D model with rotation and zoom controls
- **Analysis Tab**: Charts and detailed calculations from Excel data

## Key Features Implementation

### Excel Integration
- Supports .xls and .xlsx file formats
- Automatic parameter extraction and form population
- Sheet parsing with multiple sheet support
- Error handling for invalid file types

### Engineering Calculations
- Structural analysis (volume, loads, foundation pressure)
- Material quantities (concrete, steel, formwork)
- Safety factor analysis with soil type considerations
- Enhanced recommendations with construction methods

### PDF Report Generation
- HTML-based report template following Excel structure
- Comprehensive engineering documentation
- Enhanced content with 10% additional technical details
- Professional formatting with CSS styling

### Drawing System
- Professional drawing tools with Fabric.js
- Shape tools (line, rectangle, circle, text)
- Canvas manipulation and export functionality
- PNG export capability

### 3D Visualization
- Real-time 3D model updates based on parameters
- Interactive controls (rotation, zoom)
- Water level visualization
- Shadow mapping and professional lighting

## Development Patterns

### Error Handling
- Comprehensive try-catch blocks in all endpoints
- User-friendly error messages
- Input validation for all parameters
- File type and size validation

### State Management
- Frontend state managed through class properties
- Excel data cached for analysis and reporting
- Real-time UI updates based on calculations

### Security Measures
- Helmet security headers
- File type validation (Excel only)
- Memory-only file processing (no disk storage)
- CORS configuration
- Input sanitization

## File Structure Significance

```
├── server.js              # Main Express server with all API endpoints
├── package.json           # Dependencies and scripts
├── START_APP.bat          # User-friendly application startup
├── INSTALL_DEPS.bat       # Dependency installation script
├── public/
│   ├── index.html         # Single-page application structure
│   ├── app.js            # Main frontend application class
│   └── styles.css        # Professional engineering UI styling
├── ATTACHED_ASSETS/       # Excel templates and engineering data
└── Documentation files   # README.md, HOW_TO_RUN.md
```

## Development Guidelines

### When Adding Features
- Follow the existing class-based frontend architecture
- Add new API endpoints following the error handling pattern
- Update both frontend UI and corresponding backend logic
- Maintain the professional engineering application styling

### Engineering Standards Compliance
- IRC (Indian Road Congress) standards implementation
- Safety factor calculations following engineering codes
- Professional report formatting matching Excel structures
- Structural analysis following established civil engineering practices

### Code Quality Standards
- Comprehensive error handling in all functions
- Clear variable naming for engineering parameters
- Professional commenting for technical calculations
- Modular function design for maintainability

## Dependencies Management

### Core Backend Dependencies
- `express`: Web application framework
- `cors`: Cross-origin resource sharing
- `helmet`: Security headers
- `compression`: Response compression
- `multer`: File upload handling
- `xlsx`: Excel file processing

### Frontend Libraries (CDN)
- `three.js`: 3D visualization
- `fabric.js`: 2D drawing canvas
- `chart.js`: Data visualization

### Development Dependencies
- `nodemon`: Development server auto-reload
- `webpack`: Build tooling (configured but optional)

## Common Development Scenarios

### Adding New Calculation Types
1. Extend the `/calculate-causeway` endpoint in server.js
2. Add new calculation logic following existing patterns
3. Update frontend `displayResults()` method
4. Add corresponding sections to PDF report template

### Excel Integration Enhancement
1. Modify `handleExcelUpload()` in app.js
2. Update `populateFormFromExcel()` for new parameter mapping
3. Enhance server-side Excel parsing in `/upload-excel`
4. Update analysis table generation in `updateAnalysis()`

### UI/UX Improvements
1. Follow the existing tab-based navigation pattern
2. Use consistent styling classes from styles.css
3. Maintain professional engineering application appearance
4. Add appropriate Font Awesome icons for new features

### 3D Model Enhancement
1. Modify `createDefaultCauseway()` and `update3DModel()` methods
2. Follow Three.js best practices for geometry and materials
3. Maintain shadow mapping and lighting consistency
4. Update controls if adding new interactive features

## Deployment Notes

- Application runs on port 3000 by default
- No database required (stateless design)
- All file processing happens in memory
- Batch files provide Windows-specific easy deployment
- Professional styling suitable for client demonstrations

## Testing Approach

### Manual Testing Workflow
1. Start application using START_APP.bat
2. Test Excel upload with sample files from ATTACHED_ASSETS/
3. Verify calculations with known engineering parameters
4. Test drawing tools and 3D visualization
5. Generate PDF reports and verify content accuracy
6. Cross-browser compatibility testing

### Key Test Scenarios
- Excel file parsing with various formats
- Parameter validation and error handling
- Calculation accuracy verification
- PDF report generation completeness
- Drawing export functionality
- 3D model responsiveness to parameter changes
