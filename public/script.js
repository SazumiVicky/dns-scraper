/*
* dev: Sazumi Viki
* ig: @moe.sazumiviki
* gh: github.com/sazumivicky
* site: sazumi.moe
*/

document.addEventListener('DOMContentLoaded', () => {
    const lookupBtn = document.getElementById('lookupBtn');
    const urlInput = document.getElementById('urlInput');
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    const cnameDiv = document.getElementById('cname');
    const dnsResultsDiv = document.getElementById('dnsResults');

    lookupBtn.addEventListener('click', async () => {
        const url = urlInput.value.trim();
        if (!isValidUrl(url)) {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "error",
                title: "Please input a valid URL!"
            });
            return;
        }

        loadingDiv.classList.remove('hidden');

        try {
            const response = await fetch(`/api/dns?url=${url}`);
            const data = await response.json();

            loadingDiv.classList.add('hidden');
            resultDiv.classList.remove('hidden');

            cnameDiv.innerHTML = `<strong>CNAME:</strong> ${data.cname}`;

            dnsResultsDiv.innerHTML = '<strong>DNS Results:</strong><br>';
            data.results.forEach(result => {
                dnsResultsDiv.innerHTML += `
                    <div>
                        <strong>Hostname:</strong> ${result.Hostname}<br>
                        <strong>Type:</strong> ${result.Type}<br>
                        <strong>Target:</strong> ${result.Target}<br>
                        <strong>TTL:</strong> ${result.Ttl}<br>
                        <strong>Organisation:</strong> ${result.Organisation}<br>
                        <strong>Country:</strong> ${result.Country}<br>
                        <strong>ASN Number:</strong> ${result['ASN Number']}<br><br>
                    </div>
                `;
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            loadingDiv.classList.add('hidden');
            resultDiv.classList.add('hidden');
            alert('An error occurred. Please try again later.');
        }
    });

    function isValidUrl(str) {
        const pattern = new RegExp('^(https?:\\/\\/)?'+
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
          '((\\d{1,3}\\.){3}\\d{1,3}))'+
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
          '(\\?[;&a-z\\d%_.~+=-]*)?'+
          '(\\#[-a-z\\d_]*)?$','i');
        return !!pattern.test(str);
    }
});
