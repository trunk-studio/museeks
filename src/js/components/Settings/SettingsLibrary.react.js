import React, { Component } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';

import Dropzone from '../Shared/Dropzone.react';

import AppActions from '../../actions/AppActions';

const dialog = electron.remote.dialog;


/*
|--------------------------------------------------------------------------
| Child - SettingsLibrary - manage import folders for library
|--------------------------------------------------------------------------
*/

export default class SettingsLibrary extends Component {

    static propTypes = {
        config: React.PropTypes.object,
        library: React.PropTypes.object,
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='setting settings-musicfolder'>
                <div className='setting-section'>
                    <h4>Manage library</h4>
                    <Dropzone
                        title='新增音樂'
                        subtitle='Drop files or folders here'
                        onDrop={ this.onDrop }
                        onClick={ this.openFolderSelector }
                    />
                    <ButtonGroup>
                        <Button
                            bsSize='small'
                            bsStyle={ 'danger' }
                            title='Fully reset the library'
                            disabled={ this.props.library.refreshing }
                            onClick={ this.resetLibrary }
                        >
                            清空音樂庫
                        </Button>
                        <Button
                            bsSize='small'
                            bsStyle={ 'success' }
                            title='新增串流音樂'
                            onClick={ this.addStreamMusic }
                        >
                            新增串流音樂
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
        );
    }

    resetLibrary() {
        AppActions.player.stop();
        AppActions.library.reset();
    }

    addStreamMusic() {
        AppActions.library.add([
            'http://www.sample-videos.com/audio/mp3/india-national-anthem.mp3',
        ]);
    }

    onDrop(e) {
        const files = [];
        const eventFiles = e.dataTransfer.files;

        for(let i = 0; i < eventFiles.length; i++) {
            files.push(eventFiles[i].path);
        }

        AppActions.library.add(files);
    }

    openFolderSelector() {
        dialog.showOpenDialog({
            properties: ['multiSelections', 'openDirectory'],
        }, (result) => {
            if(result) {
                AppActions.library.add(result);
            }
        });
    }
}
