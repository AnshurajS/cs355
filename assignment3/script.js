document.addEventListener('DOMContentLoaded', () => {
    const breedInput = document.getElementById('breedInput');
    const breedList = document.getElementById('breeds');
    const showImagesBtn = document.getElementById('showImages');
    const message = document.getElementById('message');
    const imageContainer = document.getElementById('imageContainer');

    let imageInterval;

    // Fetch all breeds when page loads
    fetch('https://dog.ceo/api/breeds/list/all')
        .then(response => response.json())
        .then(data => {
            const breeds = Object.keys(data.message);
            breeds.forEach(breed => {
                const option = document.createElement('option');
                option.value = breed;
                breedList.appendChild(option);
            });
        })
        .catch(err => {
            console.error('Error fetching breeds:', err);
            message.textContent = 'Failed to load breeds';
        });

    function fetchAndDisplayImage(breed) {
        fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    imageContainer.innerHTML = `<img src="${data.message}" alt="${breed} dog">`;
                    message.textContent = '';
                } else {
                    throw new Error('No such breed');
                }
            })
            .catch(() => {
                message.textContent = 'No such breed';
                imageContainer.innerHTML = '';
                clearInterval(imageInterval);
            });
    }

    showImagesBtn.addEventListener('click', () => {
        const selectedBreed = breedInput.value.trim();
        
        // Clear previous interval if exists
        if (imageInterval) {
            clearInterval(imageInterval);
        }

        if (!selectedBreed) {
            message.textContent = 'Please select a breed first';
            imageContainer.innerHTML = '';
            return;
        }

        // Initial fetch
        fetchAndDisplayImage(selectedBreed);
        
        // Set up interval for subsequent fetches
        imageInterval = setInterval(() => {
            fetchAndDisplayImage(selectedBreed);
        }, 5000);
    });

    // Clear interval when user starts typing new breed
    breedInput.addEventListener('input', () => {
        if (imageInterval) {
            clearInterval(imageInterval);
        }
        imageContainer.innerHTML = '';
        message.textContent = '';
    });
});