import Player from '../lib/player';
import app    from '../lib/app';
import utils from '../utils/utils';

import LibraryActions      from './LibraryActions';
import PlaylistsActions    from './PlaylistsActions';
import ToastsActions       from './ToastsActions';
import NotificationActions from './NotificationActions';
import PlayerActions       from './PlayerActions';
import QueueActions        from './QueueActions';
import SettingsActions     from './SettingsActions';

const globalShortcut = electron.remote.globalShortcut;
const ipcRenderer    = electron.ipcRenderer;

const init = () => {
    // Usual tasks
    LibraryActions.load();
    PlaylistsActions.refresh();
    SettingsActions.check();
    initShortcuts();
    start();

    // Bind player events
    // Audio Events
    Player.getAudio().addEventListener('ended', PlayerActions.next);
    Player.getAudio().addEventListener('error', PlayerActions.audioError);
    Player.getAudio().addEventListener('timeupdate', () => {
        if (Player.isThresholdReached()) {
            LibraryActions.incrementPlayCount(Player.getSrc());
        }
    });

    Player.getAudio().addEventListener('play', async () => {
        try {
            ipcRenderer.send('playerAction', 'play');
            console.log("play!!!!!!!!!");
            let path = '';
            let cover = '';
            const isStream = Player.getSrc().indexOf('http') === 0;
            if (isStream) {
                path = Player.getSrc();
            } else {
                path = decodeURIComponent(Player.getSrc()).replace('file://', '');
            }
            console.log("before track!!!!!!!!!!", path);
            const track = await utils.getMetadata(path);
            if (!isStream) {
                cover = await utils.fetchCover(track.path);
            }
            console.log("finish!!!!!!!!!", track, isStream, cover);

            ipcRenderer.send('playerAction', 'trackStart', track);

            if(app.browserWindows.main.isFocused()) return;

            NotificationActions.add({
                title: track.title,
                body: `${track.artist}\n${track.album}`,
                icon: cover,
            });
            
        } catch (error) {
            console.log("!!!!!!!!!!", error);
        }
    });

    Player.getAudio().addEventListener('pause', () => {
        ipcRenderer.send('playerAction', 'pause');
    });

    // Listen for main-process events
    ipcRenderer.on('playerAction', (event, reply) => {
        switch(reply) {
            case 'play':
                PlayerActions.play();
                break;
            case 'pause':
                PlayerActions.pause();
                break;
            case 'prev':
                PlayerActions.previous();
                break;
            case 'next':
                PlayerActions.next();
                break;
        }
    });

    // Listen for main-process events
    ipcRenderer.on('close', () => {
        close();
    });

    // Prevent some events
    window.addEventListener('dragover', (e) => {
        e.preventDefault();
    }, false);

    window.addEventListener('drop', (e) => {
        e.preventDefault();
    }, false);

    // Remember dimensions and positionning
    const currentWindow = app.browserWindows.main;

    currentWindow.on('resize', saveBounds);

    currentWindow.on('move', saveBounds);
};

const start = () => {
    ipcRenderer.send('appReady');
};

const restart = () => {
    ipcRenderer.send('appRestart');
};

const close = () => {
    if(app.config.get('minimizeToTray')) {
        app.browserWindows.main.hide();
    } else {
        app.browserWindows.main.destroy();
    }
};

const minimize = () => {
    app.browserWindows.main.minimize();
};

const maximize = () => {
    app.browserWindows.main.isMaximized() ? app.browserWindows.main.unmaximize() : app.browserWindows.main.maximize();
};

const saveBounds = () => {
    const now = window.performance.now();

    if (now - self.lastFilterSearch < 250) {
        clearTimeout(self.filterSearchTimeOut);
    }

    self.lastFilterSearch = now;

    self.filterSearchTimeOut = setTimeout(() => {
        app.config.set('bounds', app.browserWindows.main.getBounds());
        app.config.saveSync();
    }, 250);
};

const initShortcuts = () => {
    // Global shortcuts - Player
    globalShortcut.register('MediaPlayPause', () => {
        PlayerActions.playToggle();
    });

    globalShortcut.register('MediaPreviousTrack', () => {
        PlayerActions.previous();
    });

    globalShortcut.register('MediaNextTrack', () => {
        PlayerActions.next();
    });
};

export default {
    player        : PlayerActions,
    playlists     : PlaylistsActions,
    queue         : QueueActions,
    library       : LibraryActions,
    settings      : SettingsActions,
    toasts        : ToastsActions,
    notifications : NotificationActions,

    close,
    init,
    initShortcuts,
    maximize,
    minimize,
    saveBounds,
    start,

    app: {
        restart,
    },
};
