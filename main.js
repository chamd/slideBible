let nowBible = {
    book: "창",
    chapter: 1,
    verse: 1,
    maxChapter: 1,
    maxVerse: 1,
}

let openCommand = false;
let ctrl = false;
let timer;

let setting = {
    fontSize: 110,
    autoFontSize: true,
    length: false,
}

function setBible() {
    let str = bibles[nowBible.book][nowBible.chapter][nowBible.verse];
    let editStr = str;
    let editVerse = nowBible.verse;
    let matchResult = str.match(/\|([^\d]), (\d+)\|/);
    if (matchResult) {
        editStr = str.replace(/\|([^\d]), (\d+)\|/, '');
        let [_, mode, ver] = matchResult;

        if (mode == 'g') {
            nowBible.verse = parseInt(ver);
            editVerse = nowBible.verse;
            setBible();
            return;
        }
        if (mode == 'c') {
            editVerse = `${nowBible.verse}-${parseInt(ver)}`
        }
    }
    document.getElementById('content').innerHTML = `<span id="verse">${editVerse}</span> ${editStr}`;
    document.getElementById('bookChapter').innerHTML = `${booksLN[booksSN.indexOf(nowBible.book)]} ${nowBible.chapter}장`;

    document.getElementById('lengthChapter').innerHTML = `
    ${Object.keys(bibles[nowBible.book]).length}
    `;
    document.getElementById('lengthVerse').innerHTML = `
    ${Object.keys(bibles[nowBible.book][nowBible.chapter]).length}
    `;

    nowBible.maxChapter = Object.keys(bibles[nowBible.book]).length;
    nowBible.maxVerse = Object.keys(bibles[nowBible.book][nowBible.chapter]).length;

    if (setting.autoFontSize && document.documentElement.scrollHeight > document.documentElement.clientHeight) {
        autoFontSize();
    }

}

function setFontSize(value) {
    setting.fontSize = value;
    document.getElementById('content').style.fontSize = `${value}px`;
}

function autoFontSize() {
    if (document.documentElement.scrollHeight > document.documentElement.clientHeight) {        
        setFontSize(setting.fontSize - 5);
        setTimeout(() => {
            autoFontSize();
        }, 100);
    } else {
        dynamicAlert(`글꼴크기: ${setting.fontSize}px`);
    }
}

setBible();

