var roles = ["top", "jungle", "middle", "bottom", "utility"];
 
 function addEventLog(name) {
     const eventsNode = document.getElementById('events');
     eventsNode.innerHTML = eventsNode.innerHTML + '<tr><td>' + new Date().toLocaleString() + '</td><td>' + name + '</td></tr>';
 }

 function convertTimer(timer) {
    if (timer.toString().length === 1) {
        return '0' + timer;
    }
    return timer;
}

 PB.on('statusChange', newStatus => {
    //document.getElementById("status").innerText = newStatus;
    // addEventLog('statusChange');
 });

 PB.on('newState', newState => {
    //console.log(newState);
    //addEventLog('newState');
    const state = newState.state;
    const config = state.config.frontend;

    // Insert Team Initials and Names from config.json
    document.getElementById('blue_initials').innerText = config.blueTeam.initials;
    document.getElementById('blue_name').innerText = config.blueTeam.name;
    document.getElementById('red_name').innerText = config.redTeam.name;
    document.getElementById('red_initials').innerText = config.redTeam.initials;

    // Insert Team Scores from config.json
    document.getElementById('blue_score').innerText = config.blueTeam.score;
    document.getElementById('red_score').innerText = config.redTeam.score;

    // Insert Round and Game # from config.json
    document.getElementById('round').innerText = config.round;
    document.getElementById('game').innerText = "GAME " + config.game;

    // Tick timer every heart beat
    document.getElementById('timer').innerText = ':' + convertTimer(state.timer);

    let activeTeam = 'blue';
    if (state.redTeam.isActive) {
        activeTeam = 'red';
    }

    const updatePhase = () => {
        blue_pickList = document.getElementById("picks_blue").getElementsByClassName("pick");
        red_pickList = document.getElementById("picks_red").getElementsByClassName("pick");
        blue_banList = document.getElementById("bans_blue").getElementsByClassName("ban");
        red_banList = document.getElementById("bans_red").getElementsByClassName("ban");

        if (state.state == "BAN PHASE 1") {
            for (let i = 0; i < blue_pickList.length && red_pickList.length; i++) {
                blue_pickList[i].classList.remove("three-big-two-small");
                red_pickList[i].classList.remove("three-big-two-small");
            }

            for (let i = 0; i < blue_banList.length && red_banList.length; i++) {
                blue_banList[i].classList.add("three-big-two-small");
                red_banList[i].classList.add("three-big-two-small");
            }
        } else if (state.state == "PICK PHASE 1") {
            for (let i = 0; i < blue_pickList.length && red_pickList.length; i++) {
                blue_pickList[i].getElementsByClassName("splash")[0].style.height = blue_pickList[i].clientHeight;
                blue_pickList[i].classList.add("three-big-two-small");
                red_pickList[i].getElementsByClassName("splash")[0].style.height = blue_pickList[i].clientHeight;
                red_pickList[i].classList.add("three-big-two-small");
            }

            for (let i = 0; i < blue_banList.length && red_banList.length; i++) {
                blue_banList[i].classList.remove("three-big-two-small");
                red_banList[i].classList.remove("three-big-two-small");
            }
        } else if (state.state == "BAN PHASE 2") {
            for (let i = 0; i < blue_pickList.length && red_pickList.length; i++) {
                blue_pickList[i].classList.remove("three-big-two-small");
                red_pickList[i].classList.remove("three-big-two-small");
            }

            for (let i = 0; i < blue_banList.length && red_banList.length; i++) {
                blue_banList[i].classList.add("three-small-two-big");
                red_banList[i].classList.add("three-small-two-big");
            }
        } else if (state.state == "PICK PHASE 2") {
            for (let i = 0; i < blue_pickList.length && red_pickList.length; i++) {
                blue_pickList[i].classList.add("three-small-two-big");
                red_pickList[i].classList.add("three-small-two-big");
            }

            for (let i = 0; i < blue_banList.length && red_banList.length; i++) {
                blue_banList[i].classList.remove("three-small-two-big");
                red_banList[i].classList.remove("three-small-two-big");
            }
        } else if (state.state !== "PICK 1" && state.state == "") {
            for (let i = 0; i < blue_pickList.length && red_pickList.length; i++) {
                blue_pickList[i].classList.remove("three-small-two-big");
                red_pickList[i].classList.remove("three-small-two-big");
            }

            setTimeout(() => {
                allSpells = document.getElementsByClassName("spells-container");
                for(let i = 0; i < allSpells.length; i++) {
                    allSpells[i].classList.remove("hidden");
                    allSpells[i].classList.remove("out-of-bounds");
                }
            }, 2500);
        }
    };
    updatePhase();

    const updatePicks = team => {
        const teamData = team === 'blue' ? state.blueTeam : state.redTeam;
        //console.log(teamData);

        teamData.picks.forEach((pick, index) => {
            const splash = document.getElementById(`picks_${team}_splash_${index}`);
            const champ = document.getElementById(`picks_${team}_champ_${index}`);
            const text = document.getElementById(`picks_${team}_text_${index}`);
            const spell1 = document.getElementById(`picks_${team}_${index}_spell1`);
            const spell2 = document.getElementById(`picks_${team}_${index}_spell2`);

            // Handle active pick to glow
            if (pick.isActive) {
                splash.classList.add("pick-glow");
            } else {
                splash.classList.remove("pick-glow");
            }

            if (pick.champion.id === 0) {
                // Not picked yet, hide
                //splash.classList.add('hidden');
            } else {
                // We have a pick to show
                splash.style.backgroundImage = `url(${PB.toAbsoluteUrl(pick.champion.splashCenteredImg)})`;
                splash.classList.remove('blank');
                //splash.classList.remove('hidden');
            }

            // Handle spells
            spell1.style.backgroundImage = `url(${PB.toAbsoluteUrl(pick.spell1.icon)})`;
            spell2.style.backgroundImage = `url(${PB.toAbsoluteUrl(pick.spell2.icon)})`;

            champ.innerText = pick.champion.name;
            text.innerText = pick.displayName;
        });

        teamData.bans.forEach((ban, index) => {
            const splash = document.getElementById(`bans_${team}_splash_${index}`);

            if (ban.isActive) {
                splash.classList.add("ban-glow");
            } else {
                splash.classList.remove("ban-glow");
            }

            if (!ban.isActive && ban.champion.name !== "") {
                splash.classList.add("grayscale");
            }

            if (ban.champion.id === 0) {
                // Not banned yet, hide
                //splash.classList.add('blank');
            } else {
                // We have a ban to show
                splash.style.backgroundImage = `url(${PB.toAbsoluteUrl(ban.champion.splashCenteredImg)})`;
                splash.style.backgroundSize = "250%";
                splash.classList.remove('blank');
                //splash.classList.remove('hidden');
            }

            //console.log(splash, ban);
        });
    }; 
    updatePicks('blue');
    updatePicks('red');
 });

 PB.on('heartbeat', newHb => {
    Window.CONFIG = newHb.config;
 });

 PB.on('champSelectStarted', () => {
    addEventLog('champSelectStarted');
 });

 PB.on('champSelectEnded', () => {
    addEventLog('champSelectEnded');
 });

 PB.start();

