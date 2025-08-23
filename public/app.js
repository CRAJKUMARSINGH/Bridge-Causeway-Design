// Causeway Design Pro - Main Application
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
        
        container.innerHTML = `
            <div class="result-card">
                <h4>Structural Calculations</h4>
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
                        <div class="value">${result.calculations.perimeter} m</div>
                        <div class="label">Perimeter</div>
                    </div>
                    <div class="result-item">
                        <div class="value">${result.calculations.totalLoad} kN</div>
                        <div class="label">Total Load</div>
                    </div>
                </div>
            </div>
            
            <div class="result-card">
                <h4>Foundation Analysis</h4>
                <div class="result-grid">
                    <div class="result-item">
                        <div class="value">${result.calculations.foundationPressure} kN/m²</div>
                        <div class="label">Foundation Pressure</div>
                    </div>
                    <div class="result-item">
                        <div class="value">${result.calculations.safetyMargin}</div>
                        <div class="label">Safety Margin</div>
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
                <h4>Material Quantities</h4>
                <div class="result-grid">
                    <div class="result-item">
                        <div class="value">${result.calculations.materials.concrete} m³</div>
                        <div class="label">Concrete</div>
                    </div>
                    <div class="result-item">
                        <div class="value">${result.calculations.materials.steel} tons</div>
                        <div class="label">Steel</div>
                    </div>
                    <div class="result-item">
                        <div class="value">${result.calculations.materials.formwork} m²</div>
                        <div class="label">Formwork</div>
                    </div>
                </div>
            </div>
            
            <div class="result-card ${result.recommendations.isSafe ? 'safe' : 'warning'}">
                <h4>Safety Assessment</h4>
                <p><strong>Status:</strong> ${result.recommendations.isSafe ? '✅ SAFE' : '⚠️ REVIEW REQUIRED'}</p>
                <p><strong>Safety Factor:</strong> ${result.calculations.safetyMargin}</p>
                <p><strong>Recommendation:</strong> ${result.recommendations.isSafe ? 'Design meets safety requirements' : 'Consider increasing dimensions or improving foundation'}</p>
            </div>
        `;

        // Show PDF generation section
        document.getElementById('pdfGenerationSection').style.display = 'block';
        
        // Store results for PDF generation
        this.currentResults = result;
    }

    async generatePDFReport() {
        if (!this.currentResults) {
            this.showStatus('Please calculate design first', 'error');
            return;
        }

        try {
            this.showStatus('Generating comprehensive PDF report...', 'loading');
            
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
                excelData: this.excelData
            };

            console.log('Sending PDF generation request with data:', reportData);

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
                throw new Error(`Server error: ${response.status} - ${errorText}`);
            }

            const responseText = await response.text();
            console.log('Raw response text:', responseText);

            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                console.error('Response that failed to parse:', responseText);
                throw new Error(`Invalid JSON response: ${parseError.message}`);
            }

            if (result.success) {
                this.showStatus('PDF report generated successfully!', 'success');
                
                // Create and download the report
                this.downloadReport(result.htmlContent);
            } else {
                this.showStatus(`PDF generation failed: ${result.error}`, 'error');
            }
        } catch (error) {
            console.error('PDF generation error:', error);
            this.showStatus(`PDF generation failed: ${error.message}`, 'error');
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

        this.canvas.setWidth(800);
        this.canvas.setHeight(600);
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
        
        this.camera.position.multiplyScalar(this.controls.zoom / this.camera.position.length());
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
    new CausewayDesignApp();
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
