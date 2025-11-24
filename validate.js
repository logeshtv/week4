const form = document.getElementById('contactForm');
const successMsg = document.getElementById('successMessage');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    let isValid = true;

    if (name === '' || name.length < 2) {
        showError('nameError', 'Please enter your name');
        isValid = false;
    } else {
        clearError('nameError');
    }

    if (email === '' || !email.includes('@')) {
        showError('emailError', 'Please enter a valid email');
        isValid = false;
    } else {
        clearError('emailError');
    }

    if (subject === '') {
        showError('subjectError', 'Please enter a subject');
        isValid = false;
    } else {
        clearError('subjectError');
    }

    if (message === '' || message.length < 10) {
        showError('messageError', 'Message must be at least 10 characters');
        isValid = false;
    } else {
        clearError('messageError');
    }

    if (isValid) {
        // show brief confirmation
        alert('Submitted');
        form.style.display = 'none';
        successMsg.style.display = 'block';

        setTimeout(() => {
            form.reset();
            form.style.display = 'block';
            successMsg.style.display = 'none';
        }, 2200);
    }
});

function showError(id, msg) {
    document.getElementById(id).textContent = msg;
}

function clearError(id) {
    document.getElementById(id).textContent = '';
}