window.addEventListener('keydown', e => {
    if (e.key == 'Control') {
        ctrl = true;
    }
    if (!openCommand) {
        if (e.key == '/') {
            openCommand = true;
            document.getElementById('command').style.width = '400px';
            document.getElementById('command').style.left = 'calc(50% - 220px)';
            document.getElementById('command').style.bottom = '30px';
            setTimeout(() => {
                document.getElementById('command').style.width = '360px';
                document.getElementById('command').style.left = 'calc(50% - 200px)';
                document.getElementById('command').style.bottom = '20px';
            }, 300);
            document.getElementById('command').focus();
            document.getElementById('command').value = '';
        }
        if (e.key == 'ArrowRight') {
            let str = bibles[nowBible.book][nowBible.chapter][nowBible.verse];
            // console.log(nowBible);
            let matchResult = str.match(/\|([^\d]), (\d+)\|/);
            if (matchResult) {
                let [_, mode, ver] = matchResult;
                if (mode == 'c') {
                    nowBible.verse = parseInt(ver) + 1;
                }
            } else if (nowBible.verse != nowBible.maxVerse) {
                nowBible.verse += 1;
            }
            setBible();
        }
        if (e.key == 'ArrowLeft') {
            if (nowBible.verse != 1) {
                nowBible.verse -= 1;
            }
            setBible();
        }
        if (e.key == 'ArrowDown') {
            if (ctrl) {
                setFontSize(setting.fontSize - 5);
                dynamicAlert(`글꼴크기: ${setting.fontSize}px`);
            } else {
                if (nowBible.chapter != nowBible.maxChapter) {
                    nowBible.verse = 1;
                    nowBible.chapter += 1;
                }
                setBible();
            }
        }
        if (e.key == 'ArrowUp') {
            if (ctrl) {
                setFontSize(setting.fontSize + 5);
                dynamicAlert(`글꼴크기: ${setting.fontSize}px`);
            } else {
                if (nowBible.chapter != 1) {
                    nowBible.verse = 1;
                    nowBible.chapter -= 1;            
                }
                setBible();
            }
        }
    } else {
        if (e.key == "Enter") {
            openCommand = false;
            document.getElementById('command').style.width = '30px';
            document.getElementById('command').style.left = 'calc(50% - 35px)';
            document.getElementById('command').style.bottom = '-80px';
            let command = document.getElementById('command').value;
            let slash = command.split('/').length - 1;
            let args = command.replace(/\//g, '').split(' ');
            if (slash == 1) {
                if (booksSN.includes(args[0]) || booksLN.includes(args[0])) {
                    if (booksSN.includes(args[0])) {
                        nowBible.book = args[0];
                    } else if (booksLN.includes(args[0])) {
                        nowBible.book = booksSN[booksLN.indexOf(args[0])]
                    }
                    if (args[1]) {
                        nowBible.chapter = parseInt(args[1]);
                    } else if (args[0]) {
                        nowBible.chapter = 1;
                    }
                    if (args[2]) {
                        nowBible.verse = parseInt(args[2]);
                    } else {
                        nowBible.verse = 1;
                    }
                } else if (args[0] == '글') {
                    setFontSize(parseInt(args[1]));
                    setTimeout(() => {
                        dynamicAlert(`글꼴크기: ${parseInt(args[1])}px`);
                    }, 1);
                } else if (args[0] == '자동글') {
                    setting.autoFontSize = !setting.autoFontSize;
                    setTimeout(() => {
                        dynamicAlert(`자동글: ${setting.autoFontSize}`);
                    }, 1);
                } else if (args[0] == '길이') {
                    setting.length = !setting.length
                    if (setting.length) {
                        document.getElementById('lengthChapter').style.display = 'block';
                        document.getElementById('lengthVerse').style.display = 'block';
                    } else {
                        document.getElementById('lengthChapter').style.display = 'none';
                        document.getElementById('lengthVerse').style.display = 'none';
                    }
                    setTimeout(() => {
                        dynamicAlert(`길이: ${setting.length}`);
                    }, 1);
                }
            } else if (slash == 2) {
                if (args[0]) {
                    nowBible.chapter = parseInt(args[0]);
                }
                if (args[1]) {
                    nowBible.verse = parseInt(args[1]);
                } else {
                    nowBible.verse = 1;
                }
            } else if (slash == 3) {
                if (args[0]) {
                    nowBible.verse = parseInt(args[0]);
                }
            }

            setBible();
        }
        if (e.key == 'Escape') {
            openCommand = false;
            document.getElementById('command').style.width = '30px';
            document.getElementById('command').style.left = 'calc(50% - 35px)';
            document.getElementById('command').style.bottom = '-80px';
        }
    }
})

window.addEventListener('keyup', e => {
    if (e.key == 'Control') {
        ctrl = false;
    }
})

function dynamicAlert(textToAlert) {
    clearTimeout(timer);
    document.getElementById('bookChapter').style.width = '510px';
    document.getElementById('bookChapter').style.height = '105px';
    document.getElementById('bookChapter').style.left = 'calc(50% - 255px)';
    document.getElementById('bookChapter').style.top = '3px';
    document.getElementById('bookChapter').style.lineHeight = '105px';
    document.getElementById('bookChapter').style.fontSize = '52px';
    document.getElementById('bookChapter').innerHTML = textToAlert;    
    setTimeout(() => {
        document.getElementById('bookChapter').style.width = '500px';
        document.getElementById('bookChapter').style.height = '100px';
        document.getElementById('bookChapter').style.left = 'calc(50% - 250px)';            
        document.getElementById('bookChapter').style.top = '5px';
        document.getElementById('bookChapter').style.lineHeight = '100px';
        document.getElementById('bookChapter').style.fontSize = '50px';
    }, 300);
    // document.getElementById('bookChapter').style.width = '570px';
    // document.getElementById('bookChapter').style.height = '205px';
    // document.getElementById('bookChapter').style.left = 'calc(50% - 285px)';
    // document.getElementById('bookChapter').style.top = '20px';
    // document.getElementById('bookChapter').style.lineHeight = '205px';
    // document.getElementById('bookChapter').style.fontSize = '52px';
    // document.getElementById('bookChapter').innerHTML = textToAlert;    
    // setTimeout(() => {
    //     document.getElementById('bookChapter').style.width = '560px';
    //     document.getElementById('bookChapter').style.height = '200px';
    //     document.getElementById('bookChapter').style.left = 'calc(50% - 280px)';            
    //     document.getElementById('bookChapter').style.top = '20px';
    //     document.getElementById('bookChapter').style.lineHeight = '200px';
    //     document.getElementById('bookChapter').style.fontSize = '50px';
    // }, 300);

    timer = setTimeout(() => {
        document.getElementById('bookChapter').style.width = '400px';
        document.getElementById('bookChapter').style.height = '70px';
        document.getElementById('bookChapter').style.left = 'calc(50% - 200px)';
        document.getElementById('bookChapter').style.top = '20px';
        document.getElementById('bookChapter').style.lineHeight = '70px';
        document.getElementById('bookChapter').style.fontSize = '40px';    
        document.getElementById('bookChapter').innerHTML = `${booksLN[booksSN.indexOf(nowBible.book)]} ${nowBible.chapter}장`;
    }, 1000);
}