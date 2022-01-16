var roles = ["top", "jungle", "middle", "bottom", "utility"];

function convertTimer(timer) {
    if (timer.toString().length === 1) {
        return '0' + timer;
    }
    return timer;
}

PB.on('statusChange', newStatus => {
});

PB.on('newState', newState => {
    //console.log(newState);
    const state = newState.state;
    const config = state.config.frontend;

    let activeTeam = 'blue';
    if (state.redTeam.isActive) {
        activeTeam = 'red';
    }

    // Update timers
    if (activeTeam === 'blue' && state.state != '') {
        document.getElementById('red_timer').innerText = '';
        document.getElementById('blue_timer').innerText = ':' + convertTimer(state.timer);
        
        document.getElementsByClassName("blue-timer")[0].classList.add("turn-blue");
        document.getElementsByClassName("blue-timer")[0].classList.remove("turn-black");
        document.getElementsByClassName("red-timer")[0].classList.add("turn-black");
        document.getElementsByClassName("red-timer")[0].classList.remove("turn-red");
    } else if (activeTeam === 'red' && state.state != '') {
        document.getElementById('blue_timer').innerText = '';
        document.getElementById('red_timer').innerText = ':' + convertTimer(state.timer);
        
        document.getElementsByClassName("red-timer")[0].classList.add("turn-red");
        document.getElementsByClassName("red-timer")[0].classList.remove("turn-black");
        document.getElementsByClassName("blue-timer")[0].classList.add("turn-black");
        document.getElementsByClassName("blue-timer")[0].classList.remove("turn-blue");
    } else {
        document.getElementById('blue_timer').innerText = ':' + convertTimer(state.timer);
        document.getElementById('red_timer').innerText = ':' + convertTimer(state.timer);

        document.getElementsByClassName("blue-timer")[0].classList.add("turn-blue");
        document.getElementsByClassName("red-timer")[0].classList.add("turn-red");
    }

    // Update team names
    document.getElementById('blue_initials').innerText = config.blueTeam.initials;
    document.getElementById('red_initials').innerText = config.redTeam.initials;
    document.getElementById('blue_name').innerText = config.blueTeam.name;
    document.getElementById('red_name').innerText = config.redTeam.name;

    // Update score
    document.getElementById('score').innerText = config.blueTeam.score + ' - ' + config.redTeam.score;

    // Update phase
    const updatePhase = () => {
        document.getElementById('phase').innerText = state.state;

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
        } else {
            document.getElementById('phase').innerText = "PREPARATION";
            for (let i = 0; i < blue_pickList.length && red_pickList.length; i++) {
                blue_pickList[i].classList.remove("three-small-two-big");
                red_pickList[i].classList.remove("three-small-two-big");
            }
        }
    };
    updatePhase();

    // Update picks
    const updatePicks = team => {
        const teamData = team === 'blue' ? state.blueTeam : state.redTeam;
        //console.log(teamData);

        teamData.picks.forEach((pick, index) => {
            const splash = document.getElementById(`picks_${team}_splash_${index}`);
            const champ = document.getElementById(`picks_${team}_champ_${index}`);
            const text = document.getElementById(`picks_${team}_text_${index}`);

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
                splash.style.backgroundImage = PB.toAbsoluteUrl(pick.champion.splashCenteredImg);
                splash.classList.remove('blank');
                //splash.classList.remove('hidden');
            }

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

            if (ban.champion.id === 0) {
                // Not banned yet, hide
                //splash.classList.add('blank');
            } else {
                // We have a ban to show
                splash.style.backgroundImage = PB.toAbsoluteUrl(ban.champion.splashCenteredImg);
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
});
PB.on('champSelectEnded', () => {
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
