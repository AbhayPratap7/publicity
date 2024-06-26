// Function to initialize the form with last entered R.O. No.
function initializeForm() {
    const initialRO = 3010; // Set the starting R.O. No
    let lastRO = localStorage.getItem('lastRO');

    if (lastRO === null) {
        lastRO = initialRO;
        localStorage.setItem('lastRO', lastRO.toString());
    }

    const roNoInput = document.getElementById('ro-no');
    
    let lastRONumber = parseInt(lastRO) || initialRO;
    const userRONumber = parseInt(roNoInput.value.trim());
    if (!isNaN(userRONumber)) {
        lastRONumber = Math.max(lastRONumber, userRONumber);
    }

    const suggestedRO = lastRONumber + 1;
    roNoInput.value = suggestedRO.toString();
    localStorage.setItem('lastRO', suggestedRO.toString());
}

// Function to add a new date input field
function addPublishDateInput() {
    const newInput = document.createElement('input');
    newInput.type = 'date';
    newInput.name = 'publish-date';
    newInput.className = 'publish-date-input';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
        newInput.remove();
        removeBtn.remove();
    });

    const br = document.createElement('br');

    const publishDateContainer = document.getElementById('publish-date-container');
    publishDateContainer.appendChild(newInput);
    publishDateContainer.appendChild(removeBtn);
    publishDateContainer.appendChild(br);
}

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyykqhTw46bhG-Pa-spjSljBgcmKCsjPF6uwUqM7hQmk-TmbgBkPqXOQScqx-94809G/exec';

// Function to handle form submission and PDF download
async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFillColor(255, 255, 204);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const form = document.getElementById('publicityForm');
    const formData = new FormData(form);
    const formEntries = Array.from(formData.entries());

    let publishDates = [];
    let formDataObject = {};
    formEntries.forEach(([key, value]) => {
        if (key.toLowerCase().includes('publish-date')) {
            publishDates.push(formatDate(value));
        } else {
            formDataObject[key] = value;
            localStorage.setItem(key, value);
        }
    });
    formDataObject.publishDates = publishDates;

    // Send data to Google Sheets via Google Apps Script web app
    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataObject)
        });

        if (!response.ok && response.type !== 'opaque') {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error:', error);
    }

    // PDF generation logic...
    const img1 = new Image();
    img1.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(this, 0, 0);
        const dataURL1 = canvas.toDataURL('image/png');

        const img2 = new Image();
        img2.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(this, 0, 0);
            const dataURL2 = canvas.toDataURL('image/png');

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');

            const gstinText = 'GSTIN-08AJRPP2567P323';
            const mobileText = 'Mob- 9414110995, 7742700995';
            doc.text(gstinText, 10, 20);
            const textWidth = doc.getTextWidth(mobileText);
            doc.text(mobileText, doc.internal.pageSize.getWidth() - textWidth - 10, 20);

            const imgWidth = 20;
            const imgHeight = 20;
            const gstinWidth = doc.getTextWidth(gstinText);
            const imgX = gstinWidth + (doc.internal.pageSize.getWidth() - gstinWidth - textWidth - imgWidth) / 2;
            const imgY = 10;
            doc.addImage(dataURL2, 'PNG', imgX, imgY, imgWidth, imgHeight);

            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            const companyName = 'PERFECT PUBLICITY';
            const companyWidth = doc.getTextWidth(companyName);
            const companyX = (doc.internal.pageSize.getWidth() - companyWidth) / 2;
            doc.text(companyName, companyX, 40);

            doc.setFontSize(12);
            const emailID = 'E-mail ID: ppublicity9@gmail.com';
            const emailWidth = doc.getTextWidth(emailID);
            const emailX = (doc.internal.pageSize.getWidth() - emailWidth) / 2;
            doc.text(emailID, emailX, 50);

            const instructions = 'ADVERTISEMENT RELEASE INSTRUCTIONS';
            const instructionsWidth = doc.getTextWidth(instructions);
            const instructionsX = (doc.internal.pageSize.getWidth() - instructionsWidth) / 2;
            doc.text(instructions, instructionsX, 60);

            let startY = 80;
            const lineHeight = 12;
            const labelWidth = 80;
            const valueIndent = 10;

            // Add R.O. No. and R.O. No. Date
            formEntries.forEach(([key, value]) => {
                const capitalizedKey = key.toUpperCase();
                if (capitalizedKey === 'RO-NO') {
                    doc.text('RO-NO:', 10, startY);
                    doc.text(value, labelWidth + valueIndent, startY);
                    startY += lineHeight;
                } else if (capitalizedKey === 'RO-NO-DATE') {
                    doc.text('R.O. No. Date:', 10, startY);
                    doc.text(formatDate(value), labelWidth + valueIndent, startY);
                    startY += lineHeight;
                }
            });

            // Add Client Name and Publish Date
            formEntries.forEach(([key, value]) => {
                const capitalizedKey = key.toUpperCase();
                if (capitalizedKey === 'CLIENT') {
                    doc.text('CLIENT:', 10, startY);
                    doc.text(value, labelWidth + valueIndent, startY);
                    startY += lineHeight;
                }
            });

            // Add Publish Dates
            const publishDateText = publishDates.length > 0 ? publishDates.join(', ') : 'N/A';
            doc.text('Publish Date:', 10, startY);
            doc.text(publishDateText, labelWidth + valueIndent, startY);
            startY += lineHeight;

            // Add remaining form fields
            formEntries.forEach(([key, value]) => {
                const capitalizedKey = key.toUpperCase();
                if (!['RO-NO', 'RO-NO-DATE', 'CLIENT', 'PUBLISH-DATE'].includes(capitalizedKey)) {
                    const text = `${capitalizedKey}:`;
                    doc.text(text, 10, startY);
                    doc.text(value, labelWidth + valueIndent, startY);
                    startY += lineHeight;
                }
            });

            const statement = "This document is computer-generated and serves as official.";
            const statementX = (doc.internal.pageSize.getWidth() - doc.getTextWidth(statement)) / 2;
            doc.text(statement, statementX, startY + 20);

            const signX = doc.internal.pageSize.getWidth() - 30;
            const signY = doc.internal.pageSize.getHeight() - 50;
            doc.addImage(dataURL1, 'PNG', signX, signY, 20, 20);

            const signatureName = "Pawan Patwari";
            const signatureNameX = signX - doc.getTextWidth(signatureName) / 2;
            doc.text(signatureName, signatureNameX, signY + 25);

            const lineY = doc.internal.pageSize.getHeight() - 20;
            const lineLength = doc.internal.pageSize.getWidth() / 2;
            const lineX = (doc.internal.pageSize.getWidth() - lineLength) / 2;

            doc.line(lineX, lineY, lineX + lineLength, lineY);
            doc.text("For - Perfect Publicity", lineX + lineLength / 2 - doc.getTextWidth("For - Perfect Publicity") / 2, lineY + 10);

            doc.save('document.pdf');
        };
        img2.src = 'swastik-removebg-preview.png';
    };
    img1.src = 'sign.png';
}

// Initialize the form with the last entered R.O. No. when the page loads
window.onload = initializeForm;

// Add event listener for adding new publish date input
document.getElementById('add-publish-date').addEventListener('click', addPublishDateInput);

// Add event listener for form submission and PDF download
document.getElementById('download-pdf').addEventListener('click', async function(event) {
    event.preventDefault(); // Prevent form submission
    await downloadPDF();
});
