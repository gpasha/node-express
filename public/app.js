document.querySelectorAll('.price').forEach(node => {
    node.textContent = new Intl.NumberFormat('be-BE', {
        currency: 'byn',
        style: 'currency'
    }).format(node.textContent)
})