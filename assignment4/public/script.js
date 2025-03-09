document.addEventListener('DOMContentLoaded', () => {
    const breedInput = document.getElementById('breedInput');
    const breedList = document.getElementById('breeds');
    const showImagesBtn = document.getElementById('showImages');
    const message = document.getElementById('message');
    const imageContainer = document.getElementById('imageContainer');

    let imageInterval;

    // Fetch all breeds from the local API and populate the dropdown list
    fetch('/breeds')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const breeds = data.message;  // Should be an array of breed names
                breedList.innerHTML = ''; 
                
                breeds.forEach(breed => {
                    const option = document.createElement('option');
                    option.value = breed;
                    breedList.appendChild(option);
                });
            } else {
                throw new Error('Failed to load breeds');
            }
        })
        .catch(err => {
            console.error('Error fetching breeds:', err);
            message.textContent = 'Failed to load breeds';
        });

    function fetchAndDisplayImage(breed) {
        fetch(`/image/${breed}`)
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
        const selectedBreed = breedInput.value.trim().toLowerCase();
        
        if (imageInterval) {
            clearInterval(imageInterval);
        }

        if (!selectedBreed) {
            message.textContent = 'Please select a breed first';
            imageContainer.innerHTML = '';
            return;
        }

        // Fetch and display the breed image
        fetchAndDisplayImage(selectedBreed);

        // Set interval to fetch new images every 3 seconds
        imageInterval = setInterval(() => {
            fetchAndDisplayImage(selectedBreed);
        }, 3000);
    });

    // Clear interval when user types a new breed
    breedInput.addEventListener('input', () => {
        if (imageInterval) {
            clearInterval(imageInterval);
        }
        imageContainer.innerHTML = '';
        message.textContent = '';
    });
});
