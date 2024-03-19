const MAX_ATTACK = 10;
const MAX_STRONG_ATTACK = 15;
const MAX_HEAL = 20;
const INITIAL_HEALTH = 100;
const log = [];
let playerHealth = INITIAL_HEALTH;
let monsterHealth = INITIAL_HEALTH;
let turns = 0;
let strongAttackTurn = -2;
let healTurn = -3;
let lives = 1;
let settled = false;

const buttons = document.querySelectorAll("button");
buttons.forEach((element) => element.addEventListener("click", btnClicked));

function btnClicked() {
  if (this.textContent === "SHOW LOG") {
    showLog();
  } else {
    if (this.textContent === "ATTACK") {
      attack(MAX_ATTACK);
    }
    if (this.textContent === "STRONG ATTACK") {
      attack(MAX_STRONG_ATTACK);
      strongAttackTurn = turns;
      this.disabled = true;
    }
    if (this.textContent === "HEAL") {
      heal();
      healTurn = turns;
      this.disabled = true;
    }
    turns++;
    if (!settled) {
      checkAndEnable();
    }
  }
}

function attack(maxAttack, playerAttacks = true) {
  const monsterAttack = Math.random() * (maxAttack + 1);
  playerHealth -= monsterAttack;
  log.push(`The monster dealt ${monsterAttack} damage to the player`);
  if (playerAttacks) {
    const playerAttack = Math.random() * (maxAttack + 1);
    monsterHealth -= playerAttack;
    log.push(`The player dealt ${playerAttack} damage to the monster`);
  }
  handleResults(monsterAttack);
  updateUI(playerHealth, monsterHealth);
}

function heal() {
  let playerHeal = Math.random() * (MAX_HEAL + 1);
  let currentHealth = playerHealth;
  playerHealth = Math.min(playerHealth + playerHeal, INITIAL_HEALTH);
  log.push(`The player healed himself with ${playerHealth - currentHealth} HP`);
  attack(MAX_ATTACK, false);
}

function showLog() {
  log.forEach((element) => console.log(element));
}

function updateUI(playerHealth, monsterHealth) {
  const monsterHealthbar = document.querySelector(".healthbar.monster");
  const playerHealthbar = document.querySelector(".healthbar.player");
  const playerHealthPercent = (playerHealth / INITIAL_HEALTH) * 100;
  const monsterHealthPercent = (monsterHealth / INITIAL_HEALTH) * 100;
  monsterHealthbar.style.width = monsterHealthPercent + "%";
  playerHealthbar.style.width = playerHealthPercent + "%";
}

function checkAndEnable() {
  if (turns > strongAttackTurn + 2) {
    document.querySelector(".strong-attack").disabled = false;
  }
  if (turns > healTurn + 3) {
    document.querySelector(".heal").disabled = false;
  }
}

function handleResults(monsterAttack) {
  if (playerHealth <= 0) {
    settled = true;
    if (lives) {
      playerHealth += monsterAttack;
      lives--;
      document.querySelector(".lives").innerHTML = lives;
      alert("You would have been dead, but your extra life saved you");
      settled = false;
    } else if (monsterHealth <= 0) {
      monsterHealth = 0;
      playerHealth = 0;
      alert("Draw");
    } else {
      playerHealth = 0;
      alert("Player loses");
    }
  }
  if (monsterHealth <= 0) {
    monsterHealth = 0;
    settled = true;
    alert("Player wins");
  }
  if (settled) {
    disableButtons();
  }
}

function disableButtons() {
  document
    .querySelectorAll("button:not(.show-log)")
    .forEach((element) => (element.disabled = true));
}
