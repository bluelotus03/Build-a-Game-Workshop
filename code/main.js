import kaboom from "kaboom";

// initialize context
kaboom({background: [0, 0, 0]});

// load assets
loadPedit("enemy", "sprites/enemy.pedit");
loadPedit("player", "sprites/player.pedit");
loadPedit("wall", "sprites/wall.pedit");
loadSound("score", "sounds/score.mp3");
loadSound("enemy-shot", "sounds/footstep_carpet_004.ogg");
loadSound("shoot", "sounds/laserSmall_004.ogg");
loadSound("won", "sounds/jingles_PIZZI02.ogg");
loadSound("lost", "sounds/jingles_HIT05.ogg");

// win scene
scene('win', () => {
  add([
    text('You Won!'),
    origin('center'),
    pos(width()/2, height()/2)
  ])
})

// lose scene
scene('lose', () => {
  add([
    text('Game Over'),
    origin('center'),
    pos(width()/2, height()/2)
  ])
})

// separate layers
layer(['obj', 'ui'], 'obj')

// add a level
addLevel([
  '!! ^^^^^^^^^^^^^^^^^^^     &&',
  '!!                         &&',
  '!! ^^^^^^^^^^^^^^^^^^^     &&',
  '!!                         &&',
  '!! ^^^^^^^^^^^^^^^^^^^     &&',
  '!!                         &&',
  '!!                         &&',
  '!!                         &&',
  '!!                         &&',
  '!!                         &&',
  '!!                         &&',
  '!!                         &&',
  '!!                         &&',
  '!!                         &&',
  '!!                         &&',
  '!!                         &&',
  '!!                         &&',
  '!!                         &&',
  '!!                         &&',
], {
  width: 30,
  height: 22,
  '^': () => [sprite('enemy'), 'enemy', scale(0.5), area()],
  '!': () => [sprite('wall'), 'left-wall', area()],
  '&': () => [sprite('wall'), 'right-wall', area()],
})

// add the score
const score = add([
  text('0'),
  pos(5, 5),
  layer('ui'),
  {
    value: 0,
  }
])

// move speeds
const MOVE_SPEED = 200
const ENEMY_SPEED = 125
let CURRENT_SPEED = ENEMY_SPEED
const LEVEL_DOWN = 100
const BULLET_SPEED = 400

// add player
const player = add([
  sprite('player'),
  scale(0.5),
  pos(width()/2, height()/1.2),
  origin('center'),
  area(),
  play('score')
])

// add bullets
function spawnBullet(p) {
  add([
    rect(3,5),
    pos(p),
    origin('center'),
    color(255, 8, 246),
    area(),
    'bullet'
  ])
}

// keystroke events
keyDown('left', () => {
  player.move(-MOVE_SPEED, 0)
})

keyDown('right', () => {
  player.move(MOVE_SPEED, 0)
})

keyDown('space', () => {
  spawnBullet(player.pos.add(0, -35))
  play('shoot')
})

// add enemy motion
onUpdate('enemy', (e) => {
  e.move(CURRENT_SPEED, 0)
})

// enemy collides with left wall
onCollide('enemy', 'left-wall', () => {
  CURRENT_SPEED = ENEMY_SPEED
  every('enemy', (e) => {
    e.move(0, LEVEL_DOWN)
  })
})

// enemy collides with right wall
onCollide('enemy', 'right-wall', () => {
  CURRENT_SPEED = -ENEMY_SPEED
  every('enemy', (e) => {
    e.move(0, LEVEL_DOWN)
  })
})

// player collides with enemy
player.onCollide('enemy', () => {
  play('lost')
  go('lose')
})

// enemies reach bottom of game board
onUpdate('enemy', (e) => {
  if (e.pos.y >= height() - 70) {
    play('lost')
    go('lose')
  }
})

// add bullet motion
onUpdate('bullet', (b) => {
  b.move(0, -BULLET_SPEED)
  if (b.pos.y < 0){
    destroy(b)
  }
})

// bullet collides with enemy
onCollide('bullet', 'enemy', (b, e) => {
  play('enemy-shot')
  shake(2)
  destroy(b)
  destroy(e)
  score.value++
  score.text = score.value
})

// all enemies defeated
player.onUpdate(() => {
  if(get('enemy').length == 0) {
    play('won')
    go('win')
  }
})