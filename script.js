// Function to initialize the form with last entered R.O. No.
function initializeForm() {
    // Retrieve last R.O. No. from localStorage
    const lastRO = localStorage.getItem('lastRO');

    // Set initial value for R.O. No.
    const roNoInput = document.getElementById('ro-no');
    if (lastRO) {
        // If lastRO exists, suggest the next number
        const suggestedRO = parseInt(lastRO) + 1;
        roNoInput.value = suggestedRO;
    } else {
        // If no lastRO exists, suggest a default starting number
        roNoInput.value = '1'; // Default starting R.O. No.
    }
}

// Function to handle PDF download and form data storage
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set background color
    doc.setFillColor(255, 255, 204); // Pale yellow background
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');

    // Function to format date as DD/MM/YYYY
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Get form data
    const form = document.getElementById('publicityForm');
    const formData = new FormData(form);
    const formEntries = Array.from(formData.entries());

    // Store form data in localStorage
    formEntries.forEach(([key, value]) => {
        localStorage.setItem(key, value);
    });

    // Update last R.O. No. in localStorage
    const roNoValue = form['ro-no'].value;
    localStorage.setItem('lastRO', roNoValue);

    // Load your images
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

            // Set font size and style
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');

            // Add GSTIN and mobile numbers
            const gstinText = 'GSTIN-08AJRPP2567P323';
            const mobileText = 'Mob- 9414110995, 7742700995';
            doc.text(gstinText, 10, 20);
            const textWidth = doc.getTextWidth(mobileText);
            doc.text(mobileText, doc.internal.pageSize.getWidth() - textWidth - 10, 20);

            // Add swastik image between GSTIN and mobile numbers
            const imgWidth = 20; // Adjust image width as needed
            const imgHeight = 20; // Adjust image height as needed
            const gstinWidth = doc.getTextWidth(gstinText);
            const imgX = gstinWidth + (doc.internal.pageSize.getWidth() - gstinWidth - textWidth - imgWidth) / 2;
            const imgY = 10; // Adjust Y position as needed
            doc.addImage(dataURL2, 'PNG', imgX, imgY, imgWidth, imgHeight);

            // Add company name
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            const companyName = 'PERFECT PUBLICITY';
            const companyWidth = doc.getTextWidth(companyName);
            const companyX = (doc.internal.pageSize.getWidth() - companyWidth) / 2;
            doc.text(companyName, companyX, 40);

            // Add email ID just below the company name
            doc.setFontSize(12);
            const emailID = 'E-mail ID: ppublicity9@gmail.com';
            const emailWidth = doc.getTextWidth(emailID);
            const emailX = (doc.internal.pageSize.getWidth() - emailWidth) / 2;
            doc.text(emailID, emailX, 50);

            // Add "ADVERTISEMENT RELEASE INSTRUCTIONS" below the email ID
            const instructions = 'ADVERTISEMENT RELEASE INSTRUCTIONS';
            const instructionsWidth = doc.getTextWidth(instructions);
            const instructionsX = (doc.internal.pageSize.getWidth() - instructionsWidth) / 2;
            doc.text(instructions, instructionsX, 60); // Adjust the Y position as needed

            let startY = 80; // Starting Y position for form details

            // Add form details with increased line gap and aligned values
            const lineHeight = 12;
            const labelWidth = 80; // Width of the detail label
            const valueIndent = 10; // Indentation for the detail value
            formEntries.forEach(([key, value]) => {
                // Capitalize the form field name
                const capitalizedKey = key.toUpperCase();

                // Format date fields if necessary
                if (capitalizedKey.includes('DATE')) {
                    value = formatDate(value);
                }

                const text = `${capitalizedKey}:`;
                const textWidth = doc.getTextWidth(text);
                doc.text(text, 10, startY); // Render detail label
                doc.text(value, labelWidth + valueIndent, startY); // Render detail value aligned to the right
                startY += lineHeight;
            });

            // Add the professional statement
            const statement = "This document is computer-generated and serves as official.";
            const statementWidth = doc.getTextWidth(statement);
            const statementX = (doc.internal.pageSize.getWidth() - statementWidth) / 2;
            const statementY = startY + 20; // Add some gap below the form details
            doc.text(statement, statementX, statementY);

            // Add signature image
            const signWidth = 20; // Adjust signature width as needed
            const signHeight = 20; // Adjust signature height as needed
            const signX = doc.internal.pageSize.getWidth() - signWidth - 10; // Adjust X position for the signature image
            const signY = doc.internal.pageSize.getHeight() - signHeight - 40; // Adjust Y position as needed
            doc.addImage(dataURL1, 'PNG', signX, signY, signWidth, signHeight);

            // Add "Pawan Patwari" text under the signature image
            const signatureName = "Pawan Patwari";
            const signatureNameWidth = doc.getTextWidth(signatureName);
            const signatureNameX = signX + (signWidth - signatureNameWidth) / 2;
            const signatureNameY = signY + signHeight + 5; // Adjust the vertical position as needed
            doc.setFontSize(10); // Adjust the font size as needed
            doc.text(signatureName, signatureNameX, signatureNameY);

            // Add line at the bottom center
            const lineY = doc.internal.pageSize.getHeight() - 20;
            const lineLength = doc.getTextWidth('For - Perfect Publicity');
            const lineX = (doc.internal.pageSize.getWidth() - lineLength) / 2;
            doc.line(lineX, lineY, lineX + lineLength, lineY);

            // Add "For - Perfect Publicity" text above the line
            const textX = (doc.internal.pageSize.getWidth() - lineLength) / 2;
            const textY = lineY - 5; // Adjust position above the line
            doc.text('For - Perfect Publicity', textX, textY);

            // Return the Blob
            const pdfBlob = doc.output('blob');
            handleBlob(pdfBlob);
        };
        img2.src = 'swastik-removebg-preview.png'; // Load the swastik image
    };
    img1.src = 'sign.png'; // Load the signature image
}

// Function to handle the generated PDF Blob
function handleBlob(blob) {
    // Create a URL for the Blob
    const blobURL = URL.createObjectURL(blob);

    // Create a download link and click it
    const a = document.createElement('a');
    a.href = blobURL;
    a.download = 'form-details.pdf';
    a.click();

    // Cleanup
    URL.revokeObjectURL(blobURL);
}

// Initialize the form when the script loads
initializeForm();
