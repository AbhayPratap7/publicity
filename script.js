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

    publishDateContainer.appendChild(newInput);
    publishDateContainer.appendChild(removeBtn);
    publishDateContainer.appendChild(br);
}

// Function to handle form submission and PDF download
async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFillColor(255, 255, 204);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');

    const formatDate = (dateString) => {
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

    // Send data to the backend
    try {
        const response = await fetch('https://abhay-publicity.vercel.app/api/forms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataObject)
        });

        if (!response.ok) {
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

            const publishDateText = publishDates.length > 0 ? `Publish Date: ${publishDates.join(', ')}` : '';
            doc.text(publishDateText, 10, startY);
            startY += 20;

            formEntries.forEach(([key, value]) => {
                const capitalizedKey = key.toUpperCase();
                if (!capitalizedKey.includes('DATE') && !capitalizedKey.includes('PUBLISH')) {
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
            const lineLength = doc.getTextWidth('For - Perfect Publicity');
            const lineX = (doc.internal.pageSize.getWidth() - lineLength) / 2;
            doc.line(lineX, lineY, lineX + lineLength, lineY);

            const textY = lineY - 5;
            doc.text('For - Perfect Publicity', lineX, textY);

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

const publishDateContainer = document.getElementById('publish-date-container');
const addPublishDateBtn = document.getElementById('add-publish-date');
addPublishDateBtn.addEventListener('click', addPublishDateInput);

function initialize() {
    initializeForm();
    const downloadBtn = document.getElementById('download-pdf');
    downloadBtn.addEventListener('click', downloadPDF);
}

document.addEventListener('DOMContentLoaded', initialize);


