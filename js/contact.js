(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var wrapperDiv = document.getElementById('contact-form');
    if (!wrapperDiv) return;

    var form = wrapperDiv.querySelector('form#contactForm');
    var messageDiv = wrapperDiv.querySelector('#message') || document.getElementById('message');
    if (!form) return;

    var submitBtn = form.querySelector('#submit');
    var formTimeField = form.elements['form_time'];

    if (formTimeField) {
      formTimeField.value = Date.now();
    }

    function setButtonLoading(isLoading) {
      if (!submitBtn) return;
      submitBtn.disabled = isLoading;
      submitBtn.setAttribute('aria-busy', String(isLoading));
      submitBtn.style.opacity = isLoading ? '0.6' : '';
      submitBtn.textContent = isLoading ? 'Sending...' : 'Send Message';
    }

    function showInlineError(text) {
      if (!messageDiv) {
        alert(text);
        return;
      }
      messageDiv.className = '';
      messageDiv.innerHTML = '<div class="cf-error" role="alert">' + text + '</div>';
    }

    function clearInlineMessage() {
      if (!messageDiv) return;
      messageDiv.innerHTML = '';
    }

    function defaultLike(value) {
      if (!value) return true;
      var v = String(value).trim().toLowerCase();
      return v === '' || v === 'name' || v === 'e-mail' || v === 'email' || v === 'phone' || v === 'message';
    }

    function cleanField(name) {
      var field = form.elements[name];
      if (!field) return '';
      return defaultLike(field.value) ? '' : String(field.value).trim();
    }

    function submitHandler(ev) {
      clearInlineMessage();

      var email = cleanField('email');
      var message = cleanField('message');

      if (!email) {
        ev.preventDefault();
        showInlineError('Please enter your email.');
        return;
      }

      if (!message) {
        ev.preventDefault();
        showInlineError('Please enter your message.');
        return;
      }

      form.elements['name'].value = cleanField('name');
      form.elements['email'].value = email;
      form.elements['phone'].value = cleanField('phone');
      form.elements['message'].value = message;

      setButtonLoading(true);
    }

    form.addEventListener('submit', submitHandler);

    ['name', 'email', 'phone', 'message'].forEach(function (name) {
      var field = form.elements[name];
      if (!field) return;

      field.addEventListener('focus', function () {
        var value = String(this.value || '').trim();
        if (value === 'Name' || value === 'E-mail' || value === 'Phone' || value === 'Message') {
          this.value = '';
        }
      });
    });
  });
})();
