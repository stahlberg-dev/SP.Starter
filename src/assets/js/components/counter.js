/* eslint-disable radix */
function counter() {
	const productMap = new Map();

	const cartNumberElement = document.querySelector('.header__cart-counter-value');
	let cartNumber = parseInt(cartNumberElement.innerHTML);

	const promo = document.querySelector('.promo');

	const costBlock = document.querySelector('.cost');
	const costItems = document.querySelectorAll('.cost__item-value');
	const totalItem = document.querySelector('.cost__item_total .cost__item-value');

	function formatPrice(value) {
		const valueArr = (value + '').split('.');
		const mantissa = valueArr.length > 1 ? '.' + valueArr[1] : '';

		const subArr = valueArr[0].split('').reverse();

		for (let i = 1; i < subArr.length; i++) {
			if (i % 3 === 0) {
				subArr[i] = subArr[i] + ' ';
			}
		}

		return subArr.reverse().join('') + mantissa;
	}

	function changeTotalPrice() {
		let amount = 0;

		productMap.forEach(value => {
			amount += value.price * value.number;
		});

		costItems.forEach(costItem => {
			if (!costItem.closest('.cost__item_total')) {
				amount += parseFloat(costItem.innerHTML.split(' ').join(''));
			}
		});

		totalItem.innerHTML = formatPrice(Math.round(amount * 100) / 100);
	}

	function productClickHandler(event) {
		const numberElement = productMap.get(this).numberElement;
		const priceElement = productMap.get(this).priceElement;
		const minusElement = productMap.get(this).minusElement;
		const plusElement = productMap.get(this).plusElement;
		const price = productMap.get(this).price;

		if (event.target.closest('.product__counter-plus') && productMap.get(this).number < 99) {
			if (productMap.get(this).number === 1) {
				minusElement.classList.remove('product__counter-minus_disabled');
			}

			numberElement.innerHTML = ++productMap.get(this).number;
			priceElement.innerHTML = formatPrice(
				Math.round(productMap.get(this).number * price * 100) / 100
			);

			if (productMap.get(this).number === 99) {
				plusElement.classList.add('product__counter-plus_disabled');
			}

			changeTotalPrice();
		}

		if (event.target.closest('.product__counter-minus') && productMap.get(this).number > 1) {
			if (productMap.get(this).number === 99) {
				plusElement.classList.remove('product__counter-plus_disabled');
			}

			numberElement.innerHTML = --productMap.get(this).number;
			priceElement.innerHTML = formatPrice(
				Math.round(productMap.get(this).number * price * 100) / 100
			);

			if (productMap.get(this).number === 1) {
				minusElement.classList.add('product__counter-minus_disabled');
			}

			changeTotalPrice();
		}

		if (event.target.closest('.product__close')) {
			if (cartNumber === 1) {
				cartNumberElement.parentNode.remove();

				setTimeout(() => {
					document.querySelector('.basket__title-empty').style.opacity = '1';
				}, 600);

				promo.style.maxHeight = promo.offsetHeight + 'px';
				costBlock.style.maxHeight = costBlock.offsetHeight + 'px';

				setTimeout(() => {
					promo.style.maxHeight = '0px';
					costBlock.style.maxHeight = '0px';
				}, 0);

				setTimeout(() => {
					promo.remove();
					costBlock.remove();
				}, 400);
			}
			cartNumberElement.innerHTML = --cartNumber;

			this.style.maxHeight = this.offsetHeight + 'px';

			setTimeout(() => {
				this.style.pointerEvents = 'none';
				this.style.maxHeight = '0px';
			}, 0);

			setTimeout(() => {
				this.remove();
			}, 400);

			productMap.delete(this);

			changeTotalPrice();
		}
	}

	const products = document.querySelectorAll('.product');

	products.forEach(product => {
		const numberElement = product.querySelector('.product__number');
		const priceElement = product.querySelector('.product__price-value');
		const closeElement = product.querySelector('.product__close');
		const minusElement = product.querySelector('.product__counter-minus');
		const plusElement = product.querySelector('.product__counter-plus');

		const number = parseInt(numberElement.innerHTML);
		const price = parseFloat(priceElement.innerHTML.split(' ').join('')) / number;

		if (number === 1) {
			minusElement.classList.add('product__counter-minus_disabled');
		} else if (number === 99) {
			plusElement.classList.add('product__counter-plus_disabled');
		}

		productMap.set(product, {
			numberElement,
			priceElement,
			closeElement,
			minusElement,
			plusElement,
			number,
			price,
		});

		changeTotalPrice();

		product.addEventListener('click', productClickHandler);

		if (module.hot) {
			module.hot.dispose(() => {
				product.removeEventListener('click', productClickHandler);
			});
		}
	});
}

export default counter;
