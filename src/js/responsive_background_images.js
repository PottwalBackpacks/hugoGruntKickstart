class ResponsiveBackgroundImage {

    constructor(element) {
        this.element = element;
        this.img = element.querySelector('img');
        this.src = '';
				//console.log("responsive-img",this.img);

        this.img.addEventListener('load', () => {
					//console.log("loaded",this)
            this.update();
        });

        if (this.img.complete) {
            this.update();
        }
    }

    update() {
        let src = typeof this.img.currentSrc !== 'undefined' ? this.img.currentSrc : this.img.src;
				//console.log('update',src )
        if (this.src !== src) {
            this.src = src;
            this.element.style.backgroundImage = 'url("' + this.src + '")';

        }
    }
}


export default ResponsiveBackgroundImage;
