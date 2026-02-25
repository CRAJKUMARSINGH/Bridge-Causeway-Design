// Causeway Design Pro - Enhanced Main Application
class CausewayDesignApp {
    constructor() {
        this.currentTab = 'design';
        this.currentTool = 'select';
        this.canvas = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.excelData = null;
        this.charts = {};
        this.designHistory = [];
        this.currentHistoryIndex = -1;
        this.autoSaveInterval = null;
        this.comparisonMode = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeDrawingCanvas();
        this.initialize3DScene();
        this.initializeCharts();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Excel upload
        document.getElementById('uploadBtn').addEventListener('click', () => {
            this.handleExcelUpload();
        });

        // Calculate button
        document.getElementById('calculateBtn').addEventListener('click', () => {
            this.calculateDesign();
        });

        // PDF generation button
        document.getElementById('generatePdfBtn').addEventListener('click', () => {
            this.generatePDFReport();
        });

        // Excel workbook generation button
        document.getElementById('generateExcelBtn').addEventListener('click', () => {
            this.generateExcelWorkbook();
        });

        // Drawing tools
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setDrawingTool(e.target.dataset.tool);
            });
        });

        // Drawing actions
        document.getElementById('clearCanvas').addEventListener('click', () => {
            this.clearDrawing();
        });

        document.getElementById('saveDrawing').addEventListener('click', () => {
            this.saveDrawing();
        });

        // 3D controls
        document.getElementById('rotX').addEventListener('input', (e) => {
            this.rotate3D('x', e.target.value);
        });

        document.getElementById('rotY').addEventListener('input', (e) => {
            this.rotate3D('y', e.target.value);
        });

        document.getElementById('zoom').addEventListener('input', (e) => {
            this.zoom3D(e.target.value);
        });

        document.getElementById('reset3D').addEventListener('click', () => {
            this.reset3DView();
        });
    }

    switchTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;

        // Initialize specific tab features
        if (tabName === '3d') {
            this.animate3D();
        } else if (tabName === 'analysis') {
            this.updateAnalysis();
        }
    }

    async handleExcelUpload() {
        const fileInput = document.getElementById('excelFile');
        const file = fileInput.files[0];
        const statusDiv = document.getElementById('uploadStatus');

        if (!file) {
            this.showStatus('Please select a file first.', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('excelFile', file);

        try {
            this.showStatus('Uploading and parsing Excel file...', 'loading');
            
            const response = await fetch('/upload-excel', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                this.excelData = result;
                this.showStatus(`Successfully parsed ${result.sheetNames.length} sheets: ${result.sheetNames.join(', ')}`, 'success');
                this.populateFormFromExcel();
            } else {
                this.showStatus(`Error: ${result.error}`, 'error');
            }
        } catch (error) {
            this.showStatus(`Upload failed: ${error.message}`, 'error');
        }
    }

    showStatus(message, type) {
        const statusDiv = document.getElementById('uploadStatus');
        statusDiv.textContent = message;
        statusDiv.className = `upload-status ${type}`;
        
        if (type === 'loading') {
            statusDiv.innerHTML = `<span class="loading"></span> ${message}`;
        }
    }

    populateFormFromExcel() {
        if (!this.excelData || !this.excelData.sheets) return;

        // Try to find common parameter names in the Excel data
        const sheets = this.excelData.sheets;
        const firstSheet = Object.values(sheets)[0];
        
        if (firstSheet && firstSheet.length > 0) {
            // Look for parameters in the first few rows
            for (let i = 0; i < Math.min(10, firstSheet.length); i++) {
                const row = firstSheet[i];
                if (row && row.length > 0) {
                    const cellValue = String(row[0]).toLowerCase();
                    
                    // Map common parameter names
                    if (cellValue.includes('length') || cellValue.includes('l')) {
                        const value = this.extractNumericValue(row);
                        if (value) document.getElementById('length').value = value;
                    } else if (cellValue.includes('width') || cellValue.includes('w')) {
                        const value = this.extractNumericValue(row);
                        if (value) document.getElementById('width').value = value;
                    } else if (cellValue.includes('height') || cellValue.includes('h')) {
                        const value = this.extractNumericValue(row);
                        if (value) document.getElementById('height').value = value;
                    } else if (cellValue.includes('water') || cellValue.includes('depth')) {
                        const value = this.extractNumericValue(row);
                        if (value) document.getElementById('waterDepth').value = value;
                    }
                }
            }
        }
    }

    extractNumericValue(row) {
        for (let i = 1; i < row.length; i++) {
            const value = parseFloat(row[i]);
            if (!isNaN(value) && value > 0) {
                return value;
            }
        }
        return null;
    }

    async calculateDesign() {
        const formData = {
            length: parseFloat(document.getElementById('length').value) || 0,
            width: parseFloat(document.getElementById('width').value) || 0,
            height: parseFloat(document.getElementById('height').value) || 0,
            waterDepth: parseFloat(document.getElementById('waterDepth').value) || 0,
            soilType: document.getElementById('soilType').value,
            loadType: document.getElementById('loadType').value,
            safetyFactor: parseFloat(document.getElementById('safetyFactor').value) || 2.5
        };

        // Validate inputs
        if (formData.length <= 0 || formData.width <= 0 || formData.height <= 0) {
            this.showStatus('Please enter valid dimensions (length, width, height > 0)', 'error');
            return;
        }

        try {
            const response = await fetch('/calculate-causeway', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                this.displayResults(result);
                this.update3DModel(formData);
                this.updateCharts(result);
            } else {
                this.showStatus(`Calculation failed: ${result.error}`, 'error');
            }
        } catch (error) {
            this.showStatus(`Calculation failed: ${error.message}`, 'error');
        }
    }

    displayResults(result) {
        const container = document.getElementById('resultsContainer');
        
        // Enhanced computation trace HTML with categories
        const traceHTML = Array.isArray(result.trace) ? `
            <div class="result-card">
                <h4>Comprehensive Computation Trace</h4>
                <div class="trace-categories">
                    ${this.buildTraceByCategory(result.trace)}
                </div>
            </div>
        ` : '';
        
        // Enhanced inputs overview
        const inputs = result.inputs || null;
        const inputsHTML = inputs ? `
            <div class="result-card">
                <h4>Input Parameters & Design Data</h4>
                <div class="result-grid">
                    <div class="result-item"><div class="value">${inputs.length.value} ${inputs.length.unit}</div><div class="label">Length</div></div>
                    <div class="result-item"><div class="value">${inputs.width.value} ${inputs.width.unit}</div><div class="label">Width</div></div>
                    <div class="result-item"><div class="value">${inputs.height.value} ${inputs.height.unit}</div><div class="label">Height</div></div>
                    <div class="result-item"><div class="value">${inputs.waterDepth.value} ${inputs.waterDepth.unit}</div><div class="label">Water Depth</div></div>
                    <div class="result-item"><div class="value">${inputs.soilType.value}</div><div class="label">Soil Type</div></div>
                    <div class="result-item"><div class="value">${inputs.loadType.value}</div><div class="label">Load Class</div></div>
                    <div class="result-item"><div class="value">${inputs.safetyFactor.value}</div><div class="label">Safety Factor</div></div>
                    <div class="result-item"><div class="value">${inputs.hfl.value} ${inputs.hfl.unit}</div><div class="label">HFL</div></div>
                    <div class="result-item"><div class="value">${inputs.lbl.value} ${inputs.lbl.unit}</div><div class="label">LBL</div></div>
                    <div class="result-item"><div class="value">${inputs.bedSlope.value}</div><div class="label">Bed Slope</div></div>
                    <div class="result-item"><div class="value">${inputs.rugosityCoeff.value}</div><div class="label">Manning's n</div></div>
                    <div class="result-item"><div class="value">${inputs.catchmentArea.value} ${inputs.catchmentArea.unit}</div><div class="label">Catchment</div></div>
                </div>
            </div>
        ` : '';
        
        // Hydraulic design results
        const hydraulicsHTML = result.hydraulics ? `
            <div class="result-card">
                <h4>Hydraulic Design (IRC SP:82-2008)</h4>
                <div class="result-grid">
                    <div class="result-item">
                        <div class="value">${result.hydraulics.designDischarge} m³/s</div>
                        <div class="label">Design Discharge</div>
                    </div>
                    <div class="result-item">
                        <div class="value">${result.hydraulics.hydraulicRadius} m</div>
                        <div class="label">Hydraulic Radius</div>
                    </div>
                    <div class="result-item">
                        <div class="value">${result.hydraulics.velocity} m/s</div>
                        <div class="label">Flow Velocity</div>
                    </div>
                    <div class="result-item">
                        <div class="value">${result.hydraulics.ventPercentage}%</div>
                        <div class="label">Venting Ratio</div>
                    </div>
                    <div class="result-item">
                        <div class="value">${result.hydraulics.scourDepth} m</div>
                        <div class="label">Max Scour Depth</div>
                    </div>
                </div>
            </div>
        ` : '';
        
        // Load analysis results
        const loadsHTML = result.loads ? `
            <div class="result-card">
                <h4>Load Analysis (IRC 6:2000)</h4>
                <div class="result-grid">
                    <div class="result-item">
                        <div class="value">${result.loads.deadLoad} kN</div>
                        <div class="label">Dead Load</div>
                    </div>
                    <div class="result-item">
                        <div class="value">${result.loads.liveLoad} kN</div>
                        <div class="label">Live Load</div>
                    </div>
                    <div class="result-item">
                        <div class="value">${result.loads.impactLoad} kN</div>
                        <div class="label">Impact Load</div>
                    </div>
                    <div class="result-item">
                        <div class="value">${result.loads.windLoad} kN</div>
                        <div class="label">Wind Load</div>
                    </div>
                    <div class="result-item">
                        <div class="value">${result.loads.waterCurrentForce} kN</div>
                        <div class="label">Water Current</div>
                    </div>
                    <div class="result-item">
                        <div class="value">${result.loads.buoyancy} kN</div>
                        <div class="label">Buoyancy</div>
                    </div>
                    <div class="result-item">
                        <div class="value">${result.loads.totalVertical} kN</div>
                        <div class="label">Total Vertical</div>
                    </div>
                </div>
            </div>
        ` : '';
        
        // Safety checks
        const safetyHTML = result.safetyChecks ? `
            <div class="result-card ${result.safetyChecks.overall ? 'safe' : 'warning'}">
                <h4>Comprehensive Safety Assessment</h4>
                <div class="safety-grid">
                    <div class="safety-item ${result.safetyChecks.foundation ? 'safe' : 'warning'}">
                        <span class="indicator">${result.safetyChecks.foundation ? '✅' : '⚠️'}</span>
                        <span class="label">Foundation</span>
                    </div>
                    <div class="safety-item ${result.safetyChecks.ventway ? 'safe' : 'warning'}">
                        <span class="indicator">${result.safetyChecks.ventway ? '✅' : '⚠️'}</span>
                        <span class="label">Ventway</span>
                    </div>
                    <div class="safety-item ${result.safetyChecks.scour ? 'safe' : 'warning'}">
                        <span class="indicator">${result.safetyChecks.scour ? '✅' : '⚠️'}</span>
                        <span class="label">Scour</span>
                    </div>
                    <div class="safety-item ${result.safetyChecks.deflection ? 'safe' : 'warning'}">
                        <span class="indicator">${result.safetyChecks.deflection ? '✅' : '⚠️'}</span>
                        <span class="label">Deflection</span>
                    </div>
                </div>
                <p style="margin-top: 15px;"><strong>Overall Status:</strong> ${result.safetyChecks.overall ? '✅ DESIGN SAFE' : '⚠️ DESIGN REVIEW REQUIRED'}</p>
            </div>
        ` : '';
        
        container.innerHTML = `
            ${inputsHTML}
            ${hydraulicsHTML}
            ${loadsHTML}
            <div class="result-card">
                <h4>Structural Analysis</h4>
                <div class="result-grid">
                    <div class="result-item">
                        <div class="value">${result.calculations.volume} m³</div>
                        <div class="label">Volume</div>
                    </div>
                    <div class="result-item">
                        <div class="value">${result.calculations.surfaceArea} m²</div>
                        <div class="label">Surface Area</div>
                    </div>
                    <div class="result-item">
                        <div class="value">${result.calculations.bendingMoment} kN·m</div>
                        <div class="label">Max Moment</div>
                    </div>
                    <div class="result-item">
                        <div class="value">${result.calculations.deflection} mm</div>
                        <div class="label">Max Deflection</div>
                    </div>
                </div>
            </div>
            
            <div class="result-card">
                <h4>Foundation Design</h4>
                <div class="result-grid">
                    <div class="result-item">
                        <div class="value">${result.calculations.foundationPressure} kN/m²</div>
                        <div class="label">Foundation Pressure</div>
                    </div>
                    <div class="result-item">
                        <div class="value">${result.calculations.safetyMargin}</div>
                        <div class="label">Safety Factor</div>
                    </div>
                    <div class="result-item">
                        <div class="value">${result.recommendations.foundationType}</div>
                        <div class="label">Foundation Type</div>
                    </div>
                    <div class="result-item">
                        <div class="value">${result.recommendations.constructionMethod}</div>
                        <div class="label">Construction Method</div>
                    </div>
                </div>
            </div>
            
            <div class="result-card">
                <h4>Material Specifications (IRC Standards)</h4>
                <div class="result-grid">
                    <div class="result-item">
                        <div class="value">${result.calculations.materials.concrete} m³</div>
                        <div class="label">M25 Concrete</div>
                    </div>
                    <div class="result-item">
                        <div class="value">${(result.calculations.materials.steel/1000).toFixed(2)} tons</div>
                        <div class="label">Fe415 Steel</div>
                    </div>
                    <div class="result-item">
                        <div class="value">${result.calculations.materials.formwork} m²</div>
                        <div class="label">Formwork</div>
                    </div>
                </div>
            </div>
            
            ${safetyHTML}
            ${traceHTML}
        `;
        
        // Add CSS for enhanced styling
        this.addEnhancedStyling();

        // Show PDF generation section
        document.getElementById('pdfGenerationSection').style.display = 'block';
        
        // Store results for PDF generation
        this.currentResults = result;
    }
    
    buildTraceByCategory(trace) {
        const categories = {};
        trace.forEach(item => {
            if (!categories[item.category]) categories[item.category] = [];
            categories[item.category].push(item);
        });
        
        return Object.entries(categories).map(([category, items]) => `
            <div class="trace-category">
                <h5>${category} Calculations</h5>
                <div style="max-height: 300px; overflow:auto; border:1px solid #e2e8f0; border-radius:6px; margin:10px 0;">
                    <table style="width:100%; border-collapse: collapse; font-size: 0.9em;">
                        <thead>
                            <tr style="background:#f8f9fa;">
                                <th style="padding:6px 8px; border:1px solid #e2e8f0; text-align:left;">Parameter</th>
                                <th style="padding:6px 8px; border:1px solid #e2e8f0; text-align:left;">Formula</th>
                                <th style="padding:6px 8px; border:1px solid #e2e8f0; text-align:left;">Calculation</th>
                                <th style="padding:6px 8px; border:1px solid #e2e8f0; text-align:left;">Result</th>
                                <th style="padding:6px 8px; border:1px solid #e2e8f0; text-align:left;">Reference</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items.map(item => `
                                <tr>
                                    <td style="padding:6px 8px; border:1px solid #e2e8f0; font-weight:500;">${item.name}</td>
                                    <td style="padding:6px 8px; border:1px solid #e2e8f0; font-family:'Courier New',monospace; color:#2563eb;">${item.formula}</td>
                                    <td style="padding:6px 8px; border:1px solid #e2e8f0; font-family:'Courier New',monospace; color:#059669;">${item.substituted}</td>
                                    <td style="padding:6px 8px; border:1px solid #e2e8f0; font-weight:600; color:#dc2626;">${item.result}</td>
                                    <td style="padding:6px 8px; border:1px solid #e2e8f0; font-size:0.8em; color:#6b7280;">${item.reference}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `).join('');
    }
    
    addEnhancedStyling() {
        const style = document.createElement('style');
        style.textContent = `
            .trace-category h5 {
                color: #374151;
                margin: 15px 0 5px 0;
                padding: 8px 12px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 4px;
                font-size: 0.95em;
            }
            .safety-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 10px;
                margin: 15px 0;
            }
            .safety-item {
                display: flex;
                align-items: center;
                padding: 8px 12px;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                background: #f9fafb;
            }
            .safety-item.safe {
                border-color: #10b981;
                background: #ecfdf5;
            }
            .safety-item.warning {
                border-color: #f59e0b;
                background: #fffbeb;
            }
            .safety-item .indicator {
                margin-right: 8px;
                font-size: 1.1em;
            }
            .safety-item .label {
                font-size: 0.9em;
                font-weight: 500;
            }
        `;
        if (!document.head.querySelector('#enhanced-styling')) {
            style.id = 'enhanced-styling';
            document.head.appendChild(style);
        }
    }

    async generatePDFReport() {
        if (!this.currentResults) {
            this.showStatus('Please calculate design first', 'error');
            return;
        }

        try {
            this.showStatus('Generating comprehensive PDF report...', 'loading');
            
            // Optimize Excel data to reduce payload size
            let optimizedExcelData = null;
            if (this.excelData && this.excelData.sheets) {
                optimizedExcelData = {
                    sheetNames: this.excelData.sheetNames || [],
                    sheets: {}
                };
                
                // Only include essential sheet data, limit rows per sheet
                Object.keys(this.excelData.sheets).forEach(sheetName => {
                    const sheetData = this.excelData.sheets[sheetName];
                    if (Array.isArray(sheetData)) {
                        // Limit to first 50 rows to reduce size
                        optimizedExcelData.sheets[sheetName] = sheetData.slice(0, 50);
                    }
                });
            }
            
            const reportData = {
                designData: {
                    length: parseFloat(document.getElementById('length').value) || 0,
                    width: parseFloat(document.getElementById('width').value) || 0,
                    height: parseFloat(document.getElementById('height').value) || 0,
                    waterDepth: parseFloat(document.getElementById('waterDepth').value) || 0,
                    soilType: document.getElementById('soilType').value,
                    loadType: document.getElementById('loadType').value,
                    safetyFactor: parseFloat(document.getElementById('safetyFactor').value) || 2.5,
                    projectName: 'Submersible Causeway Design'
                },
                calculationResults: this.currentResults,
                excelData: optimizedExcelData
            };

            // Log payload size for debugging
            const payloadSize = new Blob([JSON.stringify(reportData)]).size;
            console.log('PDF generation payload size:', Math.round(payloadSize / 1024), 'KB');
            
            if (payloadSize > 45 * 1024 * 1024) { // 45MB limit
                console.warn('Payload size exceeds 45MB, further reducing Excel data...');
                // Further reduce Excel data if still too large
                if (optimizedExcelData && optimizedExcelData.sheets) {
                    Object.keys(optimizedExcelData.sheets).forEach(sheetName => {
                        optimizedExcelData.sheets[sheetName] = optimizedExcelData.sheets[sheetName].slice(0, 20);
                    });
                }
                reportData.excelData = optimizedExcelData;
            }

            console.log('Sending PDF generation request with optimized data');

            const response = await fetch('/generate-pdf-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reportData)
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            // Check if response is OK before trying to parse JSON
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error response:', errorText);
                
                // Check for specific payload size error
                if (response.status === 413) {
                    throw new Error('Request payload too large. The Excel data or calculation results are too big. Please try with smaller data or contact support.');
                }
                
                throw new Error(`Server error: ${response.status} - ${errorText}`);
            }

            const responseText = await response.text();
            console.log('Raw response received, length:', responseText.length);

            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                console.error('Response that failed to parse:', responseText.substring(0, 500) + '...');
                throw new Error(`Invalid JSON response: ${parseError.message}`);
            }

            if (result.success) {
                this.showStatus('PDF report generated successfully!', 'success');
                
                // Create and download the report
                this.downloadReport(result.htmlContent);
                
                // Show payload information if available
                if (result.payloadInfo) {
                    console.log('Payload info:', result.payloadInfo);
                }
            } else {
                this.showStatus(`PDF generation failed: ${result.error}`, 'error');
            }
        } catch (error) {
            console.error('PDF generation error:', error);
            this.showStatus(`PDF generation failed: ${error.message}`, 'error');
        }
    }

    // Generate Excel Workbook
    async generateExcelWorkbook() {
        if (!this.currentResults) {
            this.showStatus('Please calculate design first', 'error');
            return;
        }

        try {
            this.showStatus('Generating Excel workbook with formulas...', 'loading');
            
            const workbookData = {
                designData: {
                    length: parseFloat(document.getElementById('length').value) || 0,
                    width: parseFloat(document.getElementById('width').value) || 0,
                    height: parseFloat(document.getElementById('height').value) || 0,
                    waterDepth: parseFloat(document.getElementById('waterDepth').value) || 0,
                    soilType: document.getElementById('soilType').value,
                    loadType: document.getElementById('loadType').value,
                    safetyFactor: parseFloat(document.getElementById('safetyFactor').value) || 2.5,
                    projectName: 'Submersible Causeway Design'
                },
                calculationResults: this.currentResults
            };

            console.log('Sending Excel workbook generation request with data:', workbookData);

            const response = await fetch('/generate-excel-workbook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(workbookData)
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Causeway_Design_Workbook.xlsx';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                this.showStatus('Excel workbook generated successfully!', 'success');
            } else {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status} - ${errorText}`);
            }
        } catch (error) {
            console.error('Excel workbook generation error:', error);
            this.showStatus(`Excel workbook generation failed: ${error.message}`, 'error');
        }
    }

    downloadReport(htmlContent) {
        // Create a new window with the report content
        const reportWindow = window.open('', '_blank');
        reportWindow.document.write(htmlContent);
        reportWindow.document.close();
        
        // Add print functionality
        reportWindow.focus();
        
        // Show success message with instructions
        this.showStatus('Report opened in new window. Use Ctrl+P to print or save as PDF.', 'success');
    }

    // Drawing functionality
    initializeDrawingCanvas() {
        this.canvas = new fabric.Canvas('drawingCanvas', {
            isDrawingMode: false
        });

        const container = document.querySelector('.canvas-container');
        const width = Math.min(1000, container.clientWidth - 40);
        const height = Math.max(400, Math.min(700, container.clientHeight - 40 || 600));
        this.canvas.setWidth(width);
        this.canvas.setHeight(height);
        this.canvas.backgroundColor = '#ffffff';

        // Drawing mode
        this.canvas.freeDrawingBrush.width = 2;
        this.canvas.freeDrawingBrush.color = '#667eea';

        // Mouse events
        this.canvas.on('mouse:down', (e) => {
            if (this.currentTool === 'line') {
                this.startDrawingLine(e);
            }
        });

        this.canvas.on('mouse:up', (e) => {
            if (this.currentTool === 'line') {
                this.finishDrawingLine(e);
            }
        });
    }

    setDrawingTool(tool) {
        this.currentTool = tool;
        
        // Update active tool button
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tool="${tool}"]`).classList.add('active');

        // Set canvas mode
        if (tool === 'select') {
            this.canvas.isDrawingMode = false;
            this.canvas.selection = true;
        } else if (tool === 'line') {
            this.canvas.isDrawingMode = false;
            this.canvas.selection = false;
        } else if (tool === 'rectangle') {
            this.canvas.isDrawingMode = false;
            this.canvas.selection = false;
            this.addRectangle();
        } else if (tool === 'circle') {
            this.canvas.isDrawingMode = false;
            this.canvas.selection = false;
            this.addCircle();
        } else if (tool === 'text') {
            this.canvas.isDrawingMode = false;
            this.canvas.selection = false;
            this.addText();
        }
    }

    addRectangle() {
        const rect = new fabric.Rect({
            left: 100,
            top: 100,
            width: 100,
            height: 60,
            fill: 'transparent',
            stroke: '#667eea',
            strokeWidth: 2
        });
        this.canvas.add(rect);
        this.canvas.setActiveObject(rect);
    }

    addCircle() {
        const circle = new fabric.Circle({
            left: 100,
            top: 100,
            radius: 50,
            fill: 'transparent',
            stroke: '#667eea',
            strokeWidth: 2
        });
        this.canvas.add(circle);
        this.canvas.setActiveObject(circle);
    }

    addText() {
        const text = new fabric.IText('Enter text', {
            left: 100,
            top: 100,
            fontSize: 20,
            fill: '#667eea'
        });
        this.canvas.add(text);
        this.canvas.setActiveObject(text);
    }

    startDrawingLine(e) {
        const pointer = this.canvas.getPointer(e.e);
        this.lineStart = pointer;
    }

    finishDrawingLine(e) {
        if (!this.lineStart) return;
        
        const pointer = this.canvas.getPointer(e.e);
        const line = new fabric.Line([this.lineStart.x, this.lineStart.y, pointer.x, pointer.y], {
            stroke: '#667eea',
            strokeWidth: 2
        });
        this.canvas.add(line);
        this.lineStart = null;
    }

    clearDrawing() {
        this.canvas.clear();
        this.canvas.backgroundColor = '#ffffff';
    }

    saveDrawing() {
        const dataURL = this.canvas.toDataURL({
            format: 'png',
            quality: 1
        });
        
        const link = document.createElement('a');
        link.download = 'causeway-drawing.png';
        link.href = dataURL;
        link.click();
    }

    // 3D Visualization
    initialize3DScene() {
        const container = document.getElementById('3dScene');
        
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.camera.position.set(10, 10, 10);
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        container.appendChild(this.renderer.domElement);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        // Default causeway model
        this.createDefaultCauseway();
        
        // Controls
        this.controls = {
            rotationX: 0,
            rotationY: 0,
            zoom: 1
        };
        
        this.animate3D();
    }

    createDefaultCauseway() {
        // Remove existing model
        this.scene.children = this.scene.children.filter(child => 
            child.type === 'AmbientLight' || child.type === 'DirectionalLight'
        );
        
        // Create causeway geometry
        const geometry = new THREE.BoxGeometry(10, 1, 2);
        const material = new THREE.MeshLambertMaterial({ 
            color: 0x8B4513,
            transparent: true,
            opacity: 0.8
        });
        
        this.causeway = new THREE.Mesh(geometry, material);
        this.causeway.castShadow = true;
        this.causeway.receiveShadow = true;
        this.scene.add(this.causeway);
        
        // Add water surface
        const waterGeometry = new THREE.PlaneGeometry(20, 20);
        const waterMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4169E1,
            transparent: true,
            opacity: 0.6
        });
        
        this.water = new THREE.Mesh(waterGeometry, waterMaterial);
        this.water.rotation.x = -Math.PI / 2;
        this.water.position.y = -0.5;
        this.scene.add(this.water);
    }

    update3DModel(dimensions) {
        if (!this.causeway) return;
        
        // Update causeway dimensions
        this.causeway.scale.set(
            dimensions.length / 10,
            dimensions.height,
            dimensions.width / 2
        );
        
        // Update water level
        if (this.water) {
            this.water.position.y = -dimensions.height / 2 - dimensions.waterDepth;
        }
    }

    rotate3D(axis, value) {
        this.controls[`rotation${axis.toUpperCase()}`] = parseFloat(value);
    }

    zoom3D(value) {
        this.controls.zoom = parseFloat(value);
    }

    reset3DView() {
        this.controls.rotationX = 0;
        this.controls.rotationY = 0;
        this.controls.zoom = 1;
        
        document.getElementById('rotX').value = 0;
        document.getElementById('rotY').value = 0;
        document.getElementById('zoom').value = 1;
    }

    animate3D() {
        if (this.currentTab !== '3d') return;
        
        requestAnimationFrame(() => this.animate3D());
        
        if (this.causeway) {
            this.causeway.rotation.x = THREE.MathUtils.degToRad(this.controls.rotationX);
            this.causeway.rotation.y = THREE.MathUtils.degToRad(this.controls.rotationY);
        }
        
        const dir = new THREE.Vector3();
        this.camera.getWorldDirection(dir);
        const distance = 15 / this.controls.zoom;
        this.camera.position.copy(dir.multiplyScalar(-distance));
        this.camera.position.y = 10 / this.controls.zoom;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }

    // Charts and Analysis
    initializeCharts() {
        // Load Distribution Chart
        const loadCtx = document.getElementById('loadChart').getContext('2d');
        this.charts.load = new Chart(loadCtx, {
            type: 'doughnut',
            data: {
                labels: ['Dead Load', 'Live Load'],
                datasets: [{
                    data: [70, 30],
                    backgroundColor: ['#667eea', '#48bb78']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        // Material Quantities Chart
        const materialCtx = document.getElementById('materialChart').getContext('2d');
        this.charts.material = new Chart(materialCtx, {
            type: 'bar',
            data: {
                labels: ['Concrete', 'Steel', 'Formwork'],
                datasets: [{
                    label: 'Quantity',
                    data: [100, 8, 120],
                    backgroundColor: ['#667eea', '#718096', '#ed8936']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    updateCharts(calculationResults) {
        if (this.charts.load && calculationResults.calculations) {
            const { deadLoad, liveLoad } = calculationResults.calculations;
            this.charts.load.data.datasets[0].data = [deadLoad, liveLoad];
            this.charts.load.update();
        }

        if (this.charts.material && calculationResults.calculations.materials) {
            const { concrete, steel, formwork } = calculationResults.calculations.materials;
            this.charts.material.data.datasets[0].data = [concrete, steel, formwork];
            this.charts.material.update();
        }
    }

    updateAnalysis() {
        if (!this.excelData) return;
        
        const tableContainer = document.getElementById('analysisTable');
        
        let tableHTML = '<table style="width: 100%; border-collapse: collapse;">';
        tableHTML += '<thead><tr><th style="padding: 12px; border: 1px solid #e2e8f0; background: #f7fafc;">Parameter</th><th style="padding: 12px; border: 1px solid #e2e8f0; background: #f7fafc;">Value</th><th style="padding: 12px; border: 1px solid #e2e8f0; background: #f7fafc;">Unit</th></tr></thead><tbody>';
        
        // Add Excel data to table
        if (this.excelData.sheets) {
            Object.entries(this.excelData.sheets).forEach(([sheetName, data]) => {
                if (data && data.length > 0) {
                    tableHTML += `<tr><td colspan="3" style="padding: 8px; background: #667eea; color: white; font-weight: bold;">${sheetName}</td></tr>`;
                    
                    data.slice(0, 10).forEach(row => {
                        if (row && row.length > 0) {
                            tableHTML += '<tr>';
                            row.forEach((cell, index) => {
                                const style = index === 0 ? 'font-weight: bold; background: #f7fafc;' : '';
                                tableHTML += `<td style="padding: 8px; border: 1px solid #e2e8f0; ${style}">${cell || ''}</td>`;
                            });
                            tableHTML += '</tr>';
                        }
                    });
                }
            });
        }
        
        tableHTML += '</tbody></table>';
        tableContainer.innerHTML = tableHTML;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CausewayDesignApp();
});

// Handle window resize for 3D scene
window.addEventListener('resize', () => {
    const container = document.getElementById('3dScene');
    if (container && window.app && window.app.renderer) {
        window.app.renderer.setSize(container.clientWidth, container.clientHeight);
        window.app.camera.aspect = container.clientWidth / container.clientHeight;
        window.app.camera.updateProjectionMatrix();
    }
});


// ============================================================================
// GIFT FEATURES INTEGRATION
// ============================================================================

// Extend the calculateDesign function to include health score
const originalCalculateDesign = CausewayDesignApp.prototype.calculateDesign;
CausewayDesignApp.prototype.calculateDesign = function() {
    originalCalculateDesign.call(this);
    
    // After calculation, update health score and add to recent designs
    setTimeout(() => {
        if (window.lastCalculationResult) {
            const healthScore = designHealthScore.calculate(window.lastCalculationResult);
            if (healthScore) {
                designHealthScore.render(healthScore);
            }
            
            // Add to recent designs
            quickActionsDashboard.addRecentDesign(window.lastCalculationResult);
        }
    }, 500);
};

// Add library export button handler
document.addEventListener('DOMContentLoaded', () => {
    const exportBtn = document.getElementById('exportLibraryBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            designLibrary.exportLibrary();
        });
    }
    
    const importFile = document.getElementById('importLibraryFile');
    if (importFile) {
        importFile.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                designLibrary.importLibrary(e.target.files[0]);
            }
        });
    }
    
    // Initialize templates
    designTemplates.renderTemplates();
    
    // Initialize library
    designLibrary.renderLibrary();
});

// Override switchTab to handle new tabs
const originalSwitchTab = CausewayDesignApp.prototype.switchTab;
CausewayDesignApp.prototype.switchTab = function(tabName) {
    originalSwitchTab.call(this, tabName);
    
    // Render content for specific tabs
    if (tabName === 'dashboard') {
        quickActionsDashboard.render();
    } else if (tabName === 'templates') {
        designTemplates.renderTemplates();
    } else if (tabName === 'library') {
        designLibrary.renderLibrary();
    } else if (tabName === 'health' && window.lastCalculationResult) {
        const healthScore = designHealthScore.calculate(window.lastCalculationResult);
        if (healthScore) {
            designHealthScore.render(healthScore);
        }
    }
};

// Store last calculation result globally for health score
window.lastCalculationResult = null;

// Intercept fetch responses to store calculation results
const originalFetch = window.fetch;
window.fetch = function(...args) {
    return originalFetch.apply(this, args).then(response => {
        const clonedResponse = response.clone();
        
        if (args[0] === '/calculate-causeway' && response.ok) {
            clonedResponse.json().then(data => {
                if (data.success) {
                    window.lastCalculationResult = data;
                }
            }).catch(() => {});
        }
        
        return response;
    });
};
