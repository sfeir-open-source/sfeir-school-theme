
class SfeirTheme {
    constructor(){
        document.addEventListener('DOMContentLoaded', this._pageload.bind(this));
    }

    _pageload(){
        // Timeout use to let time to reaveal to construct the dom
        setTimeout(() => {
            if (Reveal) {
                // Hello Reveal Sync :)
                Reveal.sync();
            }
        }, 500);
    }
}


new SfeirTheme();