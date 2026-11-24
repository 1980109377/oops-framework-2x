
import super_html_playable from './super_html_playable';

export class SDKManager {

    constructor() {
        this.onLoad();
    }
    public onLoad(): void {
        super_html_playable.game_ready();
    }

    public gameFinish(): void {
        super_html_playable.game_end();
    }

    public clickDown(): void {
        super_html_playable.download();
    }
}


