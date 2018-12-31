
class SfeirTheme {
	constructor(){
		document.addEventListener('DOMContentLoaded', () => setTimeout(this._pageload.bind(this), 500));
		this.path = "";
	}

	_pageload(){
		this.path = this._extractPath();

		// FavIcon
		this._manageFavIcon();

		// ManageBackground
		this._manageBackgrounds();

		// ManageShowContent
		this._manageShowTypeContent();

		if (Reveal){
			Reveal.sync();
		}
	}
	_extractPath(){
		const scripts = document.getElementsByTagName("script");

		for(let idx = 0; idx < scripts.length; idx++)
		{
		  const script = scripts.item(idx);

		  if(script.src && script.src.match(/sfeir-theme\.js$/))
		  {
			const path = script.src;
			return path.substring(0, path.indexOf('js/sfeir-theme'));
		  }
		}
	  return "";
	};

	_manageFavIcon(){
		const link = document.createElement('link');
		link.type = 'image/x-icon';
		link.rel = 'shortcut icon';
		link.href = `${this.path}images/src/images/logo_sfeir_burger.png`;
		document.getElementsByTagName('head')[0].appendChild(link);

	}

	_manageBackgrounds(){

		const map = {
			'transition-white' : 'var(--light-grey)',
			'transition-black' : 'var(--dark-grey)',
			'first-slide': `${this.path}images/src/images/background_blue.png`,
			'first-slide.first-red': `${this.path}images/src/images/background_red.png`,
			'first-slide.first-pink': `${this.path}images/src/images/background_pink.png`,
		};

		for (let key in map){
			const queryElementList = document.querySelectorAll('.reveal .slides section.'+key);

			for (let i = 0; i < queryElementList.length; i++){
				const element = queryElementList[i];
				element.setAttribute('data-background',map[key]);
			}
		}

		this._manageFirstSlide();
	}

	_manageFirstSlide(){
		const firstSlides = [...document.querySelectorAll('.reveal .slides section.first-slide')];
		for (let firstSlideSection of firstSlides){
			const imgLogo = document.createElement('DIV');
			imgLogo.classList.add("sfeir-logo");
			imgLogo.style['background-image'] = `url(${this.path}images/src/images/logo_empty.png)`;

			const level = firstSlideSection.hasAttribute('sfeir-level') ? +firstSlideSection.getAttribute('sfeir-level') : 1;
			const techno = firstSlideSection.hasAttribute('sfeir-techno') ? firstSlideSection.getAttribute('sfeir-techno') : '';
			imgLogo.setAttribute('data-sfeir-level', level);
			imgLogo.setAttribute('data-sfeir-techno', techno);

			firstSlideSection.insertAdjacentElement('afterbegin', imgLogo);

		}
	}

	_manageShowTypeContent(){

		const showTypeContent = document.querySelector('.reveal .slides').getAttribute('data-type-show');
		if (showTypeContent){
			const showTypeSlides = document.querySelectorAll('.reveal .slides section[data-type-show]');
			for (let i = 0; i < showTypeSlides.length; i++){
				const tmpSlide = showTypeSlides[i];
				if (tmpSlide.getAttribute('data-type-show') != showTypeContent){
					tmpSlide.parentNode.removeChild(tmpSlide);
				}
			}
		}
	}

}


new SfeirTheme();
