const toCurrency = price => {
    return new Intl.NumberFormat('be-BE', {
        currency: 'byn',
        style: 'currency'
    }).format(price)
}

document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent)
})

const $card = document.querySelector('#card')

if ($card) {
    $card.addEventListener('click', e => {
        if (e.target.classList.contains('js-remove')) {
            const id = e.target.dataset.id

            fetch('/card/remove/' + id, {
                method: 'delete'
            }).then(res => res.json())
              .then(data => {
                    if (data.courses.length) {
                        const html = data.courses.map(course => {
                            return `
                                <tr>
                                    <td>${course.title}</td>
                                    <td>${course.count}</td>
                                    <td>
                                        <buttom class="btn btn-primary js-remove" data-id=${course.id}>Remove</buttom>
                                    </td>
                                </tr>
                            `
                        }).join('')
                        document.querySelector('tbody').innerHTML = html
                        document.querySelector('.price').textContent = toCurrency(data.price)
                    } else {
                        $card.innerHTML = '<p>The basket is empty</p>'
                    }
               })
        }
    })
}