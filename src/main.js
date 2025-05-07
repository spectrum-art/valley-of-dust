import * as THREE from 'three';
import { GUI } from 'dat.gui';
import Game from './Game.js';

const game = new Game(800, 600);
game.start();
