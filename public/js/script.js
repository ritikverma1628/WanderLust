// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
        console.log('form submission blocked')
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

const input = document.getElementById('rating')
const output = document.getElementById('value');
output.textContent= input.value;
input.addEventListener('input',()=>{
    output.textContent = input.value;
})
