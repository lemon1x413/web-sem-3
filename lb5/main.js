// Task 1
function swapXY() {
    const x = document.getElementById('blockX');
    const y = document.getElementById('blockY');
    if (x && y) {
        const temp = x.innerHTML;
        x.innerHTML = y.innerHTML;
        y.innerHTML = temp;
    }
}
swapXY();

// Task 2
function calculateTrapezoidArea() {
    const a = 10;
    const b = 15;
    const h = 8;
    const area = ((a + b) / 2) * h;

    const block3 = document.getElementById('block3');
    const resultDiv = document.createElement('div');
    resultDiv.className = 'task-box';
    resultDiv.innerHTML = `<strong>Завдання 2:</strong> Площа трапеції (a=${a}, b=${b}, h=${h}) = <strong>${area}</strong>`;
    block3.appendChild(resultDiv);
}
calculateTrapezoidArea();

// Task 3
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        c.trim();
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function initTask3() {
    const block3 = document.getElementById('block3');
    const cookieName = 'reversedNumber';
    const savedValue = getCookie(cookieName);

    const container = document.createElement('div');
    container.className = 'task-box';
    container.innerHTML = '<strong>Завдання 3:</strong><br>';
    block3.appendChild(container);

    if (savedValue) {
        const userKeep = confirm(`Інформація в cookies: ${savedValue}. \nНатисніть "OK", щоб зберегти дані.\nНатисніть "Скасувати", щоб видалити дані та оновити форму.`);

        if (userKeep) {
            alert("Cookies наявні. Необхідно перезавантажити сторінку (але ви вибрали зберегти, тому форма прихована).");
        } else {
            eraseCookie(cookieName);
            location.reload();
        }
    } else {
        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = 'Введіть число (напр. 247)';

        const btn = document.createElement('button');
        btn.innerText = 'Перевернути';

        btn.onclick = () => {
            const val = input.value;
            if (val) {
                const reversed = val.toString().split('').reverse().join('');
                alert(`Результат: ${reversed}`);
                setCookie(cookieName, reversed, 7);
                location.reload();
            }
        };

        container.appendChild(input);
        container.appendChild(btn);
    }
}
initTask3();

// Task 4
function initTask4() {
    const block3 = document.getElementById('block3');
    const container = document.createElement('div');
    container.className = 'task-box';
    container.innerHTML = '<strong>Завдання 4 (Align Left):</strong><br>';

    const blocksToAlign = ['block2', 'block3', 'block4'];

    blocksToAlign.forEach(blockId => {
        const wrapper = document.createElement('div');
        const label = document.createElement('label');
        label.innerText = `Вирівняти ${blockId} ліворуч: `;

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'alignGroup';

        radio.value = blockId;
        radio.onclick = () => {
            document.getElementById(blockId).style.textAlign = 'left';
            localStorage.setItem('align_' + blockId, 'left');
        };

        wrapper.appendChild(label);
        wrapper.appendChild(radio);
        container.appendChild(wrapper);

        if (localStorage.getItem('align_' + blockId) === 'left') {
            document.getElementById(blockId).style.textAlign = 'left';
            radio.checked = true;
        }
    });

    block3.appendChild(container);
}
initTask4();

