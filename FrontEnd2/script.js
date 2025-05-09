// --- Configuration ---
// IMPORTANT: Replace with YOUR actual API key and Search Engine ID
// DO NOT COMMIT THIS TO PUBLIC REPOSITORIES WITH REAL KEYS

// --- Configuration ---
const GOOGLE_API_KEY = 'AIzaSyBTmjV-J4Rasa6Ilvfgiba7vtoo8TTwhto'; // <--- PUT YOUR API KEY HERE
const SEARCH_ENGINE_ID = '82e3682d693294970'; // <--- PUT YOUR SEARCH ENGINE ID (cx) HERE
// Find a royalty-free placeholder image URL online or host your own
const DEFAULT_CAR_IMAGE_URL = 'https://via.placeholder.com/400x300.png?text=Car+Image+Not+Found'; // Example placeholder

const GOOGLE_API_URL = 'https://www.googleapis.com/customsearch/v1';
const NUM_RESULTS_TO_CHECK = 5; // How many results to check for a valid image URL

// --- DOM Elements ---
const brandInput = document.getElementById('carBrand');
const modelInput = document.getElementById('carModel');
const searchButton = document.getElementById('searchButton');
const statusMessage = document.getElementById('statusMessage');
const carImage = document.getElementById('carImage'); // Your specific image tag

// --- Event Listener ---
searchButton.addEventListener('click', fetchCarImage);

modelInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        fetchCarImage();
    }
});

// --- Core Function ---
async function fetchCarImage() {
    const brand = brandInput.value.trim();
    const model = modelInput.value.trim();

    // Clear previous state and errors
    carImage.onerror = null; // Remove previous error handler
    carImage.src = "";     // Clear image visually
    carImage.alt = "Loading...";
    statusMessage.textContent = '';

    if (!brand || !model) {
        statusMessage.textContent = 'Please enter both car brand and model.';
        loadDefaultImage("Enter brand and model"); // Show default if inputs missing
        return;
    }

    if (GOOGLE_API_KEY === 'YOUR_API_KEY' || SEARCH_ENGINE_ID === 'YOUR_SEARCH_ENGINE_ID') {
        statusMessage.textContent = 'Error: API Key or Search Engine ID not set in script.js.';
        console.error("Please replace 'YOUR_API_KEY' and 'YOUR_SEARCH_ENGINE_ID' in script.js");
        loadDefaultImage("Configuration missing");
        return;
    }

    statusMessage.textContent = `Searching for ${brand} ${model}...`;
    carImage.style.display = 'none'; // Hide image container while loading new image

    const query = `${brand} ${model} car photo`;
    // Request more results to have fallbacks
    const url = `${GOOGLE_API_URL}?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&searchType=image&num=${NUM_RESULTS_TO_CHECK}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            let errorMsg = `API Error: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                if (errorData.error && errorData.error.message) {
                    errorMsg += `. ${errorData.error.message}`;
                }
            } catch (e) { /* Ignore */ }
            throw new Error(errorMsg);
        }

        const data = await response.json();
        console.log("API Response Data:", data);

        let imageFoundAndSet = false;
        if (data.items && data.items.length > 0) {
            // Iterate through the results to find the first valid direct image link
            for (const item of data.items) {
                const potentialUrl = item.link;
                const potentialAlt = item.title || `Image of ${brand} ${model}`;
                const contextLink = item.image?.contextLink;

                if (isValidImageUrl(potentialUrl)) {
                    console.log(`Attempting to load valid URL: ${potentialUrl}`);
                    // Set the src and alt text
                    carImage.src = potentialUrl;
                    carImage.alt = potentialAlt;

                    // Attach the error handler *before* the browser tries to load
                    // If this image fails, loadDefaultImage will be called.
                    carImage.onerror = () => {
                        console.warn(`Failed to load image from: ${potentialUrl}. Falling back to default.`);
                        loadDefaultImage(`Failed to load image for ${brand} ${model}`);
                    };

                     // Update status
                    statusMessage.innerHTML = `Image found. <a href="${contextLink || '#'}" target="_blank" rel="noopener noreferrer">Source: ${item.displayLink || 'Source page'}</a>`;
                    carImage.style.display = 'block'; // Show image element
                    imageFoundAndSet = true;
                    break; // Stop checking results once we found and set one
                } else {
                    console.log(`Skipping invalid or non-direct image URL: ${potentialUrl}`);
                }
            }
        }

        // If the loop finished and we never found/set a valid image
        if (!imageFoundAndSet) {
            console.log('No valid direct image URLs found in the results.');
            loadDefaultImage(`No direct image found for ${brand} ${model}`);
             statusMessage.textContent = `Sorry, no direct image found for "${brand} ${model}". Displaying default.`;
        }

    } catch (error) {
        console.error('Fetch or Processing Error:', error);
        statusMessage.textContent = `Failed to fetch or process image search: ${error.message}.`;
        loadDefaultImage('Error loading image');
    }
}

// --- Helper Functions ---

/**
 * Sets the image source to the default placeholder and handles associated states.
 * @param {string} altText - Alternate text for the default image.
 */
function loadDefaultImage(altText = "Default car image") {
    carImage.onerror = null; // IMPORTANT: Prevent infinite loop if the default itself fails
    carImage.src = DEFAULT_CAR_IMAGE_URL;
    carImage.alt = altText;
    carImage.style.display = 'block'; // Ensure the image container is visible
    // Optionally update status message here if not done by the caller
    // statusMessage.textContent = "Displaying default car image.";
}

/**
 * Performs a basic check if a URL string likely points to a direct image file.
 * @param {string} url - The URL string to check.
 * @returns {boolean} True if the URL ends with a common image extension, false otherwise.
 */
function isValidImageUrl(url) {
    if (!url || typeof url !== 'string') {
        return false;
    }
    // Check for common image file extensions. Case-insensitive.
    // Added svg as well.
    return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(url);
}