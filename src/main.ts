import { Actor, CollisionType, Color, Engine, vec } from "excalibur"

// 1 - Criar uma instancia de Engine, que representa o jogo
const game = new Engine({
	width: 800,
	height: 600
})

// 2 - Criar barra do jogador
const barra = new Actor({
	x: 150,
	y: game.drawHeight - 40,

	width: 200,
	height: 20,
	color: Color.Chartreuse
})

// define a colisão do objeto, fixed significa não se mexer quando colidir
barra.body.collisionType = CollisionType.Fixed

// insere o Actor np game - player, no game
game.add(barra)

// 3 - movimentar a barra de acordo com a posição do mouse
game.input.pointers.primary.on("move", (event) => {
	// faz a posição x da barra, ser a mesma do mouse 
	barra.pos.x = event.worldPos.x
})

// 4 - Criar actor bolinha
const bolinha = new Actor({
	x: 100,
	y: 300,
	radius: 10,
	color: Color.Red
})

bolinha.body.collisionType = CollisionType.Passive

//  5 - Criar movimentação bolinha 
const velocidadebolinha = vec(1000, 1000)

setTimeout(() => {
	bolinha.vel = velocidadebolinha
}, 1000)


// 6 - Fazer bolinha rebater nas paredes

bolinha.on("postupdate", () => {
	// se a bolinha colidir com o lado esquerdo
	if (bolinha.pos.x < bolinha.width / 2) {
		bolinha.vel.x = velocidadebolinha.x
	}
	// se a bolinha colidir com o lado direito
	if (bolinha.pos.x + bolinha.width / 2 > game.drawWidth) {
		bolinha.vel.x = -velocidadebolinha.x
	}
	// se a bolinha colidir com a parte superior
	if (bolinha.pos.y < bolinha.height / 2) {
		bolinha.vel.y = velocidadebolinha.y
	}
	// se a bolinha colidir com a parte inferior
	if (bolinha.pos.y + bolinha.height / 2 > game.drawHeight) {
		bolinha.vel.y = -velocidadebolinha.y
	}
})

// Inserir bolinha no game
game.add(bolinha)

//  7 -  Criar os blocos 
//  Configurações de 
const padding = 20
const xoffset = 65
const yoffset = 20
const colunas = 5
const linhas = 3
const corbloco = [Color.Violet, Color.Orange, Color.Yellow]
// const larguradobloco = (game.drawWidth / colunas) - padding - (padding / colunas)
const largurabloco = 136
const alturadobloco = 30
const listablocos: Actor[] = []




// iniciar o game
game.start()