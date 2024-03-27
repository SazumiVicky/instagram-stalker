/*
* dev: Sazumi Viki
* ig: @moe.sazumiviki
* gh: github.com/sazumivicky
* site: sazumi.moe
*/

document.addEventListener('DOMContentLoaded', () => {
    const checkButton = document.getElementById('checkButton');
    checkButton.addEventListener('click', async () => {
        const username = document.getElementById('usernameInput').value;

        if (!username) {
            showAlert('Please Input Username', 'error');
            return;
        }

        try {
            document.getElementById('loadingContainer').style.display = 'block';

            const response = await fetch(`/stalker?username=${username}`);
            const data = await response.json();

            document.getElementById('loadingContainer').style.display = 'none';

            document.getElementById('resultContainer').innerHTML = '';

            if (data.message) {
                showAlert(data.message, 'success');
            } else {
                data.stalkers.forEach(stalker => {
                    const stalkerItem = document.createElement('div');
                    stalkerItem.classList.add('stalker-item');

                    const stalkerName = document.createElement('h3');
                    stalkerName.textContent = stalker.Name;

                    const stalkerUsername = document.createElement('p');
                    stalkerUsername.textContent = stalker.username;

                    stalkerItem.appendChild(stalkerName);
                    stalkerItem.appendChild(stalkerUsername);

                    document.getElementById('resultContainer').appendChild(stalkerItem);
                });

                showAlert('Successfully Check', 'success');
            }
        } catch (error) {
            console.error('Error occurred:', error);
            showAlert('Upps Something Wrong', 'error');
        }
    });
});

function showAlert(message, type) {
    const alertContainer = document.createElement('div');
    alertContainer.classList.add('custom-popup');
    alertContainer.classList.add(type);
    alertContainer.textContent = message;
    document.body.appendChild(alertContainer);
    setTimeout(() => {
        alertContainer.remove();
    }, 3000);
}