function parseHTML(html) {
    const t = document.createElement('template');
    t.innerHTML = html;
    return t.content.cloneNode(true);
}

function inject(team) {
    const pickTemplate = `
        <div class="pick" id="pick_${team}_%id%">
            <div class="splash blank" id="picks_${team}_splash_%id%"/>
            <div class="text-champ" id="picks_${team}_champ_%id%"></div> 
            <div class="text-ign" id="picks_${team}_text_%id%"></div>
            <div class="spells-container hidden out-of-bounds" id="picks_${team}_spells_%id%">
                <div class="spell" id="picks_${team}_%id%_spell1"></div>
                <div class="spell" id="picks_${team}_%id%_spell2"></div>
            </div> 
        </div>`;

    const banTemplate = `
        <div class="ban" id="ban_${team}_%id%">
            <div class="splash blank" id="bans_${team}_splash_%id%"/>
        </div>`;

    for (let i = 0; i < 5; i++) {
        const adaptedPickTemplate = pickTemplate.replace(/%id%/g, i);
        document.getElementById('picks_' + team).appendChild(parseHTML(adaptedPickTemplate));
        
        const adaptedBanTemplate = banTemplate.replace(/%id%/g, i);
        document.getElementById('bans_' + team).appendChild(parseHTML(adaptedBanTemplate));
    }

    for (let i = 0; i < 5; i++) {
        document.getElementById(`picks_${team}_splash_${i}`).style.backgroundImage = `url("./imgs/role-${roles[i]}.png")`
    }
}
inject('blue');
inject('red');
