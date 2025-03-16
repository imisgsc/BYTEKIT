document.getElementById('generate-btn').addEventListener('click', function() {
    const inputText = document.getElementById('url-input').value;
    if (inputText === '') {
        alert('Please enter a valid URL');
        return;
    }

    // Generate the QR code using the input text (URL)
    $('#qr-code').empty().qrcode({ text: inputText });

    // Show the QR code container
    document.getElementById('qr-code-container').style.display = 'block';

    // Show the result container
    document.getElementById('result-container').style.display = 'block';
});

document.getElementById('copy-btn').addEventListener('click', function() {
    // Copy the QR code image to clipboard
    const qrCodeImage = document.querySelector('#qr-code img');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = qrCodeImage.width;
    canvas.height = qrCodeImage.height;
    ctx.drawImage(qrCodeImage, 0, 0);
    
    canvas.toBlob(blob => {
        const data = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([data]).then(() => {
            alert('QR Code copied to clipboard');
        });
    });
});

document.getElementById('reset-btn').addEventListener('click', function() {
    // Reset the input field and hide the QR code container
    document.getElementById('url-input').value = '';
    document.getElementById('qr-code-container').style.display = 'none';
    document.getElementById('result-container').style.display = 'none';
    $('#qr-code').empty();
});