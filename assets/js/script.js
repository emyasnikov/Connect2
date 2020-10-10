/*******************************************************************************

  WebApp by Evgenij 'Warl' Myasnikov

*******************************************************************************/

if (!window.requestAnimationFrame){
   window.requestAnimationFrame = function(callback){
    window.setTimeout(callback, 1000/60);
  };
}

var app = {
  state: null,
  timer: null,
  canvas: null,
  context: null,
  width: 0,
  height: 0,

  init: function(){
    app.state = app.splash;
    app.timer = Date.now();
    app.canvas = document.getElementById('canvas');
    app.canvas.width = app.width = window.innerWidth;
    app.canvas.height = app.height = window.innerHeight;
    app.context = app.canvas.getContext('2d');
    app.state.init();
    app.input();
    app.loop();
  },

  input: function(){
    window.addEventListener('touchstart', function(event){
      event.preventDefault();
      app.state.input('start', event.touches[0].pageX, event.touches[0].pageY);
    }, false);
    window.addEventListener('touchmove', function(event){
      event.preventDefault();
      app.state.input('move', event.touches[0].pageX, event.touches[0].pageY);
    }, false);
    window.addEventListener('touchend', function(event){
      event.preventDefault();
      app.state.input('end', 0, 0);
    }, false);
  },

  loop: function(){
    ct = Date.now();
    dt = (ct - app.timer) / 1000;

    app.state.update(dt);
    app.state.render();

    app.timer = ct;
    window.requestAnimationFrame(app.loop);
  },

  splash: {
    layout: [],
    image: null,
    logo: null,
    start: 0,

    init: function(){
      app.splash.image = new Image();
      app.splash.image.src = 'svg/logo.svg';
      app.splash.logo = new app.surface(
        Math.floor(app.width * 0.5 - Math.min(app.width * 0.5, app.height * 0.5)),
        Math.floor(app.height * 0.5 - Math.min(app.width * 0.5, app.height * 0.5)),
        Math.floor(Math.min(app.width * 1.0, app.height * 1.0)),
        Math.floor(Math.min(app.width * 1.0, app.height * 1.0)));
      app.splash.layout.push(app.splash.logo);

      app.splash.image.onload = function(){
        app.splash.logo.context.drawImage(app.splash.image, 0, 0,
          app.splash.logo.w, app.splash.logo.h);
      }
      lib.draw.text(app.context, '', 0, 0, 0, 'Arial', 0, 0);
    },

    input: function(event, x, y){
      if (event == 'start'){
        app.menu.init();
      }
    },

    update: function(dt){
      if ((app.splash.start += dt) > 3){
        app.menu.init();
      }
    },

    render: function(){
      lib.draw.clear(app.context, '#000');
      for (i = 0; i < app.splash.layout.length; i++){
        app.splash.layout[i].render();
      }
    }
  },

  menu: {
    layout: [],
    logo: null,
    title: null,
    play: null,
    initialised: false,

    init: function(){
      app.state = app.menu;
      if (!app.menu.initialised){
        app.menu.logo = new app.surface(
          Math.floor(app.width * 0.5 - Math.min(app.width * 0.25, app.height * 0.25)),
          Math.floor(app.height * 0.25 - Math.min(app.width * 0.25, app.height * 0.25)),
          Math.floor(Math.min(app.width * 0.5, app.height * 0.5)),
          Math.floor(Math.min(app.width * 0.5, app.height * 0.5)));
        app.menu.layout.push(app.menu.logo);
        app.menu.title = new app.surface(0, Math.floor(app.height * 0.48),
          app.width, Math.floor(app.height * 0.12));
        app.menu.layout.push(app.menu.title);
        app.menu.play = new app.surface(0, Math.floor(app.height * 0.72),
          app.width, Math.floor(app.height * 0.08));
        app.menu.layout.push(app.menu.play);

        for (i = 0; i < 2; i++){
        for (j = 0; j < 2; j++){
          lib.draw.circle(app.menu.logo.context,
            Math.floor(app.menu.logo.w * (0.25 + 0.5 * j)),
            Math.floor(app.menu.logo.h * (0.25 + 0.5 * i)),
            Math.floor(app.menu.logo.w * 0.16),
            j == 1 && i == 0 ? '#FFF' : '#AE0', true);
        }}
        lib.draw.line(app.menu.logo.context,
          Math.floor(app.menu.logo.w * 0.25), Math.floor(app.menu.logo.h * 0.25),
          Math.floor(app.menu.logo.w * 0.25), Math.floor(app.menu.logo.h * 0.75),
          Math.floor(app.menu.logo.w * 0.09), '#AE0');
        lib.draw.line(app.menu.logo.context,
          Math.floor(app.menu.logo.w * 0.25), Math.floor(app.menu.logo.h * 0.75),
          Math.floor(app.menu.logo.w * 0.75), Math.floor(app.menu.logo.h * 0.75),
          Math.floor(app.menu.logo.w * 0.09), '#AE0');
        lib.draw.text(app.menu.title.context, 'CONNECT2',
          Math.floor(app.menu.title.w * 0.5), Math.floor(app.menu.title.h * 0.5),
          Math.floor(app.menu.title.h * 0.8), 'Arial',
          '#AE0', 'center', 'middle');
        lib.draw.text(app.menu.play.context, 'PLAY',
          Math.floor(app.menu.play.w * 0.5), Math.floor(app.menu.play.h * 0.5),
          Math.floor(app.menu.play.h * 0.8), 'Arial',
          '#FFF', 'center', 'middle');
        app.menu.initialised = true;
      }
    },

    input: function(event, x, y){
      if (event == 'start' &&
        x > app.menu.play.x && x < app.menu.play.x + app.menu.play.w &&
        y > app.menu.play.y && y < app.menu.play.y + app.menu.play.h){
        app.game.init();
      }
    },

    update: function(dt){},

    render: function(){
      lib.draw.clear(app.context, '#000');
      for (i = 0; i < app.menu.layout.length; i++){
        app.menu.layout[i].render();
      }
    }
  },

  game: {
    colors: [],
    elements: [],
    layout: [],
    sequence: [],
    shapes: [],
    shades: [],
    grid: null,
    panel: null,
    restart: null,
    timer: null,
    initialised: false,
    intersected: false,
    score: 0,
    time: 0,

    init: function(){
      app.state = app.game;
      app.game.score = 0;
      app.game.time = 60;
      app.game.colors = ['#F22','#F0F','#00F','#FF0','#0FF',
                 '#811','#808','#008','#880','#088'];
      app.game.grid = {
        x: Math.floor(app.width * 0.5 - Math.min(app.width * 0.5, app.height * 0.38)),
        y: Math.floor(app.height * 0.5 - Math.min(app.width * 0.5, app.height * 0.38)),
        w: Math.min(app.width, Math.floor(app.height * 0.76)),
        h: Math.min(app.width, Math.floor(app.height * 0.76))
      };
      if (!app.game.initialised){
        app.game.panel = new app.surface(0, Math.floor(app.height * 0.01),
          app.width, Math.floor(app.height * 0.06));
        app.game.layout.push(app.game.panel);
        app.game.restart = new app.surface(0, Math.floor(app.height * 0.88),
          app.width, Math.floor(app.height * 0.12));
        app.game.layout.push(app.game.restart);
        lib.draw.text(app.game.restart.context, 'RESTART',
          Math.floor(app.game.restart.w * 0.5), Math.floor(app.game.restart.h * 0.5),
          Math.floor(app.game.restart.h * 0.4), 'Arial',
          '#F22', 'center', 'middle');
        for (i = 0; i < 5; i++){
          app.game.shapes.push(new app.sprite(
            Math.floor(app.game.grid.w / 6),
            Math.floor(app.game.grid.h / 6)));
          lib.draw.circle(app.game.shapes[i].context, Math.floor(app.game.shapes[i].w * 0.5),
            Math.floor(app.game.shapes[i].h * 0.5), Math.floor(app.game.shapes[i].w * 0.3),
            app.game.colors[i], true);
          app.game.shades.push(new app.sprite(
            Math.floor(app.game.grid.w / 6),
            Math.floor(app.game.grid.h / 6)));
          lib.draw.circle(app.game.shades[i].context, Math.floor(app.game.shades[i].w * 0.5),
            Math.floor(app.game.shades[i].h * 0.5), Math.floor(app.game.shades[i].w * 0.4),
            app.game.colors[i+5], true);
        }
        app.game.initialised = true;
      }
      app.game.drawpanel(0, app.game.time);
      app.game.timer = window.setInterval(function(){
        app.game.time--;
        app.game.drawpanel(app.game.score, app.game.time);
      }, 1000);

      for (row = 0; row < 6; row++){
      for (col = 0; col < 6; col++){
        app.game.elements.push(new app.game.entity(col, row));
      }}
    },

    input: function(event, x, y){
      switch (event){
        case 'start':
          if (x > app.game.restart.x && x < app.game.restart.x + app.game.restart.w &&
            y > app.game.restart.y && y < app.game.restart.y + app.game.restart.h){
            app.game.over();
          }
          app.game.select(x, y);
          break;
        case 'move':
          app.game.select(x, y);
          break;
        case 'end':
          app.game.remove(x, y);
          break;
        default:
          break;
      }
    },

    update: function(dt){
      for (i = 0; i < app.game.elements.length; i++){
        if (app.game.elements[i].fall){
          app.game.elements[i].gravity(dt);
        }
      }
      if (app.game.time < 0){
        app.game.over();
      }
    },

    render: function(){
      lib.draw.clear(app.context, '#000');
      if (app.game.sequence.length > 0){
        if (app.game.intersected){
          for (i = 0; i < app.game.elements.length; i++){
            element = app.game.elements[i];
            if (element.id == app.game.elements[app.game.sequence[0]].id){
              app.context.drawImage(app.game.shades[element.id].canvas, element.x, element.y);
            }
          }
        } else {
          for (i = 0; i < app.game.sequence.length; i++){
            element = app.game.elements[app.game.sequence[i]];
            app.context.drawImage(app.game.shades[element.id].canvas, element.x, element.y);
          }
        }
      }
      if (app.game.sequence.length > 1){
        for (i = 1; i < app.game.sequence.length; i++){
          lib.draw.line(app.context,
            Math.floor(app.game.elements[app.game.sequence[i - 1]].x + app.game.grid.w / 12),
            Math.floor(app.game.elements[app.game.sequence[i - 1]].y + app.game.grid.h / 12),
            Math.floor(app.game.elements[app.game.sequence[i]].x + app.game.grid.w / 12),
            Math.floor(app.game.elements[app.game.sequence[i]].y + app.game.grid.h / 12),
            app.game.grid.w * 0.02,
            app.game.colors[app.game.elements[app.game.sequence[0]].id]);
        }
      }
      for (i = 0; i < app.game.elements.length; i++){
        element = app.game.elements[i];
        shape = app.game.shapes[element.id];
        app.context.drawImage(app.game.shapes[element.id].canvas, element.x, element.y);
      }
      for (i = 0; i < app.game.layout.length; i++){
        app.game.layout[i].render();
      }
    },

    drawpanel: function(score, time){
      app.game.panel.context.clearRect(0, 0, app.game.panel.w, app.game.panel.h);
      lib.draw.text(app.game.panel.context, 'SCORE:' + score,
        Math.floor(app.game.panel.w * 0.01), Math.floor(app.game.panel.h * 0.01),
        Math.floor(app.game.panel.h * 0.8), 'Arial',
        '#FFF', 'left', 'top');
      lib.draw.text(app.game.panel.context, 'TIME:' + ('0' + Math.floor(time / 60))
        .slice(-2) + ':' + ('0' + time % 60).slice(-2),
        Math.floor(app.game.panel.w * 0.99), Math.floor(app.game.panel.h * 0.01),
        Math.floor(app.game.panel.h * 0.8), 'Arial',
        app.game.time > 10 ? '#FFF' : '#F44', 'right', 'top');
    },

    intersection: function(){
      for (i = 0; i < app.game.sequence.length - 2; i++){
        if (app.game.sequence[i] == app.game.sequence[app.game.sequence.length - 1]){
          return true;
        }
      }
      return false;
    },

    over: function(){
      clearInterval(app.game.timer);
      app.game.elements.splice(0, app.game.elements.length);
      app.game.sequence.splice(0, app.game.sequence.length);
      app.score.init();
    },

    remove: function(){
      if (app.game.sequence.length > 1){
        if (app.game.intersected == true){
          id = app.game.elements[app.game.sequence[0]].id;
          for (i = 0; i < app.game.elements.length; i++){
            if (app.game.elements[i].id == id){
              app.game.elements[i] = null;
              app.game.score++;
            }
          }
        } else {
          for (i = 0; i < app.game.sequence.length; i++){
            app.game.elements[app.game.sequence[i]] = null;
            app.game.score++;
          }
        }
        for (row = 6; row > 0; row--){
          for (col = 6; col > 0; col--){
            pos = 6 * (row - 1) + (col - 1);
            if (app.game.elements[pos] == null){
              app.game.elements[pos] = new app.game.entity(col - 1, row - 1);
              for (i = 1; i < row; i++){
                if (app.game.elements[pos - 6 * i] != null){
                  app.game.elements[pos].id = app.game.elements[pos - 6 * i].id;
                  app.game.elements[pos].y = app.game.elements[pos - 6 * i].y;
                  app.game.elements[pos - 6 * i] = null;
                  break;
                }
              }
            }
          }
        }
        app.game.drawpanel(app.game.score, app.game.time);
      }
      app.game.sequence.splice(0, app.game.sequence.length);
      app.game.intersected = false;
    },

    select: function(x, y){
      for (i = 0; i < app.game.elements.length; i++){
        if (x > app.game.elements[i].x && x < app.game.elements[i].x + app.game.grid.w / 6 &&
          y > app.game.elements[i].y && y < app.game.elements[i].y + app.game.grid.h / 6){
          if (app.game.sequence.length == 0){
            app.game.sequence.push(i);
          } else
          if (app.game.sequence.length > 0 &&
            app.game.sequence[app.game.sequence.length - 2] == i){
            app.game.sequence.splice(app.game.sequence.length - 2, 2);
            if (app.game.intersected){
              app.game.intersected = false;
            }
          } else
          if (app.game.selectcolor(i) &&
            app.game.selectcross(i)){
            app.game.sequence.push(i);
            if (app.game.intersection()){
              app.game.intersected = true;
            }
          }
        }
      }
    },

    selectcolor: function(i){
      return app.game.elements[app.game.sequence[app.game.sequence.length - 1]].id
        == app.game.elements[i].id
        ? true : false;
    },

    selectcross: function(i){
       element = app.game.elements[app.game.sequence[app.game.sequence.length - 1]];
       return element.row == app.game.elements[i].row + 1 &&
          element.col == app.game.elements[i].col ||
          element.row == app.game.elements[i].row - 1 &&
          element.col == app.game.elements[i].col ||
          element.col == app.game.elements[i].col + 1 &&
          element.row == app.game.elements[i].row ||
          element.col == app.game.elements[i].col - 1 &&
          element.row == app.game.elements[i].row
          ? true : false;
    },

    entity: function(col, row){
      this.id = Math.floor(Math.random() * 5);
      this.col = col;
      this.row = row;
      this.x = Math.floor(app.game.grid.x + app.game.grid.w / 6 * this.col);
      this.y = app.game.grid.y;
      this.fall = true;

      this.gravity = function(dt){
        dest = Math.floor(app.game.grid.y + app.game.grid.h / 6 * this.row);
        anim = Math.floor(app.game.grid.h * 1.75 * dt);
        if (this.y + anim < dest){
          this.y = this.y + anim;
          this.fall = true;
        } else {
          this.y = dest;
          this.fall = false;
        }
      }
    }
  },

  score: {
    layout: [],
    best: null,
    last: null,
    menu: null,
    play: null,
    stars: null,
    title: null,
    initialised: false,
    highscore: 0,

    init: function(){
      app.state = app.score;
      app.score.highscore = localStorage.getItem('highscore') || 0;
      if (app.game.score > app.score.highscore){
        localStorage.setItem('highscore', app.game.score);
        app.score.highscore = app.game.score;
      }
      if (!app.score.initialised){
        app.score.title = new app.surface(0, Math.floor(app.height * 0.22),
          app.width, Math.floor(app.height * 0.08));
        lib.draw.text(app.score.title.context, 'HIGHSCORE',
          Math.floor(app.score.title.w * 0.5), Math.floor(app.score.title.h * 0.5),
          Math.floor(app.score.title.h * 0.8), 'Arial',
          '#AE0', 'center', 'middle');
        app.score.layout.push(app.score.title);
        app.score.stars = new app.surface(0, Math.floor(app.height * 0.35),
          app.width, Math.floor(app.height * 0.08));
        app.score.layout.push(app.score.stars);
        app.score.best = new app.surface(0, Math.floor(app.height * 0.48),
          app.width, Math.floor(app.height * 0.04));
        app.score.layout.push(app.score.best);
        app.score.last = new app.surface(0, Math.floor(app.height * 0.52),
          app.width, Math.floor(app.height * 0.04));
        app.score.layout.push(app.score.last);
        app.score.play = new app.surface(0, Math.floor(app.height * 0.64),
          app.width, Math.floor(app.height * 0.08));
        app.score.layout.push(app.score.play);
        lib.draw.text(app.score.play.context, 'PLAY',
          Math.floor(app.score.play.w * 0.5), Math.floor(app.score.play.h * 0.5),
          Math.floor(app.score.play.h * 0.8), 'Arial',
          '#FFF', 'center', 'middle');
        app.score.initialised = true;
      }
      app.score.stars.context.clearRect(0, 0, app.score.stars.w, app.score.stars.h);
      for (i = 0; i < 3; i++){
        lib.draw.star(app.score.stars.context,
          Math.floor(app.score.stars.w * (0.38 + 0.12 * i)),
          Math.floor(app.score.stars.h * 0.5), Math.floor(app.score.stars.h * 0.4),
          5, 0.5, '#FF0', (i == 0 ? 200 : i == 1 ? 500 : 1000) < app.game.score ? true : false);
      }
      app.score.best.context.clearRect(0, 0, app.score.best.w, app.score.best.h);
      lib.draw.text(app.score.best.context, 'BEST:' + app.score.highscore,
        Math.floor(app.score.best.w * 0.5), Math.floor(app.score.best.h * 0.5),
        Math.floor(app.score.best.h * 0.8), 'Arial',
        '#FFF', 'center', 'middle');
      app.score.last.context.clearRect(0, 0, app.score.last.w, app.score.last.h);
      lib.draw.text(app.score.last.context, 'LAST:' + app.game.score,
        Math.floor(app.score.last.w * 0.5), Math.floor(app.score.last.h * 0.5),
        Math.floor(app.score.last.h * 0.8), 'Arial',
        '#FFF', 'center', 'middle');
    },

    input: function(event, x, y){
      if (event == 'start'){
        if (x > app.score.play.x && x < app.score.play.x + app.score.play.w &&
          y > app.score.play.y && y < app.score.play.y + app.score.play.h){
          app.game.init();
        }
      }
    },

    update: function(dt){},

    render: function(){
      lib.draw.clear(app.context, '#000');
      for (i = 0; i < app.score.layout.length; i++){
        app.score.layout[i].render();
      }
    }
  },

  sprite: function(w, h){
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.w = w;
    this.canvas.height = this.h = h;
    this.context = this.canvas.getContext('2d');

    this.render = function(x, y){
      app.context.drawImage(this.canvas, x, y, this.w, this.h);
    }
  },

  surface: function(x, y, w, h){
    this.x = x;
    this.y = y;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.w = w;
    this.canvas.height = this.h = h;
    this.context = this.canvas.getContext('2d');

    this.render = function(){
      app.context.drawImage(this.canvas, this.x, this.y, this.w, this.h);
    }
  }
};

