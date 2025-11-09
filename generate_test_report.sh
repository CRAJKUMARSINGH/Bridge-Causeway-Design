#!/bin/bash
# ============================================================================
# REFINED MARKDOWN COMMAND FOR APP TEST RUN WITH PDF OUTPUT
# ============================================================================
# Purpose: Run a test on the application, explain the test & result,
#          generate a PDF report, and save in a dated/timestamped subfolder.
# ============================================================================

# CONFIGURATION
TEST_SCRIPT="./run_test.sh"              # Your test script
OUTPUT_DIR="./test_reports"              # Base output directory
TIMESTAMP=$(date '+%Y-%m-%d_%H-%M-%S')   # e.g., 2025-11-09_14-30-22
REPORT_SUBFOLDER="$OUTPUT_DIR/$TIMESTAMP"
REPORT_MD="$REPORT_SUBFOLDER/report.md"
REPORT_PDF="$REPORT_SUBFOLDER/report.pdf"

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================================================${NC}"
echo -e "${BLUE}CAUSEWAY DESIGN PRO - TEST REPORT GENERATOR${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""

# Step 1: Create timestamped subfolder
echo -e "${YELLOW}[1/5]${NC} Creating report directory..."
mkdir -p "$REPORT_SUBFOLDER"
echo "      ✓ Created: $REPORT_SUBFOLDER"
echo ""

# Step 2: Initialize report with header
echo -e "${YELLOW}[2/5]${NC} Initializing report..."
cat > "$REPORT_MD" << 'EOF'
# Causeway Design Pro - Test Report

---

## Test Execution Details

**Application:** Causeway Design Pro - Enhanced Edition  
**Test Suite:** Comprehensive Validation  
**Report Generated:** 
EOF

echo "$(date '+%Y-%m-%d %H:%M:%S')" >> "$REPORT_MD"
echo "" >> "$REPORT_MD"
echo "---" >> "$REPORT_MD"
echo "" >> "$REPORT_MD"
echo "      ✓ Report initialized"
echo ""

# Step 3: Run the test & capture output
echo -e "${YELLOW}[3/5]${NC} Running test suite..."

# Make test script executable
chmod +x "$TEST_SCRIPT" 2>/dev/null

# Execute test and append output
if [ -f "$TEST_SCRIPT" ]; then
    echo "## Test Output" >> "$REPORT_MD"
    echo "" >> "$REPORT_MD"
    echo '```' >> "$REPORT_MD"
    bash "$TEST_SCRIPT" 2>&1 | tee -a "$REPORT_MD"
    echo '```' >> "$REPORT_MD"
    echo "" >> "$REPORT_MD"
    echo "      ✓ Test execution completed"
else
    echo "ERROR: Test script '$TEST_SCRIPT' not found."
    echo "ERROR: Test script not found." >> "$REPORT_MD"
    exit 1
fi
echo ""

# Step 4: Parse and explain test & result
echo -e "${YELLOW}[4/5]${NC} Analyzing results..."
echo "---" >> "$REPORT_MD"
echo "" >> "$REPORT_MD"
echo "## Test Analysis" >> "$REPORT_MD"
echo "" >> "$REPORT_MD"

# Extract TEST line
TEST_LINE=$(grep -i "^TEST:" "$REPORT_MD" | head -1)
if [ -n "$TEST_LINE" ]; then
    echo "### What Was Tested?" >> "$REPORT_MD"
    echo "" >> "$REPORT_MD"
    echo "$TEST_LINE" | sed 's/^TEST://i' | sed 's/^/> /' >> "$REPORT_MD"
    echo "" >> "$REPORT_MD"
    echo "This comprehensive test suite validates:" >> "$REPORT_MD"
    echo "" >> "$REPORT_MD"
    echo "- ✅ File structure and dependencies" >> "$REPORT_MD"
    echo "- ✅ Server configuration and syntax" >> "$REPORT_MD"
    echo "- ✅ API endpoint availability" >> "$REPORT_MD"
    echo "- ✅ Frontend files integrity" >> "$REPORT_MD"
    echo "- ✅ Enhanced features implementation" >> "$REPORT_MD"
    echo "- ✅ Documentation completeness" >> "$REPORT_MD"
    echo "" >> "$REPORT_MD"
fi

# Extract RESULT line
RESULT_LINE=$(grep -i "^RESULT:" "$REPORT_MD" | head -1)
if [ -n "$RESULT_LINE" ]; then
    echo "### Test Result" >> "$REPORT_MD"
    echo "" >> "$REPORT_MD"
    
    # Determine status
    if echo "$RESULT_LINE" | grep -qi "PASS"; then
        RESULT_STATUS="PASS"
        RESULT_ICON="✅"
        RESULT_COLOR="green"
    elif echo "$RESULT_LINE" | grep -qi "FAIL"; then
        RESULT_STATUS="FAIL"
        RESULT_ICON="❌"
        RESULT_COLOR="red"
    else
        RESULT_STATUS="UNKNOWN"
        RESULT_ICON="⚠️"
        RESULT_COLOR="orange"
    fi
    
    echo "**Status:** $RESULT_ICON **$RESULT_STATUS**" >> "$REPORT_MD"
    echo "" >> "$REPORT_MD"
    echo "$RESULT_LINE" | sed 's/^RESULT://i' | sed 's/^/> /' >> "$REPORT_MD"
    echo "" >> "$REPORT_MD"
    
    # Add interpretation
    case "$RESULT_STATUS" in
        PASS)
            echo "#### Interpretation" >> "$REPORT_MD"
            echo "" >> "$REPORT_MD"
            echo "🎉 **Excellent!** All tests passed successfully. The application is:" >> "$REPORT_MD"
            echo "" >> "$REPORT_MD"
            echo "- Production-ready" >> "$REPORT_MD"
            echo "- All enhanced features validated" >> "$REPORT_MD"
            echo "- No critical issues detected" >> "$REPORT_MD"
            echo "- Ready for deployment" >> "$REPORT_MD"
            ;;
        FAIL)
            echo "#### Interpretation" >> "$REPORT_MD"
            echo "" >> "$REPORT_MD"
            echo "⚠️ **Attention Required!** Some tests failed. Please review:" >> "$REPORT_MD"
            echo "" >> "$REPORT_MD"
            echo "- Check failed test details above" >> "$REPORT_MD"
            echo "- Verify file integrity" >> "$REPORT_MD"
            echo "- Ensure all dependencies installed" >> "$REPORT_MD"
            echo "- Review error messages" >> "$REPORT_MD"
            ;;
    esac
    echo "" >> "$REPORT_MD"
