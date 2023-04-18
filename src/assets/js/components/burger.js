function clickBurger() {
	const burgerIcon = document.querySelector('.header__burger');

	function burgerClickHandler() {
		burgerIcon.classList.toggle('header__burger_active');
	}

	burgerIcon.addEventListener('click', burgerClickHandler);

	if (module.hot) {
		module.hot.dispose(() => {
			burgerIcon.removeEventListener('click', burgerClickHandler);
		});
	}
}

export default clickBurger;
