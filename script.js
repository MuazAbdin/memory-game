class MemoryCardGame {
	constructor(gameImages, levelSize) {
		this.gameImages = gameImages;
		this.levelSize = levelSize;
		this.timerInterval;
		this.grid = document.querySelector(".game-grid");
		this.timer = document.querySelector(".timer");

		this.totalCards = levelSize / 2;
		this.flippedNum = 0;
		this.lastFlippedImgId = -1;
		this.lastFlippedCardIdx = -1;
	}

	initGame = () => {
		this.createGrid(this.levelSize);
		this.dealImages(this.gameImages, this.levelSize);
		this.timer.innerHTML = initTime(this.levelSize);
		this.timer.style.display = 'block';
		this.timerInterval = setInterval(this.timerHandler, 1000);
	}

	endGame = () => {
		clearInterval(this.timerInterval);
		this.grid.innerHTML = '';
		this.grid.style.display = 'none';
		this.timer.innerHTML = '';
		this.timer.style.display = 'none';
	}

	timerHandler = () => {
		let val =  parseInt(this.timer.innerHTML)
		if (parseInt(val) <= 0) { 
			clearInterval(this.timerInterval);
			modals[2].style.display = 'block';
			new Sound("./audio/game-over.wav").play();
			return;
		}
		val--;
		this.timer.innerHTML = val;
	};

	createGrid = (size) => {
		this.grid.style.display = 'grid';
		this.grid.style.gridTemplateColumns = `repeat(${getColsCount(size)}, 1fr)`;
		let cardSize = getCardSize(size);
	
		for (let i=0; i<size; i++) {
			let card = document.createElement("div");
			card.classList.add("card");
			card.setAttribute("data-idx", i);
			card.setAttribute("data-flipped", false);
			card.setAttribute("data-active", true);
			card.style.width = `${cardSize}`;
			card.style.height = `${cardSize}`;
	
			let frontFace = document.createElement("div");
			frontFace.classList.add("card__face", "card__face-front");
			frontFace.innerHTML = '?';
			card.appendChild(frontFace);
	
			let backFace = document.createElement("div");
			backFace.classList.add("card__face", "card__face-back");
			card.appendChild(backFace);
	
			this.grid.appendChild(card);
		}
	
	}

	dealImages = (array, num) => {
		let imagesIdxs = array.map( (img, i) => i);
		let shuffeled = imagesIdxs.sort(() => 0.5 - Math.random());
		let selectedImages = shuffeled.slice(0, num/2);
	
		let positions = Array.apply(null, Array(num)).map( (x, i) => i );
		positions.sort(() => 0.5 - Math.random());
	
		const backCards = this.grid.getElementsByClassName("card__face-back");
		for (let i=0; i<num/2; i++) {
			const tag = `<img src="${this.gameImages[selectedImages[i]]}" data-imageId=${selectedImages[i]}>`;
			backCards[positions[2*i]].innerHTML = tag;
			backCards[positions[2*i + 1]].innerHTML = tag;
		}
	}

	resetCounters = () => {
		this.flippedNum = 0;
		this.lastFlippedImgId = -1;
		this.lastFlippedCardIdx = -1;
	}

	checkEnd = () => {
		if (this.totalCards != 0) { return; }
		clearInterval(this.timerInterval);
		setTimeout(() => { 
			modals[1].style.display = 'block';
			new Sound("./audio/claps.mp3").play();
		}, 1000);
	}

	checkMatch = (card, prev, imageId) => {
		if (this.lastFlippedImgId === imageId) {
			prev.setAttribute("data-active", false);
			card.setAttribute("data-active", false);
			this.totalCards--;
			setTimeout( () => this.resetCounters() , 1000);
		} else {
			prev.setAttribute("data-flipped", false);
			card.setAttribute("data-flipped", false);
			setTimeout( () => {
				prev.style.transform = `rotateY(360deg)`;
				card.style.transform = `rotateY(360deg)`;
				this.resetCounters();
			}, 1000);
		}
		this.checkEnd();
	}

	flipCard = (card, cards) => {
		if (card.getAttribute("data-active") === "false" ||
				card.getAttribute("data-flipped") === "true" ||
				this.flippedNum === 2)
				{ return; }
	
		let imageId = parseInt(card.querySelector("img").getAttribute("data-imageId"));
		let cardIdx = parseInt(card.getAttribute("data-idx"));
	
		card.style.transform = `rotateY(180deg)`;
		card.setAttribute("data-flipped", true);
		new Sound("./audio/flipcard.mp3").play();
		this.flippedNum ++;
	
		if (this.flippedNum === 2) {
			return this.checkMatch(card, cards[this.lastFlippedCardIdx], imageId);
		}
	
		this.lastFlippedCardIdx = cardIdx;
		this.lastFlippedImgId = imageId;
	
	}


}

