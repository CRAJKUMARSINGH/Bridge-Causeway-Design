// Enhanced Causeway Design Pro - Advanced Features
// This file extends the base app.js with optimization, cost estimation, and comparison features

// Initialize enhanced features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeEnhancedFeatures();
});

function initializeEnhancedFeatures() {
    // Optimization features
    const analyzeOptBtn = document.getElementById('analyzeOptimizationBtn');
    if (analyzeOptBtn) {
        analyzeOptBtn.addEventListener('click', analyzeOptimization);
    }
    
    // Design session management
    const saveDesignBtn = document.getElementById('saveCurrentDesignBtn');
    if (saveDesignBtn) {
        saveDesignBtn.addEventListener('click', saveCurrentDesign);
    }
    
    const loadDesignBtn = document.getElementById('loadSavedDesignBtn');
    if (loadDesignBtn) {
        loadDesignBtn.addEventListener('click', loadSavedDesign);
    }
    
    const compareBtn = document.getElementById('compareDesignsBtn');
    if (compareBtn) {
        compareBtn.addEventListener('click', compareDesigns);
    }
    
    // Environmental assessment
    const assessEnvBtn = document.getElementById('assessEnvironmentBtn');
    if (assessEnvBtn) {
        assessEnvBtn.addEventListener('click', assessEnvironmentalImpact);
    }
    
    // Cost estimation
    const calculateCostBtn = document.getElementById('calculateCostBtn');
    if (calculateCostBtn) {
        calculateCostBtn.addEventListener('click', calculateCost);
    }
}

// Optimization Analysis
async function analyzeOptimization() {
    const currentResults = window.currentResults;
    
    if (!currentResults) {
        showMessage('Please calculate a design first', 'error');
        return;
    }
    
    try {
        showMessage('Analyzing design for optimization opportunities...', 'info');
        
        const response = await fetch('/optimize-design', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                designData: getCurrentDesignData(),
                calculationResults: currentResults
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            displayOptimizationResults(result);
        } else {
            showMessage('Optimization analysis failed', 'error');
        }
    } catch (error) {
        showMessage(`Error: ${error.message}`, 'error');
    }
}

