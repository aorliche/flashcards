const $ = q => document.querySelector(q);
const $$ = q => [...document.querySelectorAll(q)];

let hum1 = 0;
let hum2 = 0;
let words = [];

function decToHumStr(dec) {
	const tens = Math.floor(dec/10);
	const ones = dec % 10;
	return String.fromCharCode(0x5500 + 0x10*tens + ones);
}

function longHumStr(dec) {
	if (dec < 100) {
		return decToHumStr(dec);
	} else {
		const dec1 = Math.floor(dec/100);
		const dec2 = dec % 100;
		const hum1 = decToHumStr(dec1);
		const hum2 = decToHumStr(dec2);
		return hum1 + hum2;
	}
}

function longHumText(dec) {
	if (dec < 100) {
		return words[dec];
	} else {
		const dec1 = Math.floor(dec/100);
		const dec2 = dec % 100;
		return words[dec1] + ' Hun ' + words[dec2];
	}
}

function rebuildFlashcard() {
	const front = $('#front-canvas');
	const back = $('#back-canvas');
	let met = null;

	const frontCtx = front.getContext('2d');
	frontCtx.fillStyle = 'white';
	frontCtx.fillRect(0, 0, front.width, front.height);
	frontCtx.fillStyle = 'black';
	frontCtx.font = '100px HunimalSans';
	met = frontCtx.measureText(decToHumStr(hum1));
	frontCtx.fillText(decToHumStr(hum1), 150-met.width/2, 160);
	frontCtx.font = '48px HunimalSans';
	met = frontCtx.measureText(words[hum1]);
	frontCtx.fillText(words[hum1], 150-met.width/2, 230);
	frontCtx.fillText('*', 240, 150);
	frontCtx.font = '100px HunimalSans';
	met = frontCtx.measureText(decToHumStr(hum2));
	frontCtx.fillText(decToHumStr(hum2), 350-met.width/2, 160);
	frontCtx.font = '48px HunimalSans';
	met = frontCtx.measureText(words[hum2]);
	frontCtx.fillText(words[hum2], 350-met.width/2, 230);

	const res = hum1*hum2;
	const resHum = longHumStr(res);
	const resText = longHumText(res);
	const backCtx = back.getContext('2d');
	backCtx.fillStyle = 'white';
	backCtx.fillRect(0, 0, back.width, back.height);
	backCtx.fillStyle = 'black';
	backCtx.font = '100px HunimalSans';
	met = backCtx.measureText(resHum);
	backCtx.fillText(resHum, 250-met.width/2, 160);
	backCtx.font = '48px HunimalSans';
	met = backCtx.measureText(resText);
	backCtx.fillText(resText, 250-met.width/2, 230);
}

function makeNumpad(div) {
	div.innerHTML = '';
	const tab = document.createElement('table');
	tab.classList.add('numpad');
	for (let tens=0; tens<10; tens++) {
		const tr = document.createElement('tr');
		for (let ones=0; ones<10; ones++) {
			const td = document.createElement('td');
			td.innerText = String.fromCharCode(0x5500 + 0x10*tens + ones);
			tr.appendChild(td);
			td.addEventListener('click', e => {
				if ($('#hum-1').checked) {
					hum1 = tens*10 + ones;
				} else {
					hum2 = tens*10 + ones;
				}
				rebuildFlashcard();
			});
		}
		tab.appendChild(tr);
	}
	div.appendChild(tab);
}

window.addEventListener('load', e => {
	makeNumpad($('#numpad'));

	// Load words
	fetch('words/hun3.txt')
	.then(resp => resp.text())
	.then(text => {
		words = text.split(/\r?\n/);
		// Assume we have 100 good words
		for (let i=0; i<100; i++) {
			words[i] = words[i].trim();
			words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
		}
	})
	.catch(err => alert(err));

	// Download
	$('#download-front').addEventListener('click', e => {
		const uri = $('#front-canvas').toDataURL('image/png');
		const link = document.createElement('a');
		link.download = 'front.png';
		link.href = uri;
		link.click();
	});
	
	$('#download-back').addEventListener('click', e => {
		const uri = $('#back-canvas').toDataURL('image/png');
		const link = document.createElement('a');
		link.download = 'back.png';
		link.href = uri;
		link.click();
	});
});
