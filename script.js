// Function to initialize the form with last entered R.O. No.
function initializeForm() {
    const initialRO = 3010; // Set the starting R.O. No
    let lastRO = localStorage.getItem('lastRO');

    if (lastRO === null) {
        lastRO = initialRO;
        localStorage.setItem('lastRO', lastRO.toString());
    }

    const roNoInput = document.getElementById('ro-no');
    
    // Parse lastRO to an integer, defaulting to initialRO if it's not set or invalid
    let lastRONumber = parseInt(lastRO) || initialRO;

    // Check if there is a user-entered R.O. No
    const userRONumber = parseInt(roNoInput.value.trim());
    if (!isNaN(userRONumber)) {
        lastRONumber = Math.max(lastRONumber, userRONumber);
    }

    const suggestedRO = lastRONumber + 1;
    roNoInput.value = suggestedRO.toString(); // Set the next R.O. No

    // Store the updated R.O. No back into localStorage
    localStorage.setItem('lastRO', suggestedRO.toString());
}

// Function to handle PDF download and form data storage
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFillColor(255, 255, 204);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const form = document.getElementById('publicityForm');
    const formData = new FormData(form);
    const formEntries = Array.from(formData.entries());

    // Collecting publish dates into an array
    let publishDates = [];
    formEntries.forEach(([key, value]) => {
        if (key.toLowerCase().includes('publish-date')) {
            publishDates.push(formatDate(value));
        } else {
            localStorage.setItem(key, value); // Store other form data in localStorage
        }
    });

    // Concatenating publish dates into a single string with commas
    const publishDateText = publishDates.length > 0 ? `Publish Date: ${publishDates.join(', ')}` : '';

    // Rendering content to PDF
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
            doc.text(gstinText, 10,20);
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

            // Starting Y position for details section
            let startY = 80;
            const lineHeight = 12;
            const labelWidth = 80;
            const valueIndent = 10;

            // Render publish date text with increased spacing
            doc.text(publishDateText, 10, startY);
            startY += 20; // Add extra spacing after publish date

            // Render other form entries
            formEntries.forEach(([key, value]) => {
                const capitalizedKey = key.toUpperCase();
                if (!capitalizedKey.includes('DATE') && !capitalizedKey.includes('PUBLISH')) {
                    const text = `${capitalizedKey}:`;
                    const textWidth = doc.getTextWidth(text);
                    doc.text(text, 10, startY);
                    doc.text(value, labelWidth + valueIndent, startY);
                    startY += lineHeight;
                }
            });

            // Additional spacing for the statement
            const statement = "This document is computer-generated and serves as official.";
            const statementWidth = doc.getTextWidth(statement);
            const statementX = (doc.internal.pageSize.getWidth() - statementWidth) / 2;
            const statementY = startY + 20;
            doc.text(statement, statementX, statementY);

            // Signature section
            const signWidth = 20;
            const signHeight = 20;
            const signX = doc.internal.pageSize.getWidth() - signWidth - 10;
            const signY = doc.internal.pageSize.getHeight() - signHeight - 40;
            doc.addImage(dataURL1, 'PNG', signX, signY, signWidth, signHeight);

            const signatureName = "Pawan Patwari";
            const signatureNameWidth = doc.getTextWidth(signatureName);
            const signatureNameX = signX + (signWidth - signatureNameWidth) / 2;
            const signatureNameY = signY + signHeight + 5;
            doc.setFontSize(10);
            doc.text(signatureName, signatureNameX, signatureNameY);

            // Horizontal line
            const lineY = doc.internal.pageSize.getHeight() - 20;
            const lineLength = doc.getTextWidth('For - Perfect Publicity');
            const lineX = (doc.internal.pageSize.getWidth() - lineLength) / 2;
            doc.line(lineX, lineY, lineX + lineLength, lineY);

            // Text below the line
            const textX = (doc.internal.pageSize.getWidth() - lineLength) / 2;
            const textY = lineY - 5;
            doc.text('For - Perfect Publicity', textX, textY);

            // Output PDF as a blob and handle download
            const pdfBlob = doc.output('blob');
            handleBlob(pdfBlob);
        };
        img2.src = 'swastik-removebg-preview.png';
    };
    img1.src = 'sign.png';
}

function handleBlob(blob) {
    const blobURL = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobURL;
    a.download = 'form-details.pdf';
    a.click();
    URL.revokeObjectURL(blobURL);
}

// Get references to the necessary elements
const publishDateContainer = document.getElementById('publish-date-container');
const addPublishDateBtn = document.getElementById('add-publish-date');

// Add event listener for the "Add Another Date" button
addPublishDateBtn.addEventListener('click', addPublishDateInput);

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
        publishDateContainer.removeChild(container);
    });

    const container = document.createElement('div');
    container.appendChild(newInput);
    container.appendChild(removeBtn);
    
    publishDateContainer.appendChild(container);
}

// Call initializeForm() when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeForm();
});

