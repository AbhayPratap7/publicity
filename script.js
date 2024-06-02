function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Get form data
    const form = document.getElementById('publicityForm');
    const formData = new FormData(form);
    const formEntries = Array.from(formData.entries());

    // Set font size and style
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');

    // Add GSTIN and mobile numbers
    const gstinText = 'GSTIN-08AJRPP2567P323';
    const mobileText = 'Mob- 9414110995, 7742700995';
    doc.text(gstinText, 10, 10);
    const textWidth = doc.getTextWidth(mobileText);
    doc.text(mobileText, doc.internal.pageSize.getWidth() - textWidth - 10, 10);

    // Add company name
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    const companyName = 'PERFECT PUBLICITY';
    const companyWidth = doc.getTextWidth(companyName);
    doc.text(companyName, (doc.internal.pageSize.getWidth() - companyWidth) / 2, 20);

    // Add email ID
    doc.setFontSize(12);
    const emailID = 'E-mail ID: ppublicity9@gmail.com';
    doc.text(emailID, 10, 30);

    // Add form details
    let currentY = 40;
    const lineHeight = 8;
    formEntries.forEach((entry) => {
        const [key, value] = entry;
        if (key !== 'Publication') {
            doc.text(`${key}: ${value}`, 10, currentY);
            currentY += lineHeight;
        }
    });

    // Add total bill
    const totalBillKey = 'Total Bill';
    const totalBillValue = formData.get('total-bill') || '';
    doc.setFont('helvetica', 'bold');
    doc.text(`${totalBillKey}: ${totalBillValue}`, 10, currentY);

    // Save the PDF
    doc.save('form-details.pdf');
}
