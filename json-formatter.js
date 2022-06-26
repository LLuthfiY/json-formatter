// ==UserScript==
// @name         Json formatter
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  not really good json Formatter
// @author       LLuthfiY
// @match        https://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let regexURL = /(http)[^\s]*/gi
    let pre = document.querySelector('body pre:only-of-type');

    let json = JSON.parse(pre.innerHTML);
    let jsonstr = JSON.stringify(json, null, 4)

    if (!pre) return;

    const transformData = (data, d) => {
        if (data == null) return 'Null';
        return data[d];
    }

    const hideToggle = (el) => {
        el.classList.toggle('rotate')
        let parent = el.parentElement.parentElement
        parent.getElementsByClassName('content')[0].classList.toggle('hidden')
    }

    const createView = (data)=>
    {
        let outerWrapper = document.createElement('div')
        outerWrapper.classList.add('outer')
        let before = document.createElement('p')
        let after = document.createElement('p')
        before.innerHTML = '{'
            after.innerHTML = '}'
        for(const key in data){
            let wrapper = document.createElement('div')
            let header = document.createElement('div')
            let content = document.createElement('div')

            header.style.display = 'flex'
            let toggleButton = document.createElement('button')
            toggleButton.innerHTML = '>'
            //toggleButton.classList.add('rotate')
            toggleButton.style.marginLeft = '5px'
            toggleButton.style.marginRight = '5px'
            header.append(toggleButton)
            if (data instanceof Array){
                header.append(`${key} :`)
            }else{
                header.append(`"${key}" :`)
            }


            content.style.marginLeft = '40px'
            content.classList.add('content')
            content.classList.add('hidden')

            let d = transformData(data, key);
            if ( typeof d == 'object' ) content.append(createView(d));
            else if (typeof d == 'string'){
                let str = d
                str = str.replace(regexURL, function(match) {
                    return `<a href="${match}">${match}</a>`
                })
                content.innerHTML = `"${str}"`
                }
            else {
                content.innerHTML = d

            }
            wrapper.append(header)
            wrapper.append(content)
            outerWrapper.append(wrapper)
        }
        if (data instanceof Array) {
            before.innerHTML = '['
            after.innerHTML = ']'
        }
        outerWrapper.prepend(before)
        outerWrapper.append(after)
        return outerWrapper;
    }


    try {
        let content = createView(json, '')
        pre.remove()
        let div = document.createElement('div')
        let divraw = document.createElement('pre')
        let body = document.getElementsByTagName('body')[0]
        let head = document.getElementsByTagName('head')[0]
        let style = document.createElement('style')

        style.innerHTML = `
        .hidden{
        height : 0;
        overflow : hidden;
        }

        div{
        margin-top : 4px;
        margin-bottom : 4px'
        color: white
        display : flex
        }

        div > *{
margin-top : auto;
margin-bottom : auto
        }

        .btn{
        all : inherit;
        margin-right : 16px
        background-color: transparent;
        font-size : 10px;
        text-align:center;
        padding: 5px
        }

        .rotate{
        transform: rotate(90deg)
        }

        .outer > p{
        color : salmon
        }

        .padding-sm{

        }
        #bubble{
        position: absolute;
  right: 10px;
  top: 15px;
        }

        body *{
        font-family: Consolas, monaco, monospace;
        }
        `
        head.append(style)
        div.append(content)
        divraw.innerHTML = jsonstr;
        body.append(div)

        let btns = document.getElementsByTagName('button')
        for (const btn of btns){
            btn.addEventListener("click", function(event){
                hideToggle(event.target);
            })
            btn.classList.add('btn')
        }

        let bubble = document.createElement('div')
        bubble.id = 'bubble'
        bubble.innerHTML = `<input type="checkbox" id="rawToggle">
  <label for="rawToggle"> Raw</label><br>`
        body.append(bubble)
        let toggleRaw = document.getElementById('rawToggle')
        toggleRaw.addEventListener('change', (event) => {
            if (event.currentTarget.checked) {
                body.innerHTML = ''
                body.append(divraw)
                body.append(bubble)
            } else {
                body.innerHTML = ''
                body.append(div)
                body.append(bubble)
            }
})
    } catch (e) {
        console.log(e);
    }
})();