// Task 5
function initTask5() {
    const blocks = ['block1', 'block2', 'block3', 'block4', 'block5', 'block6'];

    blocks.forEach(blockId => {
        const block = document.getElementById(blockId);
        if (!block) return;

        const savedItems = JSON.parse(localStorage.getItem('list_' + blockId) || '[]');
        if (savedItems.length > 0) {
            renderList(block, blockId, savedItems);
            return;
        }

        const links = block.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('focus', () => {
                if (block.querySelector('.list-creation-form')) return;

                if (getComputedStyle(block).position === 'static') {
                    block.style.position = 'relative';
                }

                const formDiv = document.createElement('div');
                formDiv.className = 'list-creation-form';

                Object.assign(formDiv.style, {
                    position: 'absolute',
                    zIndex: '1000',
                    top: '0',
                    left: '10px',
                    width: '280px',
                    backgroundColor: '#E5E5E5',
                    color: '#14213D',
                    border: '1px solid #ccc',
                    padding: '15px',
                    borderRadius: '8px',
                    marginTop: '10px'
                });

                if (blockId === 'block5' || blockId === 'block6') {
                    formDiv.style.top = 'auto';
                    formDiv.style.bottom = '100%';
                    formDiv.style.marginBottom = '10px';
                }

                formDiv.innerHTML = `<strong style="display:block; margin-bottom:10px;">Створення списку:</strong>`;

                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = 'Текст елемента...';
                Object.assign(input.style, {
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#E5E5E5',
                    borderRadius: '4px',
                    marginBottom: '10px',
                    boxSizing: 'border-box'
                });


                const addBtn = document.createElement('button');
                addBtn.innerText = 'Додати пункт';
                Object.assign(addBtn.style, {
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#fca311',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginBottom: '10px'
                });

                const previewList = document.createElement('ol');
                previewList.style.paddingLeft = '20px';
                previewList.style.marginBottom = '10px';
                previewList.style.maxHeight = '100px';
                previewList.style.overflowY = 'auto';

                const btnGroup = document.createElement('div');
                btnGroup.style.display = 'flex';
                btnGroup.style.justifyContent = 'space-between';
                btnGroup.style.gap = '5px';

                const saveBtn = document.createElement('button');
                saveBtn.innerText = 'Зберегти';
                Object.assign(saveBtn.style, {
                    flex: '1',
                    padding: '8px',
                    backgroundColor: '#fca311',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'none'
                });

                const cancelBtn = document.createElement('button');
                cancelBtn.innerText = 'Закрити';
                Object.assign(cancelBtn.style, {
                    flex: '1',
                    padding: '8px',
                    backgroundColor: '#14213D',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                });

                let tempItems = [];

                addBtn.onclick = () => {
                    if (input.value.trim()) {
                        const text = input.value.trim();
                        tempItems.push(text);

                        const li = document.createElement('li');
                        li.innerText = text;
                        previewList.appendChild(li);

                        input.value = '';
                        input.focus();
                        saveBtn.style.display = 'block';
                    }
                };

                saveBtn.onclick = () => {
                    if (tempItems.length > 0) {
                        localStorage.setItem('list_' + blockId, JSON.stringify(tempItems));
                        renderList(block, blockId, tempItems);
                    }
                };

                cancelBtn.onclick = () => {
                    block.removeChild(formDiv);
                };

                btnGroup.appendChild(cancelBtn);
                btnGroup.appendChild(saveBtn);

                formDiv.appendChild(input);
                formDiv.appendChild(addBtn);
                formDiv.appendChild(previewList);
                formDiv.appendChild(btnGroup);

                block.appendChild(formDiv);
            });
        });
    });
}

function renderList(blockElement, blockId, items) {
    blockElement.innerHTML = '';
    blockElement.style.overflow = 'auto';

    const ol = document.createElement('ol');
    ol.style.alignSelf = 'start';
    items.forEach((text, index) => {
        const li = document.createElement('li');
        li.innerText = text;

        const delBtn = document.createElement('button');
        delBtn.innerText = '✖';
        Object.assign(delBtn.style, {
            marginLeft: '10px',
            color: 'red',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
        });

        delBtn.onclick = () => {
            items.splice(index, 1);
            localStorage.setItem('list_' + blockId, JSON.stringify(items));
            if (items.length === 0) {
                localStorage.removeItem('list_' + blockId);
                location.reload();
            } else {
                renderList(blockElement, blockId, items);
            }
        };

        li.appendChild(delBtn);
        ol.appendChild(li);
    });

    blockElement.appendChild(ol);

    const resetBtn = document.createElement('button');
    resetBtn.innerText = 'Видалити список';
    Object.assign(resetBtn.style, {
        padding: '8px',
        backgroundColor: '#fca311',
        color: `${window.getComputedStyle(blockElement).backgroundColor == 'rgb(229, 229, 229)' ? '#14213D' : '#E5E5E5'}`,
        border: `2px solid ${window.getComputedStyle(blockElement).backgroundColor == 'rgb(229, 229, 229)' ? '#14213D' : '#E5E5E5'}`,
        borderRadius: '4px',
        cursor: 'pointer',
        marginBottom: '10px'
    });
    resetBtn.style.fontSize = '0.8em';
    resetBtn.style.marginTop = '5px';
    resetBtn.onclick = () => {
        localStorage.removeItem('list_' + blockId);
        location.reload();
    };
    blockElement.appendChild(resetBtn);
}

initTask5();