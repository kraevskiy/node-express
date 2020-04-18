document.querySelectorAll('.price').forEach(node => {
  node.textContent = new Intl.NumberFormat('ua-UA', {
    currency: 'hrn',
    style: 'currency'
  }).format(node.textContent)
})