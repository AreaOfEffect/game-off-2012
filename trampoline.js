var PLAYGROUND_HEIGHT = 800;
        var PLAYGROUND_WIDTH = 700;

$("#playground").playground({height: PLAYGROUND_HEIGHT, width: PLAYGROUND_WIDTH})
          .addGroup("background", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT}).end()
          .addGroup("balloons", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT}).end()
          .addGroup("forks",{width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT}).end()
          .addGroup("trampoline",{width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT});