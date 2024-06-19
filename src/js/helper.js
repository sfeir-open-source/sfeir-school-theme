/**
 * Since CSS makes use of data-* attributes, we need to persist URL parameters there, giving
 * them priority over anything that would already be there.
 * @param {*} urlParams = new URLSearchParams(window.location.search)
 * @param {*} queryParam  = Search parameter (theme, type, data-lang)
 * @param {*} slidesElement = the html Elements corresponding to the slides
 * @param {*} htmlParam  = the data-* attribute to set (data-theme-slides, data-type-show, data-lang)
 * @param {*} defaultValue the default value of the attribute
 * @returns
 */
export function _handle_parameter(
    urlParams,
    queryParam,
    slidesElement,
    htmlParam,
    defaultValue
) {
    if (urlParams.has(queryParam)) {
        const urlValue = urlParams.get(queryParam);
        slidesElement.setAttribute(htmlParam, urlValue);
    }

    if (!slidesElement.hasAttribute(htmlParam) && defaultValue) {
        slidesElement.setAttribute(htmlParam, defaultValue);
    }

    return slidesElement.getAttribute(htmlParam);
}
