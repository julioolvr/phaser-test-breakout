(function () {
  'use strict';

  var player;
  var ball;
  var blocks = [];

  var ballSpeed = 300;
  var ballReleased = false;

  var game = new Phaser.Game(450, 640, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
  });

  function createBlock(x, y) {
    var block = game.add.sprite(x, y, 'block');

    // block.anchor.setTo(0, 0);
    block.body.bounce.setTo(1, 1);
    block.body.immovable = true;

    return block;
  }

  function createPlayer(x, y) {
    var player = game.add.sprite(x, y, 'block');

    player.anchor.setTo(0.5, 0.5);
    player.body.collideWorldBounds = true;
    player.body.bounce.setTo(1, 1);
    player.body.immovable = true;

    return player;
  }

  function releaseBall() {
    if (!ballReleased) {
      ball.body.velocity.x = ballSpeed;
      ball.body.velocity.y = -ballSpeed;
      ballReleased = true;
    }
  }

  function ballHitsPlayer(_ball, _player) {
    var diff = 0;

    if (_ball.x < _player.x) {
      diff = _player.x - _ball.x;
      _ball.body.velocity.x = (-10 * diff);
    } else if (_ball.x > _player.x) {
      diff = _ball.x -_player.x;
      _ball.body.velocity.x = (10 * diff);
    } else {
      _ball.body.velocity.x = 2 + Math.random() * 8;
    }
  }

  function ballHitsBlock(_ball, _block) {
    _block.destroy();
  }

  function checkGoal() {
    if (ball.y > 625) {
      setBall();
    }
  }

  function setBall() {
    ball.x = player.x;
    ball.y = player.y - ball.body.height;
    ball.body.velocity.x = 0;
    ball.body.velocity.y = 0;
    ballReleased = false;
  }

  function createGrid() {
    var blocksInRow = 450 / 50;
    var rows = 3;
    var topMargin = 50;

    var i, j;
    for (i = 0; i < rows; i++) {
      for (j = 0; j < blocksInRow; j++) {
        blocks.push(createBlock(50 * j, topMargin + i * 20));
      }
    }
  }

  function preload() {
    game.load.image('block', 'assets/rocket.png');
    game.load.image('ball', 'assets/ball.png');
    game.load.image('background', 'assets/background.jpg');
  }

  function create() {
    game.add.tileSprite(0, 0, 450, 640, 'background');

    player = createPlayer(game.world.centerX, 600);

    ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
    ball.anchor.setTo(0.5, 0.5);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.setTo(1, 1);

    setBall();
    createGrid();

    game.input.onDown.add(releaseBall, this);
  }

  function update() {
    player.x = game.input.x;

    var playerHalfWidth = player.width / 2;

    if (player.x < playerHalfWidth) {
      player.x = playerHalfWidth;
    } else if (player.x > game.width - playerHalfWidth) {
      player.x = game.width - playerHalfWidth;
    }

    if (!ballReleased) {
      ball.x = player.x;
    }

    game.physics.collide(ball, player, ballHitsPlayer, null, this);

    var blockIndex;
    for (blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
      game.physics.collide(ball, blocks[blockIndex], ballHitsBlock, null, this);
    }

    checkGoal();
  }
})();