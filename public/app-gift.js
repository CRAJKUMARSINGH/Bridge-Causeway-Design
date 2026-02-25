// ============================================================================
// GIFT FEATURES - Design Library, Templates, Dashboard & Health Score
// ============================================================================

// Design Library Management
const designLibrary = {
    designs: [],
    
    exportLibrary() {
        const libraryData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            designs: this.designs,
            metadata: {
                totalDesigns: this.designs.length,
                application: 'Causeway Design Pro'
            }
        };
        
        const blob = new Blob([JSON.stringify(libraryData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `causeway-library-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        showToast('Design library exported successfully!', 'success');
    },
    
    importLibrary(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const libraryData = JSON.parse(e.target.result);
                if (libraryData.designs && Array.isArray(libraryData.designs)) {
                    this.designs = [...this.designs, ...libraryData.designs];
                    this.saveToLocalStorage();
                    this.renderLibrary();
                    showToast(`Imported ${libraryData.designs.length} designs successfully!`, 'success');
                } else {
                    showToast('Invalid library file format', 'error');
                }
            } catch (error) {
                showToast('Failed to import library: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    },
    
    saveToLocalStorage() {
        localStorage.setItem('designLibrary', JSON.stringify(this.designs));
    },
    
    loadFromLocalStorage() {
        const saved = localStorage.getItem('designLibrary');
        if (saved) {
            this.designs = JSON.parse(saved);
        }
    },
    
    addDesign(design) {
        this.designs.push({
            ...design,
            id: Date.now(),
            createdAt: new Date().toISOString()
        });
        this.saveToLocalStorage();
    },
    
    deleteDesign(id) {
        this.designs = this.designs.filter(d => d.id !== id);
        this.saveToLocalStorage();
        this.renderLibrary();
    },
    
    renderLibrary() {
        const container = document.getElementById('libraryContainer');
        if (!container) return;
        
        if (this.designs.length === 0) {
            container.innerHTML = `
                <div class="placeholder-message">
                    <i class="fas fa-folder-open"></i>
                    <p>No designs in library. Save designs to build your library.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.designs.map(design => `
            <div class="library-card">
                <div class="library-card-header">
                    <h4>${design.name || 'Unnamed Design'}</h4>
                    <div class="library-card-actions">
                        <button onclick="designLibrary.loadDesign(${design.id})" class="btn-icon" title="Load">
                            <i class="fas fa-folder-open"></i>
                        </button>
                        <button onclick="designLibrary.deleteDesign(${design.id})" class="btn-icon" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="library-card-body">
                    <div class="library-stat">
                        <span class="label">Length:</span>
                        <span class="value">${design.inputs?.length || 'N/A'} m</span>
                    </div>
                    <div class="library-stat">
                        <span class="label">Width:</span>
                        <span class="value">${design.inputs?.width || 'N/A'} m</span>
                    </div>
                    <div class="library-stat">
                        <span class="label">Safety:</span>
                        <span class="value">${design.calculations?.safetyMargin?.toFixed(2) || 'N/A'}</span>
                    </div>
                    <div class="library-stat">
                        <span class="label">Created:</span>
                        <span class="value">${new Date(design.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `).join('');
    },
    
    loadDesign(id) {
        const design = this.designs.find(d => d.id === id);
        if (design && design.inputs) {
            // Populate form fields
            document.getElementById('length').value = design.inputs.length || '';
            document.getElementById('width').value = design.inputs.width || '';
            document.getElementById('height').value = design.inputs.height || '';
            document.getElementById('waterDepth').value = design.inputs.waterDepth || '';
            document.getElementById('soilType').value = design.inputs.soilType || 'medium';
            document.getElementById('loadType').value = design.inputs.loadType || 'light';
            document.getElementById('safetyFactor').value = design.inputs.safetyFactor || 2.5;
            
            showToast('Design loaded successfully!', 'success');
            
            // Switch to design tab
            document.querySelector('[data-tab="design"]').click();
        }
    }
};

// Design Templates
const designTemplates = {
    templates: [
        {
            name: 'Small Pedestrian Bridge',
            description: 'Lightweight design for foot traffic',
            icon: 'fa-walking',
            params: {
                length: 30,
                width: 3,
                height: 1.5,
                waterDepth: 1.0,
                soilType: 'medium',
                loadType: 'pedestrian',
                safetyFactor: 2.5
            }
        },
        {
            name: 'Standard Road Causeway',
            description: 'Medium-duty for light vehicles',
            icon: 'fa-car',
            params: {
                length: 100,
                width: 8,
                height: 2,
                waterDepth: 1.5,
                soilType: 'medium',
                loadType: 'light',
                safetyFactor: 2.5
            }
        },
        {
            name: 'Heavy Duty Bridge',
            description: 'Reinforced for heavy vehicles',
            icon: 'fa-truck',
            params: {
                length: 150,
                width: 10,
                height: 3,
                waterDepth: 2.5,
                soilType: 'hard',
                loadType: 'heavy',
                safetyFactor: 3.0
            }
        },
        {
            name: 'Railway Crossing',
            description: 'High-strength for rail traffic',
            icon: 'fa-train',
            params: {
                length: 200,
                width: 12,
                height: 3.5,
                waterDepth: 2.0,
                soilType: 'hard',
                loadType: 'railway',
                safetyFactor: 3.5
            }
        },
        {
            name: 'Flood-Prone Area',
            description: 'Elevated design for high water',
            icon: 'fa-water',
            params: {
                length: 120,
                width: 8,
                height: 4,
                waterDepth: 3.5,
                soilType: 'soft',
                loadType: 'light',
                safetyFactor: 3.0
            }
        },
        {
            name: 'Urban Connector',
            description: 'Compact design for city areas',
            icon: 'fa-city',
            params: {
                length: 50,
                width: 6,
                height: 1.8,
                waterDepth: 1.2,
                soilType: 'hard',
                loadType: 'light',
                safetyFactor: 2.5
            }
        }
    ],
    
    renderTemplates() {
        const container = document.getElementById('templatesContainer');
        if (!container) return;
        
        container.innerHTML = this.templates.map((template, index) => `
            <div class="template-card" onclick="designTemplates.applyTemplate(${index})">
                <div class="template-icon">
                    <i class="fas ${template.icon}"></i>
                </div>
                <h4>${template.name}</h4>
                <p>${template.description}</p>
                <div class="template-specs">
                    <span><i class="fas fa-ruler"></i> ${template.params.length}m</span>
                    <span><i class="fas fa-arrows-alt-h"></i> ${template.params.width}m</span>
                    <span><i class="fas fa-arrows-alt-v"></i> ${template.params.height}m</span>
                </div>
                <button class="btn btn-sm btn-primary">
                    <i class="fas fa-check"></i> Use Template
                </button>
            </div>
        `).join('');
    },
    
    applyTemplate(index) {
        const template = this.templates[index];
        if (template) {
            const params = template.params;
            document.getElementById('length').value = params.length;
            document.getElementById('width').value = params.width;
            document.getElementById('height').value = params.height;
            document.getElementById('waterDepth').value = params.waterDepth;
            document.getElementById('soilType').value = params.soilType;
            document.getElementById('loadType').value = params.loadType;
            document.getElementById('safetyFactor').value = params.safetyFactor;
            
            showToast(`Template "${template.name}" applied!`, 'success');
            
            // Switch to design tab
            document.querySelector('[data-tab="design"]').click();
        }
    }
};

// Design Health Score Calculator
const designHealthScore = {
    calculate(designData) {
        if (!designData || !designData.calculations) {
            return null;
        }
        
        const scores = {
            safety: this.calculateSafetyScore(designData),
            economy: this.calculateEconomyScore(designData),
            environmental: this.calculateEnvironmentalScore(designData),
            structural: this.calculateStructuralScore(designData)
        };
        
        const overall = (scores.safety + scores.economy + scores.environmental + scores.structural) / 4;
        
        return {
            overall: Math.round(overall),
            scores,
            rating: this.getRating(overall),
            recommendations: this.getRecommendations(scores)
        };
    },
    
    calculateSafetyScore(data) {
        const safetyMargin = data.calculations?.safetyMargin || 0;
        if (safetyMargin >= 3.5) return 100;
        if (safetyMargin >= 3.0) return 95;
        if (safetyMargin >= 2.5) return 85;
        if (safetyMargin >= 2.0) return 70;
        if (safetyMargin >= 1.5) return 50;
        return 30;
    },
    
    calculateEconomyScore(data) {
        const safetyMargin = data.calculations?.safetyMargin || 0;
        // Lower safety margin (but still safe) = more economical
        if (safetyMargin >= 4.0) return 60; // Over-designed
        if (safetyMargin >= 3.0) return 75;
        if (safetyMargin >= 2.5) return 90;
        if (safetyMargin >= 2.0) return 100; // Optimal
        if (safetyMargin >= 1.5) return 70;
        return 40;
    },
    
    calculateEnvironmentalScore(data) {
        const volume = data.calculations?.volume || 0;
        const length = data.inputs?.length || 1;
        const volumePerMeter = volume / length;
        
        // Lower volume per meter = better environmental score
        if (volumePerMeter <= 15) return 100;
        if (volumePerMeter <= 20) return 90;
        if (volumePerMeter <= 25) return 80;
        if (volumePerMeter <= 30) return 70;
        if (volumePerMeter <= 40) return 60;
        return 50;
    },
    
    calculateStructuralScore(data) {
        const bendingMoment = data.calculations?.bendingMoment || 0;
        const deflection = data.calculations?.deflection || 0;
        
        // Simplified structural efficiency score
        let score = 85;
        if (bendingMoment > 1000) score -= 10;
        if (deflection > 50) score -= 10;
        
        return Math.max(50, score);
    },
    
    getRating(score) {
        if (score >= 90) return { text: 'Excellent', color: '#10b981', icon: 'fa-star' };
        if (score >= 80) return { text: 'Very Good', color: '#3b82f6', icon: 'fa-thumbs-up' };
        if (score >= 70) return { text: 'Good', color: '#8b5cf6', icon: 'fa-check-circle' };
        if (score >= 60) return { text: 'Fair', color: '#f59e0b', icon: 'fa-exclamation-circle' };
        return { text: 'Needs Improvement', color: '#ef4444', icon: 'fa-exclamation-triangle' };
    },
    
    getRecommendations(scores) {
        const recommendations = [];
        
        if (scores.safety < 70) {
            recommendations.push({
                category: 'Safety',
                message: 'Consider increasing safety factor or foundation dimensions',
                priority: 'high'
            });
        }
        
        if (scores.economy < 70) {
            recommendations.push({
                category: 'Economy',
                message: 'Design may be over-engineered. Review optimization suggestions',
                priority: 'medium'
            });
        }
        
        if (scores.environmental < 70) {
            recommendations.push({
                category: 'Environmental',
                message: 'Consider reducing material volume or using sustainable materials',
                priority: 'medium'
            });
        }
        
        if (scores.structural < 70) {
            recommendations.push({
                category: 'Structural',
                message: 'Review structural analysis for potential improvements',
                priority: 'low'
            });
        }
        
        return recommendations;
    },
    
    render(healthScore) {
        const container = document.getElementById('healthScoreContainer');
        if (!container || !healthScore) return;
        
        const rating = healthScore.rating;
        
        container.innerHTML = `
            <div class="health-score-card">
                <div class="health-score-header">
                    <div class="health-score-main">
                        <div class="health-score-circle" style="border-color: ${rating.color}">
                            <span class="health-score-value">${healthScore.overall}</span>
                            <span class="health-score-max">/100</span>
                        </div>
                        <div class="health-score-rating">
                            <i class="fas ${rating.icon}" style="color: ${rating.color}"></i>
                            <span style="color: ${rating.color}">${rating.text}</span>
                        </div>
                    </div>
                </div>
                
                <div class="health-score-breakdown">
                    <h4>Score Breakdown</h4>
                    <div class="score-bar-container">
                        <div class="score-bar-item">
                            <div class="score-bar-label">
                                <i class="fas fa-shield-alt"></i>
                                <span>Safety</span>
                            </div>
                            <div class="score-bar">
                                <div class="score-bar-fill" style="width: ${healthScore.scores.safety}%; background: #10b981"></div>
                            </div>
                            <span class="score-bar-value">${healthScore.scores.safety}</span>
                        </div>
                        
                        <div class="score-bar-item">
                            <div class="score-bar-label">
                                <i class="fas fa-dollar-sign"></i>
                                <span>Economy</span>
                            </div>
                            <div class="score-bar">
                                <div class="score-bar-fill" style="width: ${healthScore.scores.economy}%; background: #3b82f6"></div>
                            </div>
                            <span class="score-bar-value">${healthScore.scores.economy}</span>
                        </div>
                        
                        <div class="score-bar-item">
                            <div class="score-bar-label">
                                <i class="fas fa-leaf"></i>
                                <span>Environmental</span>
                            </div>
                            <div class="score-bar">
                                <div class="score-bar-fill" style="width: ${healthScore.scores.environmental}%; background: #10b981"></div>
                            </div>
                            <span class="score-bar-value">${healthScore.scores.environmental}</span>
                        </div>
                        
                        <div class="score-bar-item">
                            <div class="score-bar-label">
                                <i class="fas fa-building"></i>
                                <span>Structural</span>
                            </div>
                            <div class="score-bar">
                                <div class="score-bar-fill" style="width: ${healthScore.scores.structural}%; background: #8b5cf6"></div>
                            </div>
                            <span class="score-bar-value">${healthScore.scores.structural}</span>
                        </div>
                    </div>
                </div>
                
                ${healthScore.recommendations.length > 0 ? `
                    <div class="health-score-recommendations">
                        <h4>Recommendations</h4>
                        ${healthScore.recommendations.map(rec => `
                            <div class="recommendation-item priority-${rec.priority}">
                                <i class="fas fa-lightbulb"></i>
                                <div>
                                    <strong>${rec.category}:</strong>
                                    <span>${rec.message}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }
};

// Quick Actions Dashboard
const quickActionsDashboard = {
    recentDesigns: [],
    
    init() {
        this.loadRecentDesigns();
        this.render();
    },
    
    loadRecentDesigns() {
        const saved = localStorage.getItem('recentDesigns');
        if (saved) {
            this.recentDesigns = JSON.parse(saved);
        }
    },
    
    addRecentDesign(design) {
        this.recentDesigns.unshift({
            ...design,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 5
        this.recentDesigns = this.recentDesigns.slice(0, 5);
        localStorage.setItem('recentDesigns', JSON.stringify(this.recentDesigns));
        this.render();
    },
    
    render() {
        const container = document.getElementById('dashboardContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="dashboard-welcome">
                <h2>Welcome to Causeway Design Pro</h2>
                <p>Your professional civil engineering design platform</p>
            </div>
            
            <div class="dashboard-grid">
                <div class="dashboard-card quick-actions">
                    <h3><i class="fas fa-bolt"></i> Quick Actions</h3>
                    <div class="action-buttons">
                        <button onclick="document.querySelector('[data-tab=\\'design\\']').click()" class="action-btn">
                            <i class="fas fa-calculator"></i>
                            <span>New Design</span>
                        </button>
                        <button onclick="document.querySelector('[data-tab=\\'library\\']').click()" class="action-btn">
                            <i class="fas fa-folder-open"></i>
                            <span>Open Library</span>
                        </button>
                        <button onclick="document.querySelector('[data-tab=\\'templates\\']').click()" class="action-btn">
                            <i class="fas fa-layer-group"></i>
                            <span>Use Template</span>
                        </button>
                        <button onclick="document.querySelector('[data-tab=\\'optimize\\']').click()" class="action-btn">
                            <i class="fas fa-magic"></i>
                            <span>Optimize</span>
                        </button>
                    </div>
                </div>
                
                <div class="dashboard-card recent-designs">
                    <h3><i class="fas fa-history"></i> Recent Designs</h3>
                    ${this.recentDesigns.length > 0 ? `
                        <div class="recent-list">
                            ${this.recentDesigns.map(design => `
                                <div class="recent-item">
                                    <div class="recent-info">
                                        <strong>${design.inputs?.length || 'N/A'}m × ${design.inputs?.width || 'N/A'}m</strong>
                                        <span>${new Date(design.timestamp).toLocaleString()}</span>
                                    </div>
                                    <span class="recent-safety">SF: ${design.calculations?.safetyMargin?.toFixed(2) || 'N/A'}</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="placeholder-message">
                            <i class="fas fa-inbox"></i>
                            <p>No recent designs. Start by creating a new design!</p>
                        </div>
                    `}
                </div>
                
                <div class="dashboard-card stats">
                    <h3><i class="fas fa-chart-line"></i> Statistics</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <i class="fas fa-folder"></i>
                            <div>
                                <span class="stat-value">${designLibrary.designs.length}</span>
                                <span class="stat-label">Saved Designs</span>
                            </div>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-layer-group"></i>
                            <div>
                                <span class="stat-value">${designTemplates.templates.length}</span>
                                <span class="stat-label">Templates</span>
                            </div>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-history"></i>
                            <div>
                                <span class="stat-value">${this.recentDesigns.length}</span>
                                <span class="stat-label">Recent</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="dashboard-card tips">
                    <h3><i class="fas fa-lightbulb"></i> Pro Tips</h3>
                    <ul class="tips-list">
                        <li><i class="fas fa-check"></i> Use templates for quick starts</li>
                        <li><i class="fas fa-check"></i> Save designs to build your library</li>
                        <li><i class="fas fa-check"></i> Run optimization for cost savings</li>
                        <li><i class="fas fa-check"></i> Check health score for quality</li>
                        <li><i class="fas fa-check"></i> Export library to share with team</li>
                    </ul>
                </div>
            </div>
        `;
    }
};

// Toast notification helper
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    designLibrary.loadFromLocalStorage();
    quickActionsDashboard.init();
});
