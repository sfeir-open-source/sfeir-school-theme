
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
			'first-slide': `${this.path}images/src/images/background_blue.png`,
			'first-slide.first-red': `${this.path}images/src/images/background_red.png`,
			'first-slide.first-pink': `${this.path}images/src/images/background_pink.png`,
			'school-presentation': `${this.path}images/src/images/background_shcool.png`,
			'speaker-slide': `${this.path}images/src/images/background_white_1.png`,
			'sfeir-slide': `${this.path}images/src/images/background_white_1.png`,
			'sfeir-bg-blue': `${this.path}images/src/images/background_blue.png`,
			'sfeir-bg-pink': `${this.path}images/src/images/background_pink.png`,
			'sfeir-bg-red': `${this.path}images/src/images/background_red.png`,
			'sfeir-bg-white-1': `${this.path}images/src/images/background_white_1.png`,
			'sfeir-bg-white-2': `${this.path}images/src/images/background_white_2.png`,
			'sfeir-bg-white-3': `${this.path}images/src/images/background_white_3.png`,
			'sfeir-bg-white-4': `${this.path}images/src/images/background_white_4.png`,
			'sfeir-bg-white-5': `${this.path}images/src/images/background_white_5.png`,
			'sfeir-bg-white-6': `${this.path}images/src/images/background_white_6.png`,
			'sfeir-bg-white-7': `${this.path}images/src/images/background_white_7.png`,
			'sfeir-bg-white-8': `${this.path}images/src/images/background_white_8.png`,
		};

		for (let key in map){
			const queryElementList = document.querySelectorAll('.reveal .slides section:not([data-background]).'+key);

			for (let i = 0; i < queryElementList.length; i++){
				const element = queryElementList[i];
				element.classList.add('sfeir-specific-slide');
				element.setAttribute('data-background',map[key]);
			}
		}

		// Add default background for slides 
		const genericsSlides = [...document.querySelectorAll('.reveal .slides section:not([data-background]):not(.sfeir-specific-slide):not(.no-background)')];
		for (let genericSlide of genericsSlides){
			genericSlide.classList.add('sfeir-basic-slide');
			genericSlide.setAttribute('data-background', `${this.path}images/src/images/background_white_1.png`);
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
