// script.js
function hideElement(el) {
    el.classList.add('hidden');
  }
  
  function showElement(el) {
    el.classList.remove('hidden');
  }
  
  async function fetchMarks(mobileNumber) {
    const errorMessage = document.getElementById('errorMessage');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const submitText = document.getElementById('submitText');
  
    errorMessage.textContent = '';
    errorMessage.classList.remove('active');
  
    if (mobileNumber.length !== 10 || isNaN(mobileNumber)) {
      errorMessage.textContent = "Incorrect number, try again with your parent's number";
      errorMessage.classList.add('active');
      return;
    }
  
    loadingSpinner.classList.remove('hidden');
    submitText.textContent = 'Fetching marks...';
  
    try {
      const nameResponse = await fetch(
        `https://nam969.89determined.workers.dev/?mobile_number=${mobileNumber}`
      );
      if (!nameResponse.ok) throw new Error('Failed to fetch name');
      const name = await nameResponse.text();
  
      const marksResponse = await fetch(
        `https://cie.89determined.workers.dev/?mobile_number=${mobileNumber}`
      );
      if (!marksResponse.ok) throw new Error('Failed to fetch marks data');
      const data = await marksResponse.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');
  
      const heading = doc.querySelector('.box-body h2')?.textContent?.trim() || 'NGIT CIE Marks Viewer';
      document.title = heading;
  
      const table = doc.querySelector('.table.table-condensed');
      if (!table) throw new Error('No marks data found');
  
      const homeUI = document.getElementById('homeUI');
      homeUI.classList.add('hidden');
  
      setTimeout(() => {
        hideElement(homeUI);
        const resultsUI = document.getElementById('resultsUI');
        document.getElementById('nameGreeting').innerHTML = 
          `Name: <span>${name}</span>`;
        const marksTable = document.getElementById('marksTable');
        marksTable.innerHTML = `<h2>${heading}</h2>`;
        marksTable.appendChild(table.cloneNode(true));
        showElement(resultsUI);
      }, 500);
    } catch (error) {
      errorMessage.textContent = "Incorrect number, try again with your parent's number";
      errorMessage.classList.add('active');
      console.error(error);
    } finally {
      loadingSpinner.classList.add('hidden');
      submitText.textContent = 'execute';
    }
  }
  
  // Form submission handler
  document.getElementById('mobileForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const mobileNumber = document.getElementById('mobileNumber').value.trim();
    fetchMarks(mobileNumber);
  });
  
  // Auto-submit when 10 digits are entered
  document.getElementById('mobileNumber').addEventListener('input', function (event) {
    const mobileNumber = event.target.value.trim();
    if (mobileNumber.length === 10) {
      fetchMarks(mobileNumber);
    }
  });