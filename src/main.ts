import { Actor, CollisionType, Color, Engine, vec, Font, Label, FontUnit, Sound, Loader } from "excalibur";
// 1 - Criar uam instancia de engine, que representa o jogo
const game = new Engine({
	width: 800,
	height: 600, //colocando o tamanho do nosso game
});

const sound = new Sound('./src/WhatsApp Audio 2024-05-28 at 15.29.42.mpeg','');
const sound2 = new Sound('./som/explosion.wav');
const loader = new Loader([sound, sound2]);


// 2 - Criar barra do player
//todo objeto,npc,player aqui no excalibur é actor, depois que você digitou o actor dê um enter que ele irá fazer o import automático e depois coloca o parenteses
const barra = new Actor({
	x: 150,
	//altura do game -40
	y: game.drawHeight - 40,
	width: 800,
	height: 20,
	//importando as cores do excalibur
	color: Color.Chartreuse,
});

//mecanica da parte de fisica é no body
//Define o tipo de colisão da barra
//Collision.Type.Fixed = significa que ele não irá se mexer quando colidir
barra.body.collisionType = CollisionType.Fixed;

// adicionando as alterações no game, mais precisamente a barra que colocamos no código
game.add(barra);

// 3 - Movimentar a barra de acordo com a posição do mouse
game.input.pointers.primary.on("move", (event) => {
	barra.pos.x = event.worldPos.x; //posição x da barra seja a mesma posição do que chamou o evento move que foi o mouse, ou seja será a mesma posição do mouse
});

//4 - Criar o Actor bolinha
const bolinha = new Actor({
	x: 100,
	y: 300,
	radius: 10,
	color: Color.Red,
});

bolinha.body.collisionType = CollisionType.Passive; //não reage a colisão mas detecta um tipo de colisão

//CollisionType.Active //A bolinha reage a colisão

// 5 Criar movimento da bolinha
const velocidadeBolinha = vec(1500, 1500);
setTimeout(
	() => {
		//espera um determinado tempo para disparar a função
		bolinha.vel = velocidadeBolinha;
	},
	1000 //unidade de mili segundos
);

// 6 - Fazer bolinha rebater na parede
bolinha.on("postupdate", () => {
	// Se a bolinha colidir com o lado esquerdo
	if (bolinha.pos.x < bolinha.width / 2) {
		bolinha.vel.x = velocidadeBolinha.x;
	}
	//Se a bolinha colidir com o lado direito
	if (bolinha.pos.x + bolinha.width / 2 > game.drawWidth) {
		bolinha.vel.x = -velocidadeBolinha.x;
	}
	//Se a bolinha colidir com o canto superior
	if (bolinha.pos.y < bolinha.height / 2) {
		bolinha.vel.y = velocidadeBolinha.y;
	}

	  // Se a bolinha colidir com o canto inferior
	  if (bolinha.pos.y + bolinha.height / 2 > game.drawHeight)// aqui se a altura da bolinha dor menor que 150 significa que ela colidiu 
	  {
	    // bolinha.vel.y = -velocidadeBolinha.y




	  }
});

// adicionando a bolinha
game.add(bolinha);

// 7 Criar os blocos 
const padding = 20
const xoffset = 65
const yoffset = 20

const colunas = 5
const linhas = 3

const corBloco = [Color.Red, Color.Orange, Color.Yellow] // Para chamar a configuração color escreva color e depois dê um enter para ele ficar verde, pois se não, não dá certo

const larguraBloco = (game.drawWidth / colunas) - padding - (padding / colunas) //drawWidth largura total
// const larguraBloco = 136
const alturaBloco = 30

const listaBlocos: Actor[] = []

// Renderização dos bloquinhos


//Renderiza 3 linhas 
for (let j = 0; j < linhas; j++) {
	// Renderiza 5 bloquinhos
	for (let i = 0; i < colunas; i++) {
		listaBlocos.push(
			new Actor({
				x: xoffset + i * (larguraBloco + padding) + padding,//offset descolamento indica o deslocamento de um bloco para o outro, primeio bloco, o segundo bloco vai junto com i e conforme o i aumenta o proximo offset  e isso aumenta de uma forma que coloque um pouco mais para o lado de uma forma que desloque uma linha com um deslacamento em partes diferentes
				y: yoffset + j * (alturaBloco + padding) + padding, //largura por fora e largura por dentro
				width: larguraBloco,
				height: alturaBloco,
				color: corBloco[j]

			})
		)
	}
}
// Cria uma linha com 5 bloquinhos, cria outroa linha com mais 5 bloquinhos até dar 3 linhas


listaBlocos.forEach(bloco => {
	bloco.body.collisionType = CollisionType.Active
	game.add(bloco)
})

// adicionando pontuação
let pontos = 0;


// label = text + actor
const textopontos = new Label({
	text: pontos.toString(),
	font: new Font({
		size: 40,
		color: Color.White,
		strokeColor: Color.Black,
		unit: FontUnit.Px
	}),
	pos: vec(600, 500)
})

game.add(textopontos)

// const textoPontos = new Text({
// 	text: "Hello World",
// 	font: new Font({ size: 20 })
// })

// const objetoTexto = new Actor({
// 	x: game.drawWidth - 50,
// 	y: game.drawHeight - 50
// })

// game.add(objetoTexto)

// objetoTexto.graphics.use(textoPontos)

let colidindo: boolean = false // vai começar como falso para mostrar que não está colidindo
//ajuda a detectar as colisoes 

bolinha.on("collisionstart", (event) => {
	//Verificar se a bolinha colidiu com algum bloco destrutível
	if (listaBlocos.includes(event.other)) {
		//event.other verifica se a bolinha colidiu com outro bloco dentro do lista de blocos
		//se for, destruir o bloco colididio
		event.other.kill()

		// adiciona un ponto 
		pontos++
		// atualiza valor do placar
		textopontos.text = pontos.toString()
		// som da bolinha 
		sound.play(1);
	}
	// Rebater a bolinha Inverter as direções x e y 
	let interseccao = event.contact.mtv.normalize()
	// se não está colidindo
	//colidindo == false
	if (!colidindo) {
		colidindo = true
		// interseccao.x e interseccao.y
		//O maior representa o eixo onde houver o contato
		if (Math.abs(interseccao.x) > Math.abs(interseccao.y)) {
			bolinha.vel.x = bolinha.vel.x * -1
		} else {
			bolinha.vel.y = -bolinha.vel.y
		}
		// mensagem de win quando acabar o jogo
		if (pontos == 15) {
			alert("win")
		}
	}

})

bolinha.on("collisionend", () => {
	colidindo = false
})

bolinha.on("exitviewport", () => {
	sound2.play(1)
	alert("Morreu")
	window.location.reload()
})

await game.start(loader);
//iniciando o game
game.start();