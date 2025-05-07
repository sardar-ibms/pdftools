document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const convertBtn = document.getElementById('convertBtn');
    const outputFormat = document.getElementById('outputFormat');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.querySelector('.progress-bar::after');
    const progressText = document.getElementById('progressText');
    const imageQuality = document.getElementById('imageQuality');
    const qualityValue = document.getElementById('qualityValue');
    
    let selectedFile = null;
    
    // Update quality value display
    imageQuality.addEventListener('input', function() {
        qualityValue.textContent = this.value;
    });
    
    // Drag and drop functionality
    dropZone.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', e => {
        if (fileInput.files.length) {
            handleFile(fileInput.files[0]);
        }
    });
    
    dropZone.addEventListener('dragover', e => {
        e.preventDefault();
        dropZone.classList.add('drop-zone--over');
    });
    
    ['dragleave', 'dragend'].forEach(type => {
        dropZone.addEventListener(type, () => {
            dropZone.classList.remove('drop-zone--over');
        });
    });
    
    dropZone.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.classList.remove('drop-zone--over');
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFile(e.dataTransfer.files[0]);
        }
    });
    
    // Convert button click handler
    convertBtn.addEventListener('click', async function() {
        if (!selectedFile) {
            alert('Please select a PDF file first');
            return;
        }
        
        try {
            convertBtn.disabled = true;
            progressContainer.style.display = 'block';
            updateProgress(10, 'Loading PDF...');
            
            // Simulate processing (in a real app, this would be actual conversion)
            for (let i = 10; i <= 100; i += 10) {
                await new Promise(resolve => setTimeout(resolve, 300));
                updateProgress(i, i === 100 ? 'Conversion complete!' : `Processing... ${i}%`);
            }
            
            // Create a dummy file for demonstration
            // In a real app, you would use actual conversion libraries
            const outputBlob = new Blob(["This would be your converted file content"], 
                { type: getMimeType(outputFormat.value) });
            
            saveAs(outputBlob, `converted.${outputFormat.value}`);
            
            convertBtn.disabled = false;
        } catch (error) {
            alert('Conversion failed: ' + error.message);
            console.error(error);
            convertBtn.disabled = false;
            progressContainer.style.display = 'none';
        }
    });
    
    // Helper functions
    function handleFile(file) {
        if (file.type !== 'application/pdf') {
            alert('Please select a PDF file');
            return;
        }
        
        selectedFile = file;
        
        // Show file info in drop zone
        dropZone.innerHTML = `
            <div class="drop-zone__thumb" data-label="${file.name}"></div>
        `;
        
        // Create thumbnail for PDF (simplified)
        const thumb = dropZone.querySelector('.drop-zone__thumb');
        thumb.style.backgroundImage = 'url("https://cdn-icons-png.flaticon.com/512/337/337946.png")';
    }
    
    function updateProgress(percent, message) {
        document.styleSheets[0].addRule('.progress-bar::after', `width: ${percent}%`);
        progressText.textContent = message;
    }
    
    function getMimeType(format) {
        const types = {
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        };
        return types[format];
    }
    
    // For demonstration, we're using a simple approach
    // In a real implementation, you would integrate with:
    // 1. PDF-lib for PDF manipulation
    // 2. LibreOffice WASM for actual conversion (see note below)
});