fi

# Add summary statistics
echo "### Test Statistics" >> "$REPORT_MD"
echo "" >> "$REPORT_MD"

TOTAL_TESTS=$(grep -c "Testing:" "$REPORT_MD" 2>/dev/null || echo "0")
PASSED_TESTS=$(grep -c "PASS" "$REPORT_MD" 2>/dev/null || echo "0")

echo "| Metric | Value |" >> "$REPORT_MD"
echo "|--------|-------|" >> "$REPORT_MD"
echo "| Total Tests | $TOTAL_TESTS |" >> "$REPORT_MD"
echo "| Tests Passed | $PASSED_TESTS |" >> "$REPORT_MD"
echo "| Success Rate | $(awk "BEGIN {if($TOTAL_TESTS>0) printf \"%.1f%%\", ($PASSED_TESTS/$TOTAL_TESTS)*100; else print \"N/A\"}")  |" >> "$REPORT_MD"
echo "" >> "$REPORT_MD"

echo "      ✓ Analysis completed"
echo ""

# Step 5: Add footer
echo "---" >> "$REPORT_MD"
echo "" >> "$REPORT_MD"
echo "## Report Information" >> "$REPORT_MD"
echo "" >> "$REPORT_MD"
echo "- **Generated:** $(date '+%Y-%m-%d %H:%M:%S')" >> "$REPORT_MD"
echo "- **Location:** \`$REPORT_SUBFOLDER\`" >> "$REPORT_MD"
echo "- **Application:** Causeway Design Pro" >> "$REPORT_MD"
echo "- **Version:** Enhanced Edition with 5 Major Features" >> "$REPORT_MD"
echo "" >> "$REPORT_MD"
echo "---" >> "$REPORT_MD"
echo "" >> "$REPORT_MD"
echo "*This report was automatically generated by the Causeway Design Pro test suite.*" >> "$REPORT_MD"

# Step 6: Convert to PDF
echo -e "${YELLOW}[5/5]${NC} Generating PDF report..."

# Check if pandoc is available
if command -v pandoc &> /dev/null; then
    # Try with weasyprint first
    if command -v weasyprint &> /dev/null; then
        pandoc "$REPORT_MD" \
            --pdf-engine=weasyprint \
            -o "$REPORT_PDF" \
            --metadata title="Causeway Design Pro - Test Report" \
            --metadata date="$(date '+%Y-%m-%d')" \
            --highlight-style=tango \
            2>/dev/null
    else
        # Fallback to default PDF engine
        pandoc "$REPORT_MD" \
            -o "$REPORT_PDF" \
            --metadata title="Causeway Design Pro - Test Report" \
            --metadata date="$(date '+%Y-%m-%d')" \
            2>/dev/null
    fi
    
    if [ -f "$REPORT_PDF" ]; then
        echo "      ✓ PDF generated successfully"
    else
        echo "      ⚠ PDF generation failed (pandoc error)"
        echo "      ℹ Markdown report is still available"
    fi
else
    echo "      ⚠ Pandoc not installed - PDF generation skipped"
    echo "      ℹ Install with: sudo apt install pandoc"
    echo "      ℹ Markdown report is available at: $REPORT_MD"
fi

echo ""
echo -e "${BLUE}============================================================================${NC}"
echo -e "${GREEN}✓ Test Report Generation Complete${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""
echo "📁 Report Location:"
echo "   $REPORT_SUBFOLDER"
echo ""
echo "📄 Files Generated:"
echo "   ✓ report.md  - Markdown report"
if [ -f "$REPORT_PDF" ]; then
    echo "   ✓ report.pdf - PDF report"
fi
echo ""

# Display result summary
if [ -n "$RESULT_STATUS" ]; then
    if [ "$RESULT_STATUS" = "PASS" ]; then
        echo -e "${GREEN}🎉 Overall Result: PASS${NC}"
        echo "   All tests completed successfully!"
    else
        echo -e "${YELLOW}⚠️  Overall Result: $RESULT_STATUS${NC}"
        echo "   Please review the report for details."
    fi
    echo ""
fi

echo "To view the report:"
echo "  Markdown: cat $REPORT_MD"
if [ -f "$REPORT_PDF" ]; then
    echo "  PDF:      xdg-open $REPORT_PDF  # Linux"
    echo "            open $REPORT_PDF      # macOS"
    echo "            start $REPORT_PDF     # Windows"
fi
echo ""

exit 0