var lib = {
  draw: {
    clear: function(surface, color){
      surface.fillStyle = color;
      surface.fillRect(0, 0, app.width, app.height);
    },

    line: function(surface, x1, y1, x2, y2, width, color){
      surface.strokeStyle = color;
      surface.lineWidth = width;
      surface.lineCap = 'round';
      surface.lineJoin = 'round';
      surface.beginPath();
      surface.moveTo(x1, y1);
      surface.lineTo(x2, y2);
      surface.closePath();
      surface.stroke();
    },

    rect: function(surface, x, y, w, h, color, fill){
      if (fill){
        surface.fillStyle = color;
        surface.fillRect(x, y, w, h);
      } else {
        surface.strokeStyle = color;
        surface.strokeRect(x, y, w, h);
      }
    },

    circle: function(surface, x, y, r, color, fill){
      if (fill){
        surface.fillStyle = color;
      } else {
        surface.strokeStyle = color;
      }
      surface.beginPath();
      surface.arc(x, y, r, 0, Math.PI * 2, true);
      surface.closePath();
      if (fill){
        surface.fill();
      } else {
        surface.stroke();
      }
    },

    regular: function(surface, x, y, r, sides, angle, color, fill){
      if (sides < 3) return;
      surface.save();
      if (fill){
        surface.fillStyle = color;
      } else {
        surface.strokeStyle = color;
      }
      surface.beginPath();
      a = ((Math.PI * 2) / sides);
      surface.translate(x, y);
      surface.rotate(angle);
      surface.moveTo(r, 0);
      for (var i = 1; i < sides; i++){
        surface.lineTo(r * Math.cos(a * i),
          r * Math.sin(a * i));
      }
      surface.closePath();
      if (fill){
        surface.fill();
      } else {
        surface.stroke();
      }
      surface.restore();
    },

    star: function(surface, x, y, r, points, fraction, color, fill)
    {
      surface.save();
      if (fill){
        surface.fillStyle = color;
      } else {
        surface.strokeStyle = color;
      }
      surface.beginPath();
      surface.translate(x, y);
      surface.moveTo(0, 0 - r);
      for (var i = 0; i < points; i++)
      {
        surface.rotate(Math.PI / points);
        surface.lineTo(0, 0 - (r * fraction));
        surface.rotate(Math.PI / points);
        surface.lineTo(0, 0 - r);
      }
      if (fill){
        surface.fill();
      } else {
        surface.stroke();
      }
      surface.restore();
    },

    text: function(surface, string, x, y, size, font, color, align, base){
      surface.font = size + 'px ' + font;
      surface.textAlign = align ? align : 'left';
      surface.textBaseline = base ? base : 'top';
      surface.fillStyle = color;
      surface.fillText(string, x, y);
    }
  }
};