const fruitImages = [
	"./images/fruits/acorn.svg",	"./images/fruits/apple.svg", 
	"./images/fruits/apricot.svg",	"./images/fruits/avocado.svg",
	"./images/fruits/banana.svg", "./images/fruits/blackberry.svg",
	"./images/fruits/cherry.svg",	"./images/fruits/coconut.svg",
	"./images/fruits/cucumber.svg",	"./images/fruits/custard-apple.svg",
	"./images/fruits/date-fruit.svg", "./images/fruits/dragon-fruit.svg",
	"./images/fruits/fig.svg", "./images/fruits/grapes.svg",
	"./images/fruits/guava.svg", "./images/fruits/jabuticaba.svg",
	"./images/fruits/jambul.svg",	"./images/fruits/jujube.svg",
	"./images/fruits/kiwi.svg", "./images/fruits/kumquat.svg",
	"./images/fruits/lemon.svg", "./images/fruits/longan.svg",
	"./images/fruits/lychee.svg", "./images/fruits/mango.svg",
	"./images/fruits/mangosteen.svg", "./images/fruits/muskmelon.svg",
	"./images/fruits/orange.svg", "./images/fruits/palmyra.svg",
	"./images/fruits/papaya.svg", "./images/fruits/passion-fruit.svg",
	"./images/fruits/pear.svg", "./images/fruits/pineapple.svg",
	"./images/fruits/plum.svg", "./images/fruits/pomegranate.svg",
	"./images/fruits/pumpkin.svg", "./images/fruits/quince.svg",
	"./images/fruits/sapodilla.svg", "./images/fruits/star-fruit.svg",
	"./images/fruits/strawberry.svg", "./images/fruits/sugarcane.svg",
	"./images/fruits/surinam-cherry.svg", "./images/fruits/tamarind.svg",
	"./images/fruits/tomato.svg",	"./images/fruits/watermelon.svg",
]

const navBtns = document.querySelectorAll(".nav-btn"),
			modals = document.querySelectorAll(".modal-wrapper"),
			options = document.querySelector(".options");

const bindEvents = (game) => {
	navBtns.forEach( (btn) => {
		btn.addEventListener('mouseover', () => {
			btn.classList.add("fa-shake");
		});
		btn.addEventListener('mouseout', () => {
			btn.classList.remove("fa-shake");
		});
	});
	
	navBtns[0].addEventListener('click', () => {
		game.endGame();
		options.style.display = 'block';
		modals[1].style.display = 'none';
		modals[2].style.display = 'none';
	});
	
	navBtns[1].addEventListener('click', () => {
		modals[0].style.display = 'block';
	});
	
	modals[0].querySelector(".close-btn").addEventListener('click', () => {
		modals[0].style.display = 'none';
	});
	modals[1].querySelector(".close-btn").addEventListener('click', () => {
		game.endGame();
		options.style.display = 'block';
		modals[1].style.display = 'none';
		modals[2].style.display = 'none';
	});
	modals[2].querySelector(".close-btn").addEventListener('click', () => {
		game.endGame();
		options.style.display = 'block';
		modals[1].style.display = 'none';
		modals[2].style.display = 'none';
	});
	
	window.onclick = function(event) {
		if (event.target == modals[0]) {
			modals[0].style.display = "none";
		}
		if (event.target == modals[1]) {
			modals[1].style.display = "none";
		}
	}
}


options.querySelectorAll(".btn").forEach( (item) => {
	item.addEventListener('click', () => {
		options.style.display = 'none';
		const levelSize = parseInt(item.getAttribute('data-size'));
		const newGame = new MemoryCardGame(fruitImages, levelSize);
		newGame.initGame();
		bindEvents(newGame);

		const cards = newGame.grid.querySelectorAll(".card");
		cards.forEach( (card) => {
			card.addEventListener('click', () => newGame.flipCard(card, cards) )
		});

	});
});


/* Functions */
// get count of grid columns
function getColsCount(size) {
	switch(size) {
		case 16: return 4;
		case 32: return 8;
		case 72: return 12;
	}
	return "auto-fit";
}

// get size of grid cards
function getCardSize(size) {
	switch(size) {
		case 16: return '120px';
		case 32: return '100px';
		case 72: return '80px';
	}
	return "100px";
}

function initTime(size) {
	switch(size) {
		case 16: return '100';
		case 32: return '160';
		case 72: return '250';
	}
	return '0';
}

class Sound {
	constructor(src) {
		this.sound = document.createElement("audio");
		this.sound.src = src;
		this.sound.setAttribute("preload", "auto");
		this.sound.setAttribute("controls", "none");
		this.sound.style.display = "none";
		document.body.appendChild(this.sound);
	}
	play = () => this.sound.play();
	stop = () => this.sound.pause();
}
