import Router from 'next/router';

export const redirect = (url) => {
    Router.push(url);
};

export function appendScript(scriptToAppend) {
    const script = document.createElement('script');
    script.src = scriptToAppend;
    script.async = true;
    document.body.appendChild(script);
}

export function removeScript(scriptToremove) {
    let allsuspects = document.getElementsByTagName('script');
    for (let i = allsuspects.length; i >= 0; i--) {
        if (allsuspects[i] && allsuspects[i].getAttribute('src') !== null && allsuspects[i].getAttribute('src').indexOf(`${scriptToremove}`) !== -1) {
            allsuspects[i].parentNode.removeChild(allsuspects[i]);
        }
    }
}

export function appendScripts(arrayOfScripts) {
    for (let i = 0; i < arrayOfScripts.length; i++) {
        appendScript(arrayOfScripts[i]);
    }
}

export function removeScripts(arrayOfScripts) {
    for (let i = 0; i < arrayOfScripts.length; i++) {
        removeScript(arrayOfScripts[i]);
    }
}