function displayOptimizationResults(result) {
    const container = document.getElementById('optimizationResults');
    
    if (result.optimizations.length === 0) {
        container.innerHTML = `
            <div class="message success slide-in">
                <i class="fas fa-check-circle"></i>
                <div>
                    <strong>Design is Already Optimized!</strong>
                    <p>${result.overallPotentialSavings}</p>
                </div>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="message success slide-in">
            <i class="fas fa-lightbulb"></i>
            <div>
                <strong>Optimization Opportunities Found!</strong>
                <p>Potential Savings: ${result.overallPotentialSavings}</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">${result.safetyNote}</p>
            </div>
        </div>
    `;
    
    result.optimizations.forEach((opt, index) => {
        html += `
            <div class="optimization-card ${opt.type} slide-in" style="animation-delay: ${index * 0.1}s">
                <h4>
                    <i class="fas fa-${getOptimizationIcon(opt.type)}"></i>
                    ${formatOptimizationType(opt.type)}
                </h4>
                <p class="suggestion">${opt.suggestion}</p>
                <div>
                    <span class="savings">💰 ${opt.potentialSavings}</span>
                    <span class="impact ${opt.impact}">
                        ${opt.impact === 'low_risk' ? '✓ Low Risk' : 
                          opt.impact === 'medium_risk' ? '⚠ Medium Risk' : '⚠️ High Risk'}
                    </span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function getOptimizationIcon(type) {
    const icons = {
        'cost_reduction': 'dollar-sign',
        'material_optimization': 'cubes',
        'hydraulic_optimization': 'water',
        'foundation_optimization': 'layer-group'
    };
    return icons[type] || 'lightbulb';
}

function formatOptimizationType(type) {
    return type.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Design Session Management
async function saveCurrentDesign() {
    const currentResults = window.currentResults;
    
    if (!currentResults) {
        showMessage('No design to save. Calculate a design first.', 'error');
        return;
    }
    
    const sessionName = prompt('Enter a name for this design:', `Design_${new Date().toLocaleDateString()}`);
    
    if (!sessionName) return;
    
    try {
        const response = await fetch('/save-design-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionName,
                designData: getCurrentDesignData(),
                calculationResults: currentResults
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(`Design saved successfully as "${sessionName}"`, 'success');
            window.savedSessionId = result.sessionId;
        } else {
            showMessage('Failed to save design', 'error');
        }
    } catch (error) {
        showMessage(`Error: ${error.message}`, 'error');
    }
}

async function loadSavedDesign() {
    try {
        const response = await fetch('/list-design-sessions');
        const result = await response.json();
        
        if (result.success && result.sessions.length > 0) {
            displaySavedDesignsList(result.sessions);
        } else {
            showMessage('No saved designs found', 'info');
        }
    } catch (error) {
        showMessage(`Error: ${error.message}`, 'error');
    }
}

function displaySavedDesignsList(sessions) {
    const container = document.getElementById('comparisonResults');
    
    let html = `
        <div class="saved-designs-list slide-in">
            <h4>Saved Designs</h4>
    `;
    
    sessions.forEach(session => {
        html += `
            <div class="saved-design-item" onclick="loadSpecificDesign('${session.id}')">
                <div>
                    <div class="name">${session.name}</div>
                    <div class="timestamp">${new Date(session.timestamp).toLocaleString()}</div>
                </div>
                <i class="fas fa-chevron-right"></i>
            </div>
        `;
    });
    
    html += `</div>`;
    container.innerHTML = html;
}

async function loadSpecificDesign(sessionId) {
    try {
        const response = await fetch(`/load-design-session/${sessionId}`);
        const result = await response.json();
        
        if (result.success) {
            // Populate form with loaded design
            const design = result.session.designData;
            document.getElementById('length').value = design.length;
            document.getElementById('width').value = design.width;
            document.getElementById('height').value = design.height;
            document.getElementById('waterDepth').value = design.waterDepth;
            document.getElementById('soilType').value = design.soilType;
            document.getElementById('loadType').value = design.loadType;
            document.getElementById('safetyFactor').value = design.safetyFactor;
            
            showMessage(`Loaded design: ${result.session.name}`, 'success');
            window.loadedSessionId = sessionId;
        } else {
            showMessage('Failed to load design', 'error');
        }
    } catch (error) {
        showMessage(`Error: ${error.message}`, 'error');
    }
}

async function compareDesigns() {
    if (!window.currentResults || !window.savedSessionId) {
        showMessage('Please save a design and calculate another design to compare', 'error');
        return;
    }
    
    try {
        const savedResponse = await fetch(`/load-design-session/${window.savedSessionId}`);
        const savedResult = await savedResponse.json();
        
        if (!savedResult.success) {
            showMessage('Failed to load saved design for comparison', 'error');
            return;
        }
        
        const compareResponse = await fetch('/compare-designs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                design1: savedResult.session.calculationResults,
                design2: window.currentResults
            })
        });
        
        const comparison = await compareResponse.json();
        
        if (comparison.success) {
            displayComparisonResults(comparison, savedResult.session.name);
        } else {
            showMessage('Comparison failed', 'error');
        }
    } catch (error) {
        showMessage(`Error: ${error.message}`, 'error');
    }
}

function displayComparisonResults(comparison, savedDesignName) {
    const container = document.getElementById('comparisonResults');
    
    const html = `
        <div class="comparison-table slide-in">
            <h4>Design Comparison Results</h4>
            <table>
                <thead>
                    <tr>
                        <th>Parameter</th>
                        <th>${savedDesignName}</th>
                        <th>Current Design</th>
                        <th>Difference</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Volume</strong></td>
                        <td>Baseline</td>
                        <td>-</td>
                        <td class="${parseFloat(comparison.volumeDiff) > 0 ? 'worse' : 'better'}">
                            ${comparison.volumeDiff}%
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Cost</strong></td>
                        <td>Baseline</td>
                        <td>-</td>
                        <td class="${parseFloat(comparison.costDiff) > 0 ? 'worse' : 'better'}">
                            ${comparison.costDiff}%
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Safety Margin</strong></td>
                        <td>Baseline</td>
                        <td>-</td>
                        <td class="${parseFloat(comparison.safetyDiff) > 0 ? 'better' : 'worse'}">
                            ${comparison.safetyDiff > 0 ? '+' : ''}${comparison.safetyDiff}
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Concrete</strong></td>
                        <td>Baseline</td>
                        <td>-</td>
                        <td class="${parseFloat(comparison.materialDiff.concrete) > 0 ? 'worse' : 'better'}">
                            ${comparison.materialDiff.concrete > 0 ? '+' : ''}${comparison.materialDiff.concrete} m³
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Steel</strong></td>
                        <td>Baseline</td>
                        <td>-</td>
                        <td class="${parseFloat(comparison.materialDiff.steel) > 0 ? 'worse' : 'better'}">
                            ${comparison.materialDiff.steel > 0 ? '+' : ''}${comparison.materialDiff.steel} kg
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="message info" style="margin-top: 1rem;">
                <i class="fas fa-info-circle"></i>
                <strong>Recommendation:</strong> ${comparison.recommendation}
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Environmental Impact Assessment
async function assessEnvironmentalImpact() {
    const currentResults = window.currentResults;
    
    if (!currentResults) {
        showMessage('Please calculate a design first', 'error');
        return;
    }
    
    try {
        const response = await fetch('/environmental-impact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ calculationResults: currentResults })
        });
        
        const result = await response.json();
        
        if (result.success) {
            displayEnvironmentalResults(result);
        } else {
            showMessage('Environmental assessment failed', 'error');
        }
    } catch (error) {
        showMessage(`Error: ${error.message}`, 'error');
    }
}

function displayEnvironmentalResults(result) {
    const container = document.getElementById('environmentalResults');
    
    const html = `
        <div class="environmental-card slide-in">
            <h4><i class="fas fa-cloud"></i> Carbon Footprint Analysis</h4>
            <div class="carbon-footprint">
                <div class="carbon-item">
                    <div class="value">${(result.carbonFootprint.total / 1000).toFixed(2)}</div>
                    <div class="label">Total CO₂ (tons)</div>
                </div>
                <div class="carbon-item">
                    <div class="value">${(result.carbonFootprint.concrete / 1000).toFixed(2)}</div>
                    <div class="label">Concrete CO₂ (tons)</div>
                </div>
                <div class="carbon-item">
                    <div class="value">${(result.carbonFootprint.steel / 1000).toFixed(2)}</div>
                    <div class="label">Steel CO₂ (tons)</div>
                </div>
            </div>
            <p style="text-align: center; color: #718096; margin-bottom: 1rem;">
                ${result.carbonFootprint.equivalent}
            </p>
        </div>
        
        <div class="environmental-card slide-in" style="animation-delay: 0.1s">
            <h4><i class="fas fa-water"></i> Water Impact Assessment</h4>
            <div class="carbon-footprint">
                <div class="carbon-item">
                    <div class="value">${result.waterImpact.flowObstruction}%</div>
                    <div class="label">Flow Obstruction</div>
                </div>
                <div class="carbon-item">
                    <div class="value">${result.waterImpact.scourRisk} m</div>
                    <div class="label">Scour Risk</div>
                </div>
            </div>
            <div style="text-align: center; margin-top: 1rem;">
                <span class="environmental-rating ${result.waterImpact.rating.toLowerCase().replace(' ', '-')}">
                    ${result.waterImpact.rating}
                </span>
            </div>
        </div>
        
        <div class="environmental-card slide-in" style="animation-delay: 0.2s">
            <h4><i class="fas fa-leaf"></i> Recommendations</h4>
            <ul class="recommendations-list">
                ${result.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
    `;
    
    container.innerHTML = html;
}

// Cost Estimation
async function calculateCost() {
    const currentResults = window.currentResults;
    
    if (!currentResults) {
        showMessage('Please calculate a design first', 'error');
        return;
    }
    
    const region = document.getElementById('regionSelect').value;
    
    try {
        showMessage('Calculating cost estimation...', 'info');
        
        const response = await fetch('/estimate-cost', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                calculationResults: currentResults,
                region
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            displayCostResults(result);
        } else {
            showMessage('Cost estimation failed', 'error');
        }
    } catch (error) {
        showMessage(`Error: ${error.message}`, 'error');
    }
}

function displayCostResults(result) {
    const container = document.getElementById('costResults');
    
    const html = `
        <div class="cost-summary slide-in">
            <h3>Cost Breakdown</h3>
            <div class="cost-grid">
                <div class="cost-item">
                    <div class="value">₹${formatNumber(result.costs.materials.concrete)}</div>
                    <div class="label">Concrete</div>
                </div>
                <div class="cost-item">
                    <div class="value">₹${formatNumber(result.costs.materials.steel)}</div>
                    <div class="label">Steel</div>
                </div>
                <div class="cost-item">
                    <div class="value">₹${formatNumber(result.costs.materials.formwork)}</div>
                    <div class="label">Formwork</div>
                </div>
                <div class="cost-item">
                    <div class="value">₹${formatNumber(result.costs.materials.excavation)}</div>
                    <div class="label">Excavation</div>
                </div>
                <div class="cost-item">
                    <div class="value">₹${formatNumber(result.costs.labor)}</div>
                    <div class="label">Labor</div>
                </div>
            </div>
            
            <div class="total-cost">
                <div class="value">₹${formatNumber(result.costs.total)}</div>
                <div class="label">Total Project Cost</div>
            </div>
            
            <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(102, 126, 234, 0.1); border-radius: 8px;">
                <h4 style="margin-bottom: 0.5rem; color: #2d3748;">Cost Distribution</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.5rem;">
                    <div><strong>Concrete:</strong> ${result.breakdown.concrete}</div>
                    <div><strong>Steel:</strong> ${result.breakdown.steel}</div>
                    <div><strong>Formwork:</strong> ${result.breakdown.formwork}</div>
                    <div><strong>Excavation:</strong> ${result.breakdown.excavation}</div>
                    <div><strong>Labor:</strong> ${result.breakdown.labor}</div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Create cost breakdown chart
    createCostChart(result);
}

function createCostChart(result) {
    const ctx = document.getElementById('costChart');
    if (!ctx) return;
    
    // Destroy existing chart if any
    if (window.costChartInstance) {
        window.costChartInstance.destroy();
    }
    
    window.costChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Concrete', 'Steel', 'Formwork', 'Excavation', 'Labor'],
            datasets: [{
                data: [
                    result.costs.materials.concrete,
                    result.costs.materials.steel,
                    result.costs.materials.formwork,
                    result.costs.materials.excavation,
                    result.costs.labor
                ],
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#48bb78',
                    '#ed8936',
                    '#4299e1'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: ₹${formatNumber(value)}`;
                        }
                    }
                }
            }
        }
    });
}

// Utility Functions
function getCurrentDesignData() {
    return {
        length: parseFloat(document.getElementById('length').value) || 0,
        width: parseFloat(document.getElementById('width').value) || 0,
        height: parseFloat(document.getElementById('height').value) || 0,
        waterDepth: parseFloat(document.getElementById('waterDepth').value) || 0,
        soilType: document.getElementById('soilType').value,
        loadType: document.getElementById('loadType').value,
        safetyFactor: parseFloat(document.getElementById('safetyFactor').value) || 2.5
    };
}

function showMessage(message, type) {
    // Create a temporary message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type} slide-in`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Find the active tab content
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab) {
        activeTab.insertBefore(messageDiv, activeTab.firstChild);
        
        // Remove after 5 seconds
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-IN').format(Math.round(num));
}

// Make loadSpecificDesign available globally
window.loadSpecificDesign = loadSpecificDesign;
