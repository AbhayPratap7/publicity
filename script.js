function sendEmail() {
    const form = document.getElementById('publicityForm');
    const formData = new FormData(form);
    const emailBody = Array.from(formData.entries()).map(entry => `${entry[0]}: ${entry[1]}`).join('\n');

    const mailtoLink = `mailto:ppublicity9@gmail.com?subject=Form Submission&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
